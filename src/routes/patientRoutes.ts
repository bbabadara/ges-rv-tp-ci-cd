import { Router } from "express";
import { getPatients } from "../controllers/patientController";

const router = Router();

router.get("/", getPatients);

export default router;
