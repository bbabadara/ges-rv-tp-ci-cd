import request from 'supertest';
import app from '../src/app';

describe('Patient API', () => {
  let token: string;
  let patientId: string;

  // Test d'inscription
  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          nom: 'Doe',
          prenom: 'John',
          email: 'john.doe@example.com',
          motDePasse: 'password123',
          telephone: '0123456789',
          dateNaissance: '1990-01-01',
          antecedentsMedicaux: 'Aucun'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe('john.doe@example.com');
      patientId = response.body.data.id;
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          nom: 'Test',
          email: 'test@example.com'
          // motDePasse manquant
        });

      expect(response.status).toBe(400);
    });
  });

  // Test de connexion
  describe('POST /api/patients/login', () => {
    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/patients/login')
        .send({
          email: 'john.doe@example.com',
          motDePasse: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data.email).toBe('john.doe@example.com');
      token = response.body.token;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/patients/login')
        .send({
          email: 'john.doe@example.com',
          motDePasse: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  // Test des routes protégées
  describe('Protected routes', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/patients/me');

      expect(response.status).toBe(401);
    });

    it('should get patient profile with valid token', async () => {
      const response = await request(app)
        .get('/api/patients/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(patientId);
    });

    it('should get all patients with valid token', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
    });
  });
});