import request from "supertest";
import app from "../src/app";

describe("GET /api/patients", () => {
  it("doit retourner HTTP 200 et status OK", async () => {
    const response = await request(app).get("/api/patients");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });

  it("doit échouer si l'endpoint est incorrect", async () => {
    const response = await request(app).get("/api/patient");

    expect(response.status).toBe(404);
  });
});
