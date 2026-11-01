import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preference: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException("User not found");
    }

    const {
      passwordHash: _,
      emailVerificationToken: __,
      passwordResetToken: ___,
      ...safeUser
    } = user;

    return safeUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatarUrl: dto.avatarUrl,
      },
      include: {
        preference: true,
      },
    });

    const {
      passwordHash: _,
      emailVerificationToken: __,
      passwordResetToken: ___,
      ...safeUser
    } = user;

    return safeUser;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const preference = await this.prisma.userPreference.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });

    return preference;
  }

  async deleteAccount(userId: string) {
    // Soft delete user and invalidate active sessions
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
        },
      }),
      this.prisma.session.deleteMany({
        where: { userId },
      }),
      this.prisma.auditLog.create({
        data: {
          userId,
          action: "USER_DELETED_ACCOUNT",
          entityType: "User",
          entityId: userId,
        },
      }),
    ]);

    return { success: true, message: "Account deleted successfully" };
  }
}
