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

describe("Kriteria Test", () => {
  let cookies: string[];

  // =========================
  // DATA ARRAY
  // =========================
  const kriteriaArray = [
    { kriteria: 1, namaKriteria: "Kriteria 1" },
    { kriteria: 2, namaKriteria: "Kriteria 2" },
    { kriteria: 3, namaKriteria: "Kriteria 3" },
  ];

  // =========================
  // LOGIN
  // =========================
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      identifier: "wakildekan1@gmail.com",
      password: "wakildekan1",
    });

    cookies = res.headers["set-cookie"] as unknown as string[];
  });

  // =========================
  // CLEANUP BEFORE EACH TEST
  // =========================
  beforeEach(async () => {
    await prisma.kriteria.deleteMany({
      where: { kriteria: { in: kriteriaArray.map((k) => k.kriteria) } },
    });
  });

  afterEach(async () => {
    // opsional cleanup tambahan
    await prisma.kriteria.deleteMany({
      where: { kriteria: { in: kriteriaArray.map((k) => k.kriteria) } },
    });
  });

  // =========================
  // CREATE SUCCESS
  // =========================
  it("should create all kriteria from array", async () => {
    for (const data of kriteriaArray) {
      const res = await request(app)
        .post("/api/kriteria/create")
        .set("Cookie", cookies)
        .send(data)
        .expect(201);

      expect(res.body.data.kriteria).toBe(data.kriteria);
      expect(res.body.data.namaKriteria).toBe(data.namaKriteria);
    }
  });

  // =========================
  // DUPLICATE CREATE CHECK
  // =========================
  it("should fail duplicate kriteria", async () => {
    const data = kriteriaArray[0];

    await request(app)
      .post("/api/kriteria/create")
      .set("Cookie", cookies)
      .send(data)
      .expect(201);

    const res = await request(app)
      .post("/api/kriteria/create")
      .set("Cookie", cookies)
      .send(data)
      .expect(409);

    expect(res.body.meta.statusCode).toBe(409);
    expect(res.body.meta.message).toMatch(/duplicate/i);
  });

  // =========================
  // GET LIST
  // =========================
  it("should get list of kriteria", async () => {
    for (const data of kriteriaArray) {
      await prisma.kriteria.create({ data: { ...data, revisi: 0 } });
    }

    const res = await request(app)
      .get("/api/kriteria/read-all")
      .set("Cookie", cookies)
      .expect(200);

    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.data.length).toBe(kriteriaArray.length);
  });

  // =========================
  // GET LIST wrong params
  // =========================
  it("should fail get if wrong params", async () => {
    for (const data of kriteriaArray) {
      await prisma.kriteria.create({ data: { ...data, revisi: 0 } });
    }

    const res = await request(app)
      .get("/api/kriteria/read-all?page=wrong&limit=wrong")
      .set("Cookie", cookies)
      .expect(400);

    expect(res.body.meta.statusCode).toBe(400);
  });

  // =========================
  // GET DETAIL
  // =========================
  it("should get detail kriteria", async () => {
    const data = kriteriaArray[0];
    const created = await prisma.kriteria.create({
      data: { ...data, revisi: 0 },
    });

    const res = await request(app)
      .get(`/api/kriteria/read-by-id/${created.id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.data.id).toBe(created.id);
  });

  // =========================
  // GET DETAIL wrong id
  // =========================
  it("should fail get detail if wrong id", async () => {
    const data = kriteriaArray[0];
    const created = await prisma.kriteria.create({
      data: { ...data, revisi: 0 },
    });

    const res = await request(app)
      .get(`/api/kriteria/read-by-id/99`)
      .set("Cookie", cookies)
      .expect(404);

    expect(res.body.meta.statusCode).toBe(404);
  });

  // =========================
  // UPDATE Kriteria
  // =========================
  it("should update kriteria and fail if duplicate", async () => {
    const created1 = await prisma.kriteria.create({
      data: { ...kriteriaArray[0], revisi: 0 },
    });
    const created2 = await prisma.kriteria.create({
      data: { ...kriteriaArray[1], revisi: 0 },
    });

    // duplicate → harus 409
    const res = await request(app)
      .patch(`/api/kriteria/update/${created2.id}`)
      .set("Cookie", cookies)
      .send({ kriteria: kriteriaArray[0].kriteria })
      .expect(409);

    expect(res.body.meta.statusCode).toBe(409);

    // update namaKriteria → berhasil
    const res2 = await request(app)
      .patch(`/api/kriteria/update/${created2.id}`)
      .set("Cookie", cookies)
      .send({ namaKriteria: "Updated Kriteria" })
      .expect(200);

    expect(res2.body.data.namaKriteria).toBe("Updated Kriteria");
  });

  // =========================
  // UPDATE WRONG ID
  // =========================
  it("should fail update if kriteria id not found", async () => {
    const res = await request(app)
      .patch(`/api/kriteria/update/9999`)
      .set("Cookie", cookies)
      .send({ namaKriteria: "Updated" })
      .expect(404);

    expect(res.body.meta.statusCode).toBe(404);
    expect(res.body.meta.message).toMatch(/not found/i);
  });

  // =========================
  // DELETE Kriteria
  // =========================
  it("should delete kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: { ...kriteriaArray[0], revisi: 0 },
    });

    await request(app)
      .delete(`/api/kriteria/delete/${created.id}`)
      .set("Cookie", cookies)
      .expect(200);

    const check = await prisma.kriteria.findUnique({
      where: { id: created.id },
    });
    expect(check).toBeNull();
  });

  // =========================
  // DELETE WRONG ID
  // =========================
  it("should fail delete if kriteria id not found", async () => {
    const res = await request(app)
      .delete(`/api/kriteria/delete/9999`)
      .set("Cookie", cookies)
      .expect(404);

    expect(res.body.meta.statusCode).toBe(404);
    expect(res.body.meta.message).toMatch(/not found/i);
  });

  // =========================
  // CLEANUP AFTER ALL
  // =========================
  afterAll(async () => {
    await prisma.kriteria.deleteMany({
      where: { kriteria: { in: kriteriaArray.map((k) => k.kriteria) } },
    });
    await prisma.$disconnect();
  });
});

// =========================
// ROLE BASED ACCESS TEST - TIM AKREDITASI
// =========================

const kriteriaArray: { kriteria: number; namaKriteria: string }[] = [
  {
    kriteria: 9999,
    namaKriteria: "kriteria 1",
  },
  {
    kriteria: 8888,
    namaKriteria: "kriteria 2",
  },
  {
    kriteria: 7777,
    namaKriteria: "kriteria 3",
  },
  {
    kriteria: 6666,
    namaKriteria: "kriteria 4",
  },
];

describe("Kriteria Role ACL - tim_akreditasi", () => {
  const role = {
    identifier: "timakreditasi@gmail.com",
    password: "timakreditasi",
  };
  let roleCookies: string[];

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      identifier: role.identifier,
      password: role.password,
    });
    roleCookies = res.headers["set-cookie"] as unknown as string[];
  });

  afterAll(async () => {
    await prisma.kriteria.deleteMany({
      where: { kriteria: { in: kriteriaArray.map((k) => k.kriteria) } },
    });
  });

  it("should forbid create kriteria", async () => {
    const res = await request(app)
      .post("/api/kriteria/create")
      .set("Cookie", roleCookies)
      .send(kriteriaArray[0])
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should forbid update kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[1].kriteria,
        namaKriteria: kriteriaArray[1].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .patch(`/api/kriteria/update/${created.id}`)
      .set("Cookie", roleCookies)
      .send({ namaKriteria: kriteriaArray[1].namaKriteria })
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should forbid delete kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[2].kriteria,
        namaKriteria: kriteriaArray[2].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .delete(`/api/kriteria/delete/${created.id}`)
      .set("Cookie", roleCookies)
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should allow read-all kriteria", async () => {
    const res = await request(app)
      .get("/api/kriteria/read-all")
      .set("Cookie", roleCookies)
      .expect(200);

    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  it("should allow read-by-id kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[3].kriteria,
        namaKriteria: kriteriaArray[3].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .get(`/api/kriteria/read-by-id/${created.id}`)
      .set("Cookie", roleCookies)
      .expect(200);

    expect(res.body.data.id).toBe(created.id);
  });
});

// =========================
// ROLE BASED ACCESS TEST - KAPRODI
// =========================
describe("Kriteria Role ACL - kaprodi", () => {
  const role = {
    identifier: "kaprodi@gmail.com",
    password: "kaprodi",
  };
  let roleCookies: string[];

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      identifier: role.identifier,
      password: role.password,
    });
    roleCookies = res.headers["set-cookie"] as unknown as string[];
  });

  afterAll(async () => {
    await prisma.kriteria.deleteMany({
      where: { kriteria: { in: kriteriaArray.map((k) => k.kriteria) } },
    });
  });

  it("should forbid create kriteria", async () => {
    const res = await request(app)
      .post("/api/kriteria/create")
      .set("Cookie", roleCookies)
      .send(kriteriaArray[0])
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should forbid update kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[1].kriteria,
        namaKriteria: kriteriaArray[1].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .patch(`/api/kriteria/update/${created.id}`)
      .set("Cookie", roleCookies)
      .send({ namaKriteria: kriteriaArray[1].namaKriteria })
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should forbid delete kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[2].kriteria,
        namaKriteria: kriteriaArray[2].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .delete(`/api/kriteria/delete/${created.id}`)
      .set("Cookie", roleCookies)
      .expect(403);

    expect(res.body.meta.statusCode).toBe(403);
    expect(res.body.meta.message).toMatch(/forbidden/i);
  });

  it("should allow read-all kriteria", async () => {
    const res = await request(app)
      .get("/api/kriteria/read-all")
      .set("Cookie", roleCookies)
      .expect(200);

    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  it("should allow read-by-id kriteria", async () => {
    const created = await prisma.kriteria.create({
      data: {
        kriteria: kriteriaArray[3].kriteria,
        namaKriteria: kriteriaArray[3].namaKriteria,
        revisi: 0,
      },
    });

    const res = await request(app)
      .get(`/api/kriteria/read-by-id/${created.id}`)
      .set("Cookie", roleCookies)
      .expect(200);

    expect(res.body.data.id).toBe(created.id);
  });
});
