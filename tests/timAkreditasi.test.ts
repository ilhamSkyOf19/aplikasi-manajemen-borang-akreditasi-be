import {
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/libs/prisma";

describe("Tim Akreditasi Test", () => {
  let cookies: string[];
  let testUserIds: number[] = [];

  // =========================
  // DATA ARRAY
  // =========================
  const testEmails = [
    "timakreditasi1@test.com",
    "timakreditasi2@test.com",
    "timakreditasi3@test.com",
    "timakreditasi4@test.com",
    "timakreditasi5@test.com",
  ];

  const validUser = {
    nama: "Ilham",
    password: "secret123",
    role: "tim_akreditasi",
  };

  // =========================
  // HELPER FUNCTIONS
  // =========================
  const helpers = {
    createTim: async (name: string, userIds: number[]) =>
      await request(app)
        .post("/api/tim-akreditasi/create")
        .set("Cookie", cookies)
        .send({
          namaTimAkreditasi: name,
          users: userIds,
        }),

    getTimById: async (id: number | string) =>
      await request(app)
        .get(`/api/tim-akreditasi/read-by-id/${id}`)
        .set("Cookie", cookies),
  };

  // =========================
  // LOGIN & SETUP
  // =========================
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      identifier: "wakildekan1@gmail.com",
      password: "wakildekan1",
    });

    cookies = res.headers["set-cookie"] as unknown as string[];

    // Register test user
    for (let i = 0; i < 5; i++) {
      const userRes = await request(app)
        .post("/api/auth/register")
        .set("Cookie", cookies)
        .send({ ...validUser, email: testEmails[i] })
        .expect(201);

      testUserIds.push(userRes.body.data.id);
    }
  });

  // =========================
  // CREATE TESTS
  // =========================
  describe("CREATE", () => {
    it("should create tim akreditasi with valid data", async () => {
      const res = await helpers.createTim("Tim Akreditasi A", [
        testUserIds[0],
        testUserIds[1],
        testUserIds[2],
      ]);

      expect(res.status).toBe(201);
      expect(res.body.data.namaTimAkreditasi).toBe("Tim Akreditasi A");
      expect(res.body.data.user).toHaveLength(3);
      expect(res.body.meta.message).toMatch(/success create tim akreditasi/i);
    });

    it("should create tim akreditasi with single user", async () => {
      const res = await helpers.createTim("Tim Akreditasi B", [testUserIds[0]]);

      expect(res.status).toBe(201);
      expect(res.body.data.user).toHaveLength(1);
      expect(res.body.data.user[0].id).toBe(testUserIds[0]);
    });

    it("should create tim akreditasi with all test user", async () => {
      const res = await helpers.createTim("Tim Akreditasi C", testUserIds);

      expect(res.status).toBe(201);
      expect(res.body.data.user).toHaveLength(testUserIds.length);
    });

    describe("Validation Errors", () => {
      it("should fail if namaTimAkreditasi is empty", async () => {
        const res = await helpers.createTim("", [testUserIds[0]]);
        expect(res.status).toBe(400);
      });

      it("should fail if namaTimAkreditasi exceeds max length", async () => {
        const res = await helpers.createTim("A".repeat(101), [testUserIds[0]]);
        expect(res.status).toBe(400);
      });

      it("should fail if user array is empty", async () => {
        const res = await helpers.createTim("Tim Akreditasi D", []);
        expect(res.status).toBe(400);
      });

      it("should fail if user is not valid JSON", async () => {
        const res = await request(app)
          .post("/api/tim-akreditasi/create")
          .set("Cookie", cookies)
          .send({
            namaTimAkreditasi: "Tim Akreditasi E",
            user: "not-a-json",
          });

        expect(res.status).toBe(400);
      });

      it("should fail if user is not an array", async () => {
        const res = await request(app)
          .post("/api/tim-akreditasi/create")
          .set("Cookie", cookies)
          .send({
            namaTimAkreditasi: "Tim Akreditasi F",
            user: 1,
          });

        expect(res.status).toBe(400);
      });

      it("should fail if user id is decimal number", async () => {
        const res = await request(app)
          .post("/api/tim-akreditasi/create")
          .set("Cookie", cookies)
          .send({
            namaTimAkreditasi: "Tim Akreditasi G",
            user: [10.1, 11.3],
          });

        expect(res.status).toBe(400);
      });

      it("should fail if user id does not exist", async () => {
        const res = await helpers.createTim("Tim Akreditasi H", [99999]);
        expect(res.status).toBe(404);
        expect(res.body.meta.message).toMatch(/Resource not found/i);
      });

      it("should fail if namaTimAkreditasi is missing", async () => {
        const res = await request(app)
          .post("/api/tim-akreditasi/create")
          .set("Cookie", cookies)
          .send({ user: [testUserIds[0]] });

        expect(res.status).toBe(400);
      });

      it("should fail if user is missing", async () => {
        const res = await request(app)
          .post("/api/tim-akreditasi/create")
          .set("Cookie", cookies)
          .send({ namaTimAkreditasi: "Tim Akreditasi I" });

        expect(res.status).toBe(400);
      });
    });

    it("should fail if not authenticated", async () => {
      const res = await request(app)
        .post("/api/tim-akreditasi/create")
        .send({
          namaTimAkreditasi: "Tim Akreditasi J",
          user: [testUserIds[0]],
        });

      expect(res.status).toBe(401);
    });
  });

  // =========================
  // READ BY ID TESTS
  // =========================
  describe("READ BY ID", () => {
    it("should get detail tim akreditasi by id", async () => {
      const createRes = await helpers.createTim("Tim Akreditasi Detail", [
        testUserIds[0],
        testUserIds[1],
      ]);
      const createdId = createRes.body.data.id;

      const res = await helpers.getTimById(createdId);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdId);
      expect(res.body.data.namaTimAkreditasi).toBe("Tim Akreditasi Detail");
      expect(res.body.data.user).toHaveLength(2);
      expect(res.body.meta.message).toMatch(
        /success read tim akreditasi by id/i,
      );
    });

    it("should return complete user data in tim akreditasi detail", async () => {
      const createRes = await helpers.createTim("Tim Akreditasi Complete", [
        testUserIds[0],
        testUserIds[1],
        testUserIds[2],
      ]);
      const createdId = createRes.body.data.id;

      const res = await helpers.getTimById(createdId);

      expect(res.status).toBe(200);
      expect(res.body.data.user).toHaveLength(3);
      expect(res.body.data.user[0]).toHaveProperty("id");
      expect(res.body.data.user[0]).toHaveProperty("nama");
      expect(res.body.data.user[0]).toHaveProperty("email");
      expect(res.body.data.user[0]).toHaveProperty("role");
      expect(res.body.data.user[0].role).toBe("tim_akreditasi");
    });

    describe("Error Cases", () => {
      it("should fail if tim akreditasi id not found", async () => {
        const res = await helpers.getTimById(99999);
        expect(res.status).toBe(404);
        expect(res.body.meta.message).toMatch(/tim akreditasi not found/i);
      });

      it("should fail if id is not a number", async () => {
        const res = await helpers.getTimById("invalid");
        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(/bad request/i);
      });

      it("should fail if id is negative", async () => {
        const res = await helpers.getTimById(-1);
        expect(res.status).toBe(404);
        expect(res.body.meta.message).toMatch(/tim akreditasi not found/i);
      });

      it("should fail if id is decimal", async () => {
        const res = await helpers.getTimById(1.5);
        expect(res.status).toBe(404);
        expect(res.body.meta.message).toMatch(/tim akreditasi not found/i);
      });
    });

    it("should fail if not authenticated", async () => {
      const res = await request(app).get(`/api/tim-akreditasi/read-by-id/1`);
      expect(res.status).toBe(401);
    });

    it("should allow tim_akreditasi role to access detail", async () => {
      const createRes = await helpers.createTim("Tim for Role Test", [
        testUserIds[0],
      ]);
      const createdId = createRes.body.data.id;

      // Login sebagai tim_akreditasi
      const timAkreditasiLogin = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: testEmails[0],
          password: "secret123",
        });

      const timAkreditasiCookies = timAkreditasiLogin.headers[
        "set-cookie"
      ] as unknown as string[];

      const res = await request(app)
        .get(`/api/tim-akreditasi/read-by-id/${createdId}`)
        .set("Cookie", timAkreditasiCookies);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdId);
    });
  });

  // =========================
  // READ ALL TESTS
  // =========================
  describe("READ ALL", () => {
    beforeEach(async () => {
      // Create multiple tim akreditasi untuk testing pagination
      await helpers.createTim("Tim Akreditasi Alpha", [testUserIds[0]]);
      await helpers.createTim("Tim Akreditasi Beta", [testUserIds[1]]);
      await helpers.createTim("Tim Akreditasi Gamma", [testUserIds[2]]);
      await helpers.createTim("Tim Akreditasi Delta", [testUserIds[3]]);
      await helpers.createTim("Tim Akreditasi Epsilon", [testUserIds[4]]);
    });

    it("should get all tim akreditasi without pagination", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.data.length).toBeGreaterThan(0);
      expect(res.body.data.meta).toHaveProperty("totalData");
      expect(res.body.data.meta).toHaveProperty("currentPage");
      expect(res.body.data.meta).toHaveProperty("totalPage");
      expect(res.body.data.meta).toHaveProperty("limit");
      expect(res.body.meta.message).toMatch(/success read all tim akreditasi/i);
    });

    it("should get all tim akreditasi with default pagination", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?page=1&limit=8")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.meta.currentPage).toBe(1);
      expect(res.body.data.meta.limit).toBe(8);
    });

    it("should get tim akreditasi with custom pagination", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?page=1&limit=2")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeLessThanOrEqual(2);
      expect(res.body.data.meta.limit).toBe(2);
    });

    it("should get second page of tim akreditasi", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?page=2&limit=3")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.meta.currentPage).toBe(2);
      expect(res.body.data.meta.limit).toBe(3);
    });

    it("should handle page less than 1 by defaulting to page 1", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?page=0&limit=5")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.meta.currentPage).toBe(1);
    });

    it("should search tim akreditasi by name", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?search=Alpha")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.data.length).toBeGreaterThan(0);
      expect(res.body.data.data[0].namaTimAkreditasi).toContain("Alpha");
    });

    it("should return empty array if search not found", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?search=NotExistingName")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.data.length).toBe(0);
      expect(res.body.data.meta.totalData).toBe(0);
    });

    it("should search with pagination", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?search=Tim&page=1&limit=3")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeLessThanOrEqual(3);
      expect(res.body.data.meta.currentPage).toBe(1);
      expect(res.body.data.meta.limit).toBe(3);
    });

    it("should include complete user data in results", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?limit=1")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data[0]).toHaveProperty("user");
      expect(res.body.data.data[0].user).toBeInstanceOf(Array);
      expect(res.body.data.data[0].user[0]).toHaveProperty("id");
      expect(res.body.data.data[0].user[0]).toHaveProperty("nama");
      expect(res.body.data.data[0].user[0]).toHaveProperty("email");
      expect(res.body.data.data[0].user[0]).toHaveProperty("role");
    });

    it("should calculate totalPage correctly", async () => {
      const res = await request(app)
        .get("/api/tim-akreditasi/read-all?limit=2")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      const expectedTotalPage = Math.ceil(res.body.data.meta.totalData / 2);
      expect(res.body.data.meta.totalPage).toBe(expectedTotalPage);
    });

    describe("Validation Errors", () => {
      it("should fail if page is not a number", async () => {
        const res = await request(app)
          .get("/api/tim-akreditasi/read-all?page=invalid&limit=5")
          .set("Cookie", cookies);

        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(
          /page and limit must be numbers/i,
        );
      });

      it("should fail if limit is not a number", async () => {
        const res = await request(app)
          .get("/api/tim-akreditasi/read-all?page=1&limit=invalid")
          .set("Cookie", cookies);

        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(
          /page and limit must be numbers/i,
        );
      });

      it("should fail if both page and limit are not numbers", async () => {
        const res = await request(app)
          .get("/api/tim-akreditasi/read-all?page=abc&limit=xyz")
          .set("Cookie", cookies);

        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(
          /page and limit must be numbers/i,
        );
      });
    });

    it("should fail if not authenticated", async () => {
      const res = await request(app).get("/api/tim-akreditasi/read-all");

      expect(res.status).toBe(401);
    });

    it("should allow tim_akreditasi role to access list", async () => {
      // Login sebagai tim_akreditasi
      const timAkreditasiLogin = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: testEmails[0],
          password: "secret123",
        });

      const timAkreditasiCookies = timAkreditasiLogin.headers[
        "set-cookie"
      ] as unknown as string[];

      const res = await request(app)
        .get("/api/tim-akreditasi/read-all")
        .set("Cookie", timAkreditasiCookies);

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
    });
  });

  // =========================
  // UPDATE TESTS
  // =========================
  describe("UPDATE TIM AKREDITASI", () => {
    describe("Successful Updates", () => {
      it("should update namaTimAkreditasi successfully", async () => {
        // create tim dulu
        const timRes = await helpers.createTim("Tim Update Test", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ namaTimAkreditasi: "Updated Tim Name" });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("id", timId);
        expect(res.body.data).toHaveProperty(
          "namaTimAkreditasi",
          "Updated Tim Name",
        );
        expect(res.body.meta.message).toMatch(/success update tim akreditasi/i);
      });

      it("should update user array successfully (partial replacement + addition)", async () => {
        // Buat tim awal dengan 3 user: a, b, c
        const timRes = await helpers.createTim("Tim Update user", [
          testUserIds[0], // a
          testUserIds[1], // b
          testUserIds[2], // c
        ]);
        const timId = timRes.body.data.id;

        // PATCH: replace user a dengan user d, b dan c tetap
        const updateduser = [testUserIds[1], testUserIds[2], testUserIds[3]]; // [b, c, d]

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ user: updateduser });

        expect(res.status).toBe(200);
        expect(res.body.data.user).toBeInstanceOf(Array);

        // Pastikan relasi user sekarang = [b, c, d]
        const actualUserIds = res.body.data.user.map((u: any) => u.id);
        expect(actualUserIds.sort()).toEqual(updateduser.sort());
      });

      it("should allow partial update (only namaTimAkreditasi)", async () => {
        const timRes = await helpers.createTim("Tim Partial Name", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ namaTimAkreditasi: "Partial Update Name" });

        expect(res.status).toBe(200);
        expect(res.body.data.namaTimAkreditasi).toBe("Partial Update Name");
      });

      it("should allow partial update (only user, replace one)", async () => {
        // Create tim awal dengan 3 user: a, b, c
        const timRes = await helpers.createTim("Tim Partial user Replace", [
          testUserIds[0], // a
          testUserIds[1], // b
          testUserIds[2], // c
        ]);
        const timId = timRes.body.data.id;

        // PATCH hanya ingin mengganti user a dengan user d
        const updateduser = [testUserIds[1], testUserIds[2], testUserIds[3]]; // [b, c, d]

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ user: updateduser });

        expect(res.status).toBe(200);

        // Pastikan relasi user sekarang = [b, c, d]
        const actualUserIds = res.body.data.user.map((u: any) => u.id);
        expect(actualUserIds.sort()).toEqual(updateduser.sort());
      });
    });

    describe("Validation & Errors", () => {
      it("should return 400 if id param is not a number", async () => {
        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/abc`)
          .set("Cookie", cookies)
          .send({ namaTimAkreditasi: "Invalid ID Test" });

        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(/bad request/i);
      });

      it("should fail validation if user is not a valid JSON array", async () => {
        const timRes = await helpers.createTim("Tim Invalid user", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ user: "not a json" });

        expect(res.status).toBe(400);
        expect(res.body.meta.message).toMatch(/invalid input/i);
      });

      it("should return 400 if user not found", async () => {
        const timRes = await helpers.createTim("Tim user Not Found", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", cookies)
          .send({ user: [999999] });

        expect(res.status).toBe(404);
        expect(res.body.meta.message).toMatch(/Resource not found/i);
      });
    });

    describe("Authentication & ACL", () => {
      it("should fail if unauthenticated", async () => {
        const timRes = await helpers.createTim("Tim Unauth Test", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .send({ namaTimAkreditasi: "Unauth Name" });

        expect(res.status).toBe(401);
      });

      it("should fail ACL if user role not allowed", async () => {
        const timRes = await helpers.createTim("Tim ACL Test", [
          testUserIds[0],
        ]);
        const timId = timRes.body.data.id;

        // login sebagai tim_akreditasi (role tidak boleh update)
        const loginRes = await request(app)
          .post("/api/auth/login")
          .send({ identifier: testEmails[0], password: "secret123" });

        const wrongCookies = loginRes.headers[
          "set-cookie"
        ] as unknown as string[];

        const res = await request(app)
          .patch(`/api/tim-akreditasi/update/${timId}`)
          .set("Cookie", wrongCookies)
          .send({ namaTimAkreditasi: "ACL Fail" });

        expect(res.status).toBe(403);
        expect(res.body.meta.message).toMatch(/forbidden/i);
      });
    });
  });

  describe("DELETE TIM AKREDITASI", () => {
    let timId: number;

    beforeEach(async () => {
      // Buat tim baru sebelum tiap test
      const timRes = await helpers.createTim("Tim Delete Test", [
        testUserIds[0],
      ]);
      timId = timRes.body.data.id;
    });

    it("should delete tim akreditasi successfully", async () => {
      const res = await request(app)
        .delete(`/api/tim-akreditasi/delete/${timId}`)
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.meta.message).toMatch(/success delete tim akreditasi/i);
      expect(res.body.data).toBeNull();

      // Pastikan tim sudah tidak ada di DB
      const check = await helpers.getTimById(timId);
      expect(check.status).toBe(404);
    });

    it("should return 404 if tim akreditasi not found", async () => {
      const res = await request(app)
        .delete(`/api/tim-akreditasi/delete/999999`)
        .set("Cookie", cookies);

      expect(res.status).toBe(404);
      expect(res.body.meta.message).toMatch(/Resource not found/i);
    });

    it("should delete only the tim and relasi, user remain", async () => {
      // Ambil user sebelum hapus
      const timBefore = await helpers.getTimById(timId);
      const userIds = timBefore.body.data.user.map((u: any) => u.id);

      const res = await request(app)
        .delete(`/api/tim-akreditasi/delete/${timId}`)
        .set("Cookie", cookies);

      expect(res.status).toBe(200);

      // Pastikan user masih ada di DB
      for (const id of userIds) {
        const userDb = await prisma.user.findUnique({ where: { id } });
        expect(userDb).not.toBeNull(); // user masih ada
        expect(userDb?.id).toBe(id); // id sesuai
      }
    });

    it("should fail if not authenticated", async () => {
      const res = await request(app).delete(
        `/api/tim-akreditasi/delete/${timId}`,
      );
      expect(res.status).toBe(401);
    });

    it("should fail if user role is not allowed", async () => {
      // Login sebagai user biasa
      const loginRes = await request(app).post("/api/auth/login").send({
        identifier: testEmails[0],
        password: "secret123",
      });
      const userCookies = loginRes.headers["set-cookie"] as unknown as string[];

      const res = await request(app)
        .delete(`/api/tim-akreditasi/delete/${timId}`)
        .set("Cookie", userCookies);

      expect(res.status).toBe(403); // forbidden
    });
  });

  // =========================
  // CLEANUP AFTER ALL
  // =========================
  afterAll(async () => {
    await prisma.user_Tim_Akreditasi.deleteMany({});
    await prisma.tim_Akreditasi.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { in: testEmails } },
    });
    await prisma.$disconnect();
  });
});
