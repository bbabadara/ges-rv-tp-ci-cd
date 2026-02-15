// src/routes/demandeRVRoutes.ts
import { Router } from 'express';
import { DemandeRVController } from '../controllers/demandeRVController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const demandeRVController = new DemandeRVController();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// Routes des demandes de rendez-vous
router.get('/demandes', demandeRVController.getAllDemandes.bind(demandeRVController));
router.get('/demandes/:id', demandeRVController.getDemandeById.bind(demandeRVController));
router.post('/demandes', demandeRVController.createDemande.bind(demandeRVController));
router.get('/demandes/mine', demandeRVController.getMyDemandes.bind(demandeRVController));
router.get('/demandes/mine/filter', demandeRVController.getMyDemandesByStatut.bind(demandeRVController));
router.get('/demandes/mine/confirmed', demandeRVController.getMyConfirmedRV.bind(demandeRVController)); // Ajout pour "Voir ses RV"
router.put('/demandes/:id', demandeRVController.updateDemande.bind(demandeRVController));
router.delete('/demandes/:id', demandeRVController.deleteDemande.bind(demandeRVController));
router.put('/demandes/:id/cancel', demandeRVController.cancelDemande.bind(demandeRVController));

export default router;