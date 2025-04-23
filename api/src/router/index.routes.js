import { Router } from "express";

// Import routes
import authRoutes from "./auth.routes.js";
import guardianRoutes from "./guardian.routes.js";
import retirementHomeRoutes from "./retirement_home.routes.js";
import careRoutes from "./care.routes.js";
import practitionerRoutes from "./practitioner.routes.js";
import customerRoutes from "./customer.routes.js";

// Middleware
import authCheck from "../middlewares/authCheck.js";

const router = Router();

// Route for authentification, register, logout
router.use("/auth", authRoutes);

// Route for customers (patients and guardians)
router.use("/customers", authCheck, customerRoutes);
router.use("/guardians", authCheck, guardianRoutes);

// Route for retirement homes
router.use("/retirement-homes", authCheck, retirementHomeRoutes);

// Route for care
router.use("/care", authCheck, careRoutes);

// Route for practitioner
router.use("/practitioner", authCheck, practitionerRoutes);

export default router;
