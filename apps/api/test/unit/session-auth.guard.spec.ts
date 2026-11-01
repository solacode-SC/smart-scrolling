import { describe, it, expect, beforeEach, vi } from "vitest";
import { SessionAuthGuard } from "../../src/auth/guards/session-auth.guard";
import { UnauthorizedException } from "@nestjs/common";

describe("SessionAuthGuard", () => {
  let guard: SessionAuthGuard;
  let reflectorMock: any;
  let authServiceMock: any;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: vi.fn(),
    };
    authServiceMock = {
      validateSession: vi.fn(),
    };

    guard = new SessionAuthGuard(reflectorMock, authServiceMock);
  });

  const createMockContext = (headers: any = {}, cookies: any = {}) => {
    const request: any = {
      headers,
      cookies,
    };
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      request,
    };
  };

  it("should allow access if route is marked @Public", async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);
    const context = createMockContext();

    const canActivate = await guard.canActivate(context as any);
    expect(canActivate).toBe(true);
  });

  it("should throw UnauthorizedException if neither cookie nor auth header is present", async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = createMockContext({}, {});

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should authenticate via cookie and set request.user", async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = createMockContext(
      {},
      { socialhub_session: "session-cookie-token" },
    );

    authServiceMock.validateSession.mockResolvedValueOnce({
      user: { id: "user-123", email: "test@example.com" },
    });

    const canActivate = await guard.canActivate(context as any);
    expect(canActivate).toBe(true);
    expect(context.request.user).toEqual({
      id: "user-123",
      email: "test@example.com",
    });
    expect(context.request.sessionToken).toBe("session-cookie-token");
  });

  it("should authenticate via Bearer header and set request.user", async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = createMockContext(
      { authorization: "Bearer header-token-xyz" },
      {},
    );

    authServiceMock.validateSession.mockResolvedValueOnce({
      user: { id: "user-456", email: "bearer@example.com" },
    });

    const canActivate = await guard.canActivate(context as any);
    expect(canActivate).toBe(true);
    expect(context.request.user).toEqual({
      id: "user-456",
      email: "bearer@example.com",
    });
    expect(context.request.sessionToken).toBe("header-token-xyz");
  });

  it("should throw UnauthorizedException if session is invalid or expired", async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = createMockContext({
      authorization: "Bearer invalid-token",
    });

    authServiceMock.validateSession.mockResolvedValueOnce(null);

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
