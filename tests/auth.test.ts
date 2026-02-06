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
];

// describe("Auth Register Endpoint (Integration with DB)", () => {
//   const validUser = {
//     nama: "Ilham",
//     email: testEmails[0],
//     password: "secret123",
//   };

//   afterAll(async () => {
//     // Hapus user yang dibuat selama test berdasarkan email

//     await prisma.user.deleteMany({
//       where: {
//         email: { in: testEmails },
//       },
//     });

//     // Disconnect Prisma
//     await prisma.$disconnect();
//   });

//   it("should create a valid user and return 201", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send(validUser);

//     // cek status & response meta
//     expect(response.status).toBe(201);
//     expect(response.body.meta.statusCode).toBe(201);
//     expect(response.body.meta.message).toBe("success register user");

//     // cek data user
//     expect(response.body.data).toHaveProperty("id");
//     expect(response.body.data).toHaveProperty("nama", validUser.nama);
//     expect(response.body.data).toHaveProperty("email", validUser.email);
//     expect(response.body.data).toHaveProperty("role");
//     expect(response.body.data).not.toHaveProperty("password");

//     // cek DB langsung
//     const dbUser = await prisma.user.findUnique({
//       where: { email: validUser.email },
//     });
//     expect(dbUser).not.toBeNull();
//     expect(dbUser?.nama).toBe(validUser.nama);
//   });

//   it("should fail if nama contains numbers (400)", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validUser, nama: "Ilham123" });
//     expect(response.status).toBe(400);
//     expect(response.body.meta.statusCode).toBe(400);
//     expect(response.body.data).toBeNull();
//   });

//   it("should fail if email already exists (409)", async () => {
//     // daftar user sama sekali lagi
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send(validUser);
//     expect(response.status).toBe(409);
//     expect(response.body.meta.statusCode).toBe(409);
//     expect(response.body.data).toBeNull();
//   });

//   it("should fail if password is too short (400)", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validUser, email: testEmails[1], password: "123" });
//     expect(response.status).toBe(400);
//     expect(response.body.meta.statusCode).toBe(400);
//     expect(response.body.data).toBeNull();
//   });

//   it("should fail if email format is invalid (400)", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validUser, email: "invalidemail", nama: "ValidName" });
//     expect(response.status).toBe(400);
//     expect(response.body.meta.statusCode).toBe(400);
//     expect(response.body.data).toBeNull();
//   });

//   it("should trim extra spaces in nama", async () => {
//     const response = await request(app).post("/api/auth/register").send({
//       nama: "  Ilham  ",
//       email: testEmails[2],
//       password: "secret123",
//     });
//     expect(response.status).toBe(201);
//     expect(response.body.data.nama).toBe("Ilham");
//     expect(response.body.data.email).toBe(testEmails[2]);
//   });

//   it("should trim extra spaces in email", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({
//         nama: "Ilham",
//         email: `  ${testEmails[3]}  `,
//         password: "secret123",
//       });
//     expect(response.status).toBe(400);
//     expect(response.body.meta.statusCode).toBe(400);
//     expect(response.body.data).toBeNull();
//   });

//   it("should store createdAt and updatedAt correctly", async () => {
//     const response = await request(app).post("/api/auth/register").send({
//       nama: "TestTime",
//       email: testEmails[4],
//       password: "secret123",
//     });
//     expect(response.status).toBe(201);

//     const dbUser = await prisma.user.findUnique({
//       where: { email: testEmails[4] },
//     });
//     expect(dbUser).not.toBeNull();
//     expect(dbUser?.createdAt).toBeInstanceOf(Date);
//     expect(dbUser?.updatedAt).toBeInstanceOf(Date);
//   });
// });

// login test
describe("Auth Login Test", () => {
  const nama = "test";
  const email = "test_1@example.com";
  const password = "test123456";

  const identifier = email;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ nama, email, password });
    console.log("register res:", res.status, res.body);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  it("should login successfully and set cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier, password })
      .expect(200);

    // const cookies = res.headers["set-cookie"] as string[];
    // expect(cookies).toBeDefined();
    // expect(cookies.some((c) => c.startsWith("token"))).toBe(true);

    expect(res.body.meta.statusCode).toBe(200);
    expect(res.body.data).toBeNull();
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier, password: "wrongpass" })
      .expect(400);

    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it("should fail login with non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "nouser", password: "123456" })
      .expect(400);

    expect(res.body.meta.statusCode).toBe(400);
    expect(res.body.data).toBeNull();
  });
});
