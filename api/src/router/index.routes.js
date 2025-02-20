import { Router } from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.routes.js";
import guardianRoutes from "./guardian.routes.js";
import retirementHomeRoutes from "./retirement_home.routes.js";
import careRoutes from "./care.routes.js";

import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/patients", authCheck, patientRoutes);
router.use("/guardians", authCheck, guardianRoutes);
router.use("/retirement-homes", authCheck, retirementHomeRoutes);
router.use("/care", authCheck, careRoutes);
export default router;
