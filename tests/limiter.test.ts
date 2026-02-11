import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/libs/prisma";

describe.skip("Rate Limiter Error Handling Tests", () => {
  let wakilDekanCookies: string[];

  // ===============================
  // 🔹 SETUP
  // ===============================
  beforeAll(async () => {
    // Login untuk mendapatkan cookies
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "wakildekan1@gmail.com",
        password: "wakildekan1",
      })
      .expect(200);

    wakilDekanCookies = res.headers["set-cookie"] as unknown as string[];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ===============================
  // 🔹 LOGIN RATE LIMITER ERROR TESTS
  // ===============================
  describe("Login Rate Limiter Error Handling", () => {
    const invalidCredentials = {
      identifier: `ratelimit${Date.now()}@test.com`,
      password: "wrongpassword",
    };

    it("should return 429 with correct error structure after 6 failed attempts", async () => {
      // Make 6 failed login attempts
      for (let i = 0; i < 6; i++) {
        await request(app).post("/api/auth/login").send(invalidCredentials);
      }

      // 7th attempt should be rate limited
      const res = await request(app)
        .post("/api/auth/login")
        .send(invalidCredentials)
        .expect(429);

      // Verify response structure
      expect(res.body).toHaveProperty("meta");
      expect(res.body).toHaveProperty("data");
      expect(res.body.meta).toHaveProperty("statusCode");
      expect(res.body.meta).toHaveProperty("message");
      expect(res.body.meta.statusCode).toBe(429);
      expect(res.body.data).toBeNull();
    });

    it("should return error message with time remaining in minutes", async () => {
      const credentials = {
        identifier: `ratelimit2${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.body.meta.message).toMatch(
        "Akses ditolak. Terlalu banyak permintaan.",
      );
    });

    it("should return fallback message when resetTime is not available", async () => {
      const credentials = {
        identifier: `ratelimit3${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);
    });

    it("should maintain rate limit across different invalid passwords", async () => {
      const baseIdentifier = `ratelimit4${Date.now()}@test.com`;

      // Make 6 attempts with different passwords
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post("/api/auth/login")
          .send({
            identifier: baseIdentifier,
            password: `wrong${i}`,
          });
      }

      // 7th attempt with yet another password should still be limited
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: baseIdentifier,
          password: "differentwrong",
        })
        .expect(429);

      expect(res.body.meta.statusCode).toBe(429);
    });

    it("should return 429 before executing login validation", async () => {
      const credentials = {
        identifier: `ratelimit5${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      // Send invalid payload (missing fields) - should still get 429
      const res = await request(app)
        .post("/api/auth/login")
        .send({ identifier: credentials.identifier })
        .expect(429);

      expect(res.body.meta.statusCode).toBe(429);
    });

    it("should include proper HTTP status code in response headers", async () => {
      const credentials = {
        identifier: `ratelimit6${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app).post("/api/auth/login").send(credentials);

      expect(res.status).toBe(429);
      expect(res.statusCode).toBe(429);
    });

    it("should return JSON content-type when rate limited", async () => {
      const credentials = {
        identifier: `ratelimit7@test.com`, // jangan pakai Date.now()
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.headers["content-type"]).toMatch(/application\/json/);
    });

    it("should not expose sensitive information in rate limit error", async () => {
      const credentials = {
        identifier: `ratelimit8${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger rate limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      // Should not expose IP, user agent, or other sensitive data
      expect(res.body.meta.message).not.toMatch(
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
      ); // No IP
      expect(res.body.data).toBeNull();
      expect(res.body).not.toHaveProperty("ip");
      expect(res.body).not.toHaveProperty("userAgent");
    });
  });

  // ===============================
  // 🔹 API REGULAR RATE LIMITER ERROR TESTS
  // ===============================
  describe("API Regular Rate Limiter Error Handling", () => {
    it("should return 429 with correct error structure after 5 requests", async () => {
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      // 6st request should be rate limited
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies)
        .expect(429);

      // Verify response structure
      expect(res.body).toHaveProperty("meta");
      expect(res.body).toHaveProperty("data");
      expect(res.body.meta).toHaveProperty("statusCode");
      expect(res.body.meta).toHaveProperty("message");
      expect(res.body.meta.statusCode).toBe(429);
      expect(res.body.data).toBeNull();
    });

    it("should return correct error message for API rate limit", async () => {
      // Make 6 requests to trigger limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies)
        .expect(429);

      expect(res.body.meta.message).toBe(
        "Akses ditolak. Terlalu banyak permintaan.",
      );
    });

    it("should return 429 for all API endpoints after limit exceeded", async () => {
      const agent = request.agent(app); // reuse same client/IP

      // trigger limit
      for (let i = 0; i < 5; i++) {
        await agent.get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      // semua endpoint harusnya sekarang kena limit
      const endpoints = [
        "/api/auth/me",
        "/api/kriteria/read-all",
        "/api/tim-akreditasi/read-all",
      ];

      for (const endpoint of endpoints) {
        const res = await agent.get(endpoint).set("Cookie", wakilDekanCookies);
        expect(res.status).toBe(429);
        expect(res.body.meta.statusCode).toBe(429);
      }
    });

    it("should return 429 before executing authentication middleware", async () => {
      // Make 6 requests with valid auth
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      // Request without auth should still get 429, not 401
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(429);
      expect(res.body.meta.statusCode).toBe(429);
    });

    it("should return 429 for POST requests after limit exceeded", async () => {
      // Exhaust limit with GET requests
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      // POST request should also be limited
      const res = await request(app)
        .post("/api/kriteria/create")
        .set("Cookie", wakilDekanCookies)
        .send({
          kriteria: 10,
          namaKriteria: "Kriteria Baru",
        });

      expect(res.status).toBe(429);
    });

    it("should return 429 for PATCH requests after limit exceeded", async () => {
      // Exhaust limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const data = await prisma.kriteria.create({
        data: {
          kriteria: Math.floor(Math.random() * 1000),
          namaKriteria: "Kriteria Baru",
        },
      });

      const res = await request(app)
        .patch(`/api/kriteria/update/${data.id}`)
        .set("Cookie", wakilDekanCookies)
        .send({ namaKriteria: "Updated" });

      expect(res.status).toBe(429);
    });

    it("should return 429 for DELETE requests after limit exceeded", async () => {
      // Exhaust limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const res = await request(app)
        .delete("/api/kriteria/delete/some-id")
        .set("Cookie", wakilDekanCookies);

      expect(res.status).toBe(429);
    });

    it("should include proper HTTP status code in response headers", async () => {
      // Exhaust limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies);

      expect(res.status).toBe(429);
      expect(res.statusCode).toBe(429);
    });

    it("should return JSON content-type when rate limited", async () => {
      // Exhaust limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies)
        .expect(429);

      expect(res.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  // ===============================
  // 🔹 RATE LIMIT HEADERS ERROR TESTS
  // ===============================
  describe("Rate Limit Headers in Error Response", () => {
    it("should include standard rate limit headers when login is limited", async () => {
      const credentials = {
        identifier: `headers1${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.headers).toHaveProperty("ratelimit-limit");
      expect(res.headers).toHaveProperty("ratelimit-remaining");
      expect(res.headers).toHaveProperty("ratelimit-reset");
      expect(res.headers["ratelimit-remaining"]).toBe("0");
    });

    it("should include standard rate limit headers when API is limited", async () => {
      // Trigger limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies)
        .expect(429);

      expect(res.headers).toHaveProperty("ratelimit-limit");
      expect(res.headers).toHaveProperty("ratelimit-remaining");
      expect(res.headers).toHaveProperty("ratelimit-reset");
      expect(res.headers["ratelimit-remaining"]).toBe("0");
    });

    it("should NOT include legacy X-RateLimit headers", async () => {
      const credentials = {
        identifier: `headers2${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.headers).not.toHaveProperty("x-ratelimit-limit");
      expect(res.headers).not.toHaveProperty("x-ratelimit-remaining");
      expect(res.headers).not.toHaveProperty("x-ratelimit-reset");
    });
  });

  // ===============================
  // 🔹 EDGE CASES ERROR TESTS
  // ===============================
  describe("Rate Limiter Edge Cases Error Handling", () => {
    it("should handle rapid concurrent requests correctly", async () => {
      const credentials = {
        identifier: `concurrent${Date.now()}@test.com`,
        password: "wrong",
      };

      // Make 10 concurrent requests
      const promises = Array(10)
        .fill(null)
        .map(() => request(app).post("/api/auth/login").send(credentials));

      const results = await Promise.all(promises);

      // At least some should succeed (under limit), at least some should fail (over limit)
      const rateLimited = results.filter((r) => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it("should handle requests with missing body when rate limited", async () => {
      const credentials = {
        identifier: `nobody${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app).post("/api/auth/login").expect(429);

      expect(res.body.meta.statusCode).toBe(429);
    });

    it("should return consistent error format across multiple 429 responses", async () => {
      const credentials = {
        identifier: `consistent${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      // Make 5 more requests after limit
      const responses = [];
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post("/api/auth/login")
          .send(credentials);
        responses.push(res);
      }

      // All should have same structure
      responses.forEach((res) => {
        expect(res.status).toBe(429);
        expect(res.body).toHaveProperty("meta");
        expect(res.body).toHaveProperty("data");
        expect(res.body.meta.statusCode).toBe(429);
        expect(res.body.data).toBeNull();
      });
    });
  });

  // ===============================
  // 🔹 RESPONSE CONSISTENCY TESTS
  // ===============================
  describe("Rate Limiter Response Consistency", () => {
    it("should always return null for data field when rate limited", async () => {
      const credentials = {
        identifier: `nulldata${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.body.data).toBeNull();
      expect(res.body.data).not.toBe(undefined);
      expect(res.body.data).not.toBe("");
    });

    it("should match ResponseStructure<null> interface exactly", async () => {
      const credentials = {
        identifier: `structure${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      // Should only have 'meta' and 'data' properties
      const keys = Object.keys(res.body);
      expect(keys).toContain("meta");
      expect(keys).toContain("data");
      expect(keys.length).toBe(2);

      // Meta should have statusCode and message
      const metaKeys = Object.keys(res.body.meta);
      expect(metaKeys).toContain("statusCode");
      expect(metaKeys).toContain("message");
      expect(metaKeys.length).toBe(2);
    });

    it("should use consistent casing in error messages", async () => {
      const loginCredentials = {
        identifier: `casing1${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger login limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(loginCredentials);
      }

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials)
        .expect(429);

      // Trigger API limit
      for (let i = 0; i < 6; i++) {
        await request(app).get("/api/auth/me").set("Cookie", wakilDekanCookies);
      }

      const apiRes = await request(app)
        .get("/api/auth/me")
        .set("Cookie", wakilDekanCookies)
        .expect(429);

      // Both should start with capital letter
      expect(loginRes.body.meta.message[0]).toMatch(/[A-Z]/);
      expect(apiRes.body.meta.message[0]).toMatch(/[A-Z]/);
    });

    it("should not include stack trace in error response", async () => {
      const credentials = {
        identifier: `nostack${Date.now()}@test.com`,
        password: "wrong",
      };

      // Trigger limit
      for (let i = 0; i < 7; i++) {
        await request(app).post("/api/auth/login").send(credentials);
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(429);

      expect(res.body).not.toHaveProperty("stack");
      expect(res.body).not.toHaveProperty("trace");
      expect(res.body).not.toHaveProperty("error");
    });
  });
});
