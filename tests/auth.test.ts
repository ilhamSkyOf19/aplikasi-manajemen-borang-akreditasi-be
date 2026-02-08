import request from "supertest";
import app from "../src/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import prisma from "../src/libs/prisma";

const testEmails = [
  "test_1@example.com",
  "test_2@example.com",
  "test_4@example.com",
  "test_5@example.com",
  "test_6@example.com",
  "test_7@example.com",
];

describe("Auth Register Endpoint (Integration with DB)", () => {
  const validUser = {
    nama: "Ilham",
    email: testEmails[0],
    password: "secret123",
    role: "wakil_dekan_1",
  };

  let cookies: string[];

  // ===============================
  // 🔹 REGISTER & LOGIN USER
  // ===============================
  beforeAll(async () => {
    // login
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "wakildekan1@gmail.com", password: "wakildekan1" })
      .expect(200);

    cookies = res.headers["set-cookie"] as unknown as string[];

    // register
    await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send(validUser);
  });
  // ===============================
  // 🔹 CLEANUP DB
  // ===============================
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: testEmails },
      },
    });
    await prisma.$disconnect();
  });

  // ===============================
  // 🔹 SUCCESS REGISTER
  // ===============================
  it("should create a valid user and return 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({ ...validUser, email: testEmails[5] })
      .expect(201);

    expect(res.status).toBe(201);
    expect(res.body.meta.statusCode).toBe(201);
    expect(res.body.meta.message).toBe("success register user");

    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.nama).toBe(validUser.nama);
    expect(res.body.data.email).toBe(testEmails[5]);
    expect(res.body.data.role).toBe(validUser.role);
    expect(res.body.data).not.toHaveProperty("password");

    const dbUser = await prisma.user.findUnique({
      where: { email: validUser.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.nama).toBe(validUser.nama);
  });

  // ===============================
  // 🔹 INVALID NAMA
  // ===============================
  it("should fail if nama contains numbers (400)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({
        ...validUser,
        email: testEmails[1],
        nama: "Ilham123",
      });

    expect(res.status).toBe(400);
    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 DUPLICATE EMAIL
  // ===============================
  it("should fail if email already exists (409)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.meta.statusCode).toBe(409);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 SHORT PASSWORD
  // ===============================
  it("should fail if password is too short (400)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({
        ...validUser,
        email: testEmails[2],
        password: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 INVALID EMAIL FORMAT
  // ===============================
  it("should fail if email format is invalid (400)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({
        ...validUser,
        email: "invalidemail",
        nama: "ValidName",
      });

    expect(res.status).toBe(400);
    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 TRIM NAMA
  // ===============================
  it("should trim extra spaces in nama", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({
        nama: "  Ilham  ",
        email: testEmails[3],
        password: "secret123",
        role: "wakil_dekan_1",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.nama).toBe("Ilham");
    expect(res.body.data.email).toBe(testEmails[3]);
  });

  // ===============================
  // 🔹 EMAIL WITH EXTRA SPACES
  // ===============================
  it("should fail if email has extra spaces (400)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({
        nama: "Ilham",
        email: `  ${testEmails[4]}  `,
        password: "secret123",
        role: "wakil_dekan_1",
      });

    expect(res.status).toBe(400);
    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });
});

// login test
describe("Auth Flow Test", () => {
  const nama = "test";
  const email = "test_1@example.com";
  const password = "test123456";
  const role = "wakil_dekan_1";
  const identifier = email;

  let cookies: string[];

  // ===============================
  // 🔹 REGISTER & LOGIN USER
  // ===============================
  beforeAll(async () => {
    // login
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "wakildekan1@gmail.com", password: "wakildekan1" })
      .expect(200);

    cookies = res.headers["set-cookie"] as unknown as string[];

    // register
    await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({ nama, email, password, role });
  });

  // ===============================
  // 🔹 CLEANUP DB
  // ===============================
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email },
    });
    await prisma.$disconnect();
  });

  // ===============================
  // 🔹 LOGIN SUCCESS
  // ===============================
  it("should login successfully and set cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier, password })
      .expect(200);

    const cookieHeader = res.headers["set-cookie"] as unknown as string[];

    expect(cookieHeader).toBeDefined();
    expect(cookieHeader.some((c) => c.startsWith("token"))).toBe(true);

    cookies = cookieHeader;

    expect(res.body.meta.statusCode).toBe(200);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 LOGIN WRONG PASSWORD
  // ===============================
  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier, password: "wrongpass" })
      .expect(400);

    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 LOGIN NON-EXISTENT USER
  // ===============================
  it("should fail login with non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "test_1@example.com", password: "123456" })
      .expect(400);

    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  // ===============================
  // 🔹 GET /ME SUCCESS
  // ===============================
  it("should get current user data from /me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.meta.statusCode).toBe(200);
    expect(res.body.meta.message).toBe("success login user");

    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(email);
    expect(res.body.data.nama).toBe(nama);
    expect(res.body.data.role).toBe(role);
  });

  // ===============================
  // 🔹 GET /ME WITHOUT COOKIE
  // ===============================
  it("should return 401 if no cookie is provided", async () => {
    const res = await request(app).get("/api/auth/me").expect(401);

    expect(res.body.meta.statusCode).toBe(401);
    expect(res.body.data).toBeNull();
  });
});

// Unit test api me
describe("Auth Flow Test (Register → Login → Me)", () => {
  const nama = "test";
  const email = "test_1@example.com";
  const password = "test123456";
  const role = "wakil_dekan_1";

  const identifier = email;

  let cookies: string[];

  // ===============================
  // 🔹 REGISTER & LOGIN USER
  // ===============================
  beforeAll(async () => {
    // login
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "wakildekan1@gmail.com", password: "wakildekan1" })
      .expect(200);

    cookies = res.headers["set-cookie"] as unknown as string[];

    // register
    await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookies)
      .send({ nama, email, password, role });
  });

  // =========================
  // ✅ CLEANUP
  // =========================
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email },
    });

    await prisma.$disconnect();
  });

  // =========================
  // ✅ LOGIN
  // =========================
  it("should login successfully and set cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier, password })
      .expect(200);

    const cookieHeader = res.headers["set-cookie"] as unknown as string[];

    expect(cookieHeader).toBeDefined();
    expect(cookieHeader.some((c) => c.startsWith("token"))).toBe(true);

    cookies = cookieHeader;

    expect(res.body.meta.statusCode).toBe(200);
    expect(res.body.data).toBeNull();
  });

  // =========================
  // ✅ /ME SUCCESS
  // =========================
  it("should get current user from /me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.meta.statusCode).toBe(200);
    expect(res.body.meta.message).toBe("success login user");

    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(email);
  });

  // =========================
  // ✅ /ME WITHOUT COOKIE
  // =========================
  it("should return 401 if no cookie", async () => {
    const res = await request(app).get("/api/auth/me").expect(401);

    expect(res.body.meta.statusCode).toBe(401);
  });
});
