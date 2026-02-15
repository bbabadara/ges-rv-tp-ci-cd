// Charger les variables d'environnement EN PREMIER
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes';
import demandeRVRoutes from './routes/demandeRVRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { initializeDatabase } from './config/database';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', patientRoutes);
app.use('/api', demandeRVRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString(),
  });
});

// Route principale
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API de gestion des rendez-vous médicaux',
    version: '1.0.0',
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Initialiser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    await initializeDatabase();

    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });
    
    return server;
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

// Démarrer l'application
if (require.main === module) {
  startServer().catch(err => {
    console.error('❌ Erreur lors du démarrage:', err);
    process.exit(1);
  });
}

export default app;