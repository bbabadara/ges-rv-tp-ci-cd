import express from "express";
import patientRoutes from "./routes/patientRoutes";
import { errorHandler } from "./middlewares/errorHandler";



const app = express();

app.use(express.json());
app.use("/api/patients", patientRoutes);

app.use(errorHandler);

export default app;
