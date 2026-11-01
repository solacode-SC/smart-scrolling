import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

const SESSION_EXPIRY_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

    await this.prisma.session.create({
      data: {
        userId,
        token,
        userAgent: userAgent?.substring(0, 500),
        ipAddress: ipAddress?.substring(0, 100),
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  async validateSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            preference: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    if (new Date() > session.expiresAt) {
      // Session expired, remove it asynchronously
      await this.prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }

    if (session.user.deletedAt) {
      return null;
    }

    // Sanitize user object
    const {
      passwordHash,
      emailVerificationToken,
      passwordResetToken,
      ...safeUser
    } = session.user;

    return {
      session,
      user: safeUser,
    };
  }

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException(
        "An account with this email address already exists",
      );
    }

    const passwordHash = await this.hashPassword(dto.password);
    const emailVerificationToken = this.generateSecureToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        name: dto.name.trim(),
        passwordHash,
        emailVerificationToken,
        emailVerificationExpires,
        preference: {
          create: {},
        },
      },
      include: {
        preference: true,
      },
    });

    const session = await this.createSession(user.id, userAgent, ipAddress);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });

    const {
      passwordHash: _,
      emailVerificationToken: __,
      passwordResetToken: ___,
      ...safeUser
    } = user;

    return {
      user: safeUser,
      sessionToken: session.token,
      verificationToken: emailVerificationToken, // Provided for dev environment testing
    };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        preference: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValid = await this.verifyPassword(user.passwordHash, dto.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const session = await this.createSession(user.id, userAgent, ipAddress);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        entityType: "User",
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });

    const {
      passwordHash: _,
      emailVerificationToken: __,
      passwordResetToken: ___,
      ...safeUser
    } = user;

    return {
      user: safeUser,
      sessionToken: session.token,
    };
  }

  async logout(token: string) {
    if (!token) return;

    const session = await this.prisma.session.findUnique({
      where: { token },
    });

    if (session) {
      await this.prisma.session.delete({
        where: { token },
      });

      await this.prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "USER_LOGOUT",
          entityType: "Session",
          entityId: session.id,
        },
      });
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    // Don't leak whether user exists
    if (!user || user.deletedAt) {
      return {
        success: true,
        message:
          "If that email exists in our system, a password reset link has been sent.",
      };
    }

    const token = this.generateSecureToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    return {
      success: true,
      message:
        "If that email exists in our system, a password reset link has been sent.",
      resetToken: process.env.NODE_ENV !== "production" ? token : undefined,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new BadRequestException(
        "Password reset token is invalid or has expired",
      );
    }

    const passwordHash = await this.hashPassword(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      }),
      // Invalidate all active sessions for security
      this.prisma.session.deleteMany({
        where: { userId: user.id },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET",
          entityType: "User",
          entityId: user.id,
        },
      }),
    ]);

    return { success: true, message: "Password has been successfully updated" };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: dto.token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        "Verification token is invalid or has expired",
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { success: true, message: "Email verified successfully" };
  }
}
