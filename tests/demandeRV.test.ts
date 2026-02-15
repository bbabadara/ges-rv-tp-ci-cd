import request from 'supertest';
import app from '../src/app';

describe('Demande RV API', () => {
  let token: string;
  let patientId: string;
  let demandeId: string;

  beforeAll(async () => {
    // Créer un patient et se connecter
    await request(app)
      .post('/api/patients')
      .send({
        nom: 'Test',
        prenom: 'Patient',
        email: 'test.patient@example.com',
        motDePasse: 'password123'
      });

    const loginResponse = await request(app)
      .post('/api/patients/login')
      .send({
        email: 'test.patient@example.com',
        motDePasse: 'password123'
      });

    token = loginResponse.body.token;
    patientId = loginResponse.body.data.id;
  });

  describe('POST /api/demandes', () => {
    it('should create a new demande RV', async () => {
      const response = await request(app)
        .post('/api/demandes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: '2024-12-31',
          heure: '14:00',
          specialite: 'GENERALISTE',
          commentaire: 'Première visite'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.statut).toBe('EN_ATTENTE');
      expect(response.body.data.specialite).toBe('GENERALISTE');
      demandeId = response.body.data.id;
    });

    it('should return 400 for invalid specialite', async () => {
      const response = await request(app)
        .post('/api/demandes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: '2024-12-31',
          heure: '14:00',
          specialite: 'INVALID_SPECIALITE'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/demandes/mine', () => {
    it('should get all my demandes', async () => {
      const response = await request(app)
        .get('/api/demandes/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body.count).toBeGreaterThan(0);
    });
  });

  describe('GET /api/demandes/mine/filter', () => {
    it('should filter demandes by statut', async () => {
      const response = await request(app)
        .get('/api/demandes/mine/filter?statut=EN_ATTENTE')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every((d: any) => d.statut === 'EN_ATTENTE')).toBe(true);
    });

    it('should return 400 for invalid statut', async () => {
      const response = await request(app)
        .get('/api/demandes/mine/filter?statut=INVALID')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/demandes/:id/cancel', () => {
    it('should cancel a demande', async () => {
      const response = await request(app)
        .put(`/api/demandes/${demandeId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.statut).toBe('ANNULE');
    });
  });
});