import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import cookieParser from "cookie-parser";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AllExceptionsFilter } from "../../src/common/filters/http-exception.filter";

describe("Auth & Multi-Tenancy Integration (Real DB)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUserA = {
    email: `usera_${Date.now()}@example.com`,
    password: "Password123!",
    name: "User A",
  };

  const testUserB = {
    email: `userb_${Date.now()}@example.com`,
    password: "Password123!",
    name: "User B",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix("api/v1");
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Cleanup test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUserA.email, testUserB.email],
        },
      },
    });
    await app.close();
  });

  let sessionTokenA: string;
  let userAId: string;
  let sessionTokenB: string;
  let userBId: string;

  it("1. Register User A successfully with Argon2id hash & default preferences", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send(testUserA)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUserA.email);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Never expose hash
    expect(res.body.data.sessionToken).toBeDefined();

    sessionTokenA = res.body.data.sessionToken;
    userAId = res.body.data.user.id;

    // Verify in DB that password was hashed with Argon2id
    const dbUser = await prisma.user.findUnique({
      where: { id: userAId },
      include: { preference: true },
    });
    expect(dbUser?.passwordHash).toContain("$argon2id$");
    expect(dbUser?.preference).toBeDefined();
    expect(dbUser?.preference?.theme).toBe("system");
  });

  it("2. Prevent duplicate registration with same email", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send(testUserA)
      .expect(409);

    expect(res.body.success).toBe(false);
  });

  it("3. Register User B successfully", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send(testUserB)
      .expect(201);

    sessionTokenB = res.body.data.sessionToken;
    userBId = res.body.data.user.id;
    expect(userBId).not.toBe(userAId);
  });

  it("4. User A can retrieve own profile via session Bearer token", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${sessionTokenA}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(userAId);
    expect(res.body.data.email).toBe(testUserA.email);
  });

  it("5. User A can update own preferences (theme: dark, font: Geist)", async () => {
    const res = await request(app.getHttpServer())
      .patch("/api/v1/users/me/preferences")
      .set("Authorization", `Bearer ${sessionTokenA}`)
      .send({
        theme: "dark",
        font: "Geist",
        fontSize: "L",
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.theme).toBe("dark");
    expect(res.body.data.font).toBe("Geist");
    expect(res.body.data.fontSize).toBe("L");

    // Verify User B preferences remain unaffected (multi-tenant isolation)
    const resB = await request(app.getHttpServer())
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${sessionTokenB}`)
      .expect(200);

    expect(resB.body.data.preference.theme).toBe("system");
  });

  it("6. User A logs out and session token is invalidated", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${sessionTokenA}`)
      .expect(200);

    // Access with old token should now be rejected
    await request(app.getHttpServer())
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${sessionTokenA}`)
      .expect(401);
  });

  it("7. User A can log in again with password", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({
        email: testUserA.email,
        password: testUserA.password,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionToken).toBeDefined();

    // New session can access /users/me
    const newSessionToken = res.body.data.sessionToken;
    const meRes = await request(app.getHttpServer())
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${newSessionToken}`)
      .expect(200);
    expect(meRes.body.data.id).toBe(userAId);
  });
});
