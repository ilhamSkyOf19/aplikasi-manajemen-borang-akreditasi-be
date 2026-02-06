import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "vitest";

describe("Global Tests", () => {
  it("should respond with 200 status code for the root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
