import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const patientController = new PatientController();

// Routes publiques
router.post('/patients/login', patientController.login.bind(patientController));
router.post('/patients', patientController.createPatient.bind(patientController));

// Routes protégées (nécessitent authentification)
router.use(authenticate);

router.get('/patients', patientController.getAllPatients.bind(patientController));
router.get('/patients/:id', patientController.getPatientById.bind(patientController));
router.get('/patients/me', patientController.getProfile.bind(patientController));
router.put('/patients/:id', patientController.updatePatient.bind(patientController));
router.delete('/patients/:id', patientController.deletePatient.bind(patientController));

export default router;