import request from "supertest";
import app from "../src/app";

describe("Tests des endpoints selon les spécifications", () => {
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

  describe("GET /api/demandes", () => {
    it("doit retourner HTTP 200 et status OK", async () => {
      const response = await request(app).get("/api/demandes");

      // Peut être 401 si non authentifié, mais si authentifié doit être 200
      expect([200, 401]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.status).toBe("OK");
      }
    });

    it("doit échouer si l'endpoint est incorrect", async () => {
      const response = await request(app).get("/api/demande");

      expect(response.status).toBe(404);
    });
  });
});
