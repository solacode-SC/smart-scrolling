import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "../../src/auth/auth.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let authService: AuthService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        findFirst: vi.fn(),
      },
      session: {
        create: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn((callbacks) => Promise.all(callbacks)),
    };

    authService = new AuthService(prismaMock as unknown as PrismaService);
  });

  describe("Password Hashing", () => {
    it("should hash a password using Argon2id and verify it successfully", async () => {
      const password = "UltraSecurePassword123!";
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toContain("$argon2id$");

      const isValid = await authService.verifyPassword(hash, password);
      expect(isValid).toBe(true);

      const isInvalid = await authService.verifyPassword(hash, "WrongPassword");
      expect(isInvalid).toBe(false);
    });
  });

  describe("Register", () => {
    it("should reject registration if email is already taken", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: "existing-id",
        email: "taken@example.com",
      });

      await expect(
        authService.register({
          email: "taken@example.com",
          name: "Existing User",
          password: "Password123!",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("should register a new user, create session, and sanitize output", async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.user.create.mockImplementationOnce(({ data }) =>
        Promise.resolve({
          id: "new-user-id",
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          emailVerified: false,
          emailVerificationToken: data.emailVerificationToken,
          emailVerificationExpires: data.emailVerificationExpires,
          createdAt: new Date(),
          updatedAt: new Date(),
          preference: { theme: "system" },
        }),
      );
      prismaMock.session.create.mockResolvedValueOnce({
        id: "session-id",
        token: "token-abc",
      });

      const result = await authService.register({
        email: "newuser@example.com",
        name: "New User",
        password: "Password123!",
      });

      expect(result.user).toBeDefined();
      expect(result.user.id).toBe("new-user-id");
      expect((result.user as any).passwordHash).toBeUndefined();
      expect(result.sessionToken).toBeDefined();
    });
  });

  describe("Login", () => {
    it("should reject login with wrong password", async () => {
      const hashedPassword = await authService.hashPassword(
        "CorrectPassword123!",
      );
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: "u-1",
        email: "user@example.com",
        passwordHash: hashedPassword,
        deletedAt: null,
      });

      await expect(
        authService.login({
          email: "user@example.com",
          password: "WrongPassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should login successfully with correct credentials", async () => {
      const password = "CorrectPassword123!";
      const hashedPassword = await authService.hashPassword(password);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: "u-1",
        email: "user@example.com",
        passwordHash: hashedPassword,
        deletedAt: null,
        preference: { theme: "system" },
      });
      prismaMock.session.create.mockResolvedValueOnce({
        id: "sess-1",
        token: "valid-token",
      });

      const result = await authService.login({
        email: "user@example.com",
        password,
      });

      expect(result.user.id).toBe("u-1");
      expect(result.sessionToken).toBeDefined();
      expect((result.user as any).passwordHash).toBeUndefined();
    });
  });

  describe("Session Validation", () => {
    it("should return null if session is not found", async () => {
      prismaMock.session.findUnique.mockResolvedValueOnce(null);
      const res = await authService.validateSession("non-existent");
      expect(res).toBeNull();
    });

    it("should return null and delete session if expired", async () => {
      const pastDate = new Date(Date.now() - 10000);
      prismaMock.session.findUnique.mockResolvedValueOnce({
        id: "expired-sess",
        token: "expired-token",
        expiresAt: pastDate,
        user: { id: "u-1", preference: {} },
      });
      prismaMock.session.delete.mockResolvedValueOnce({});

      const res = await authService.validateSession("expired-token");
      expect(res).toBeNull();
      expect(prismaMock.session.delete).toHaveBeenCalledWith({
        where: { token: "expired-token" },
      });
    });

    it("should return safe user if session is valid", async () => {
      const futureDate = new Date(Date.now() + 1000000);
      prismaMock.session.findUnique.mockResolvedValueOnce({
        id: "valid-sess",
        token: "valid-token",
        expiresAt: futureDate,
        user: {
          id: "u-1",
          name: "Jane Doe",
          email: "jane@example.com",
          passwordHash: "secret-hash",
          deletedAt: null,
          preference: { theme: "dark" },
        },
      });

      const res = await authService.validateSession("valid-token");
      expect(res).toBeDefined();
      expect(res?.user.id).toBe("u-1");
      expect((res?.user as any).passwordHash).toBeUndefined();
    });
  });
});
