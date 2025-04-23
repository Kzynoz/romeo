import { Router } from "express";

// Validator from create and update customer who's patient
import {
	validatorCreatePatient,
	validatorUpdatePatient,
} from "../middlewares/validators/patientValidator.js";

// Middleware
import isAdmin from "../middlewares/isAdmin.js";
import isGuardian from "../middlewares/isGuardian.js";

import {
	create,
	getAllPatients,
	getCustomersBySearch,
	getOnePatient,
	remove,
	update,
} from "../controllers/customer.controller.js";

const router = Router();

// Route to create a new customer who's patient
router.post("/", validatorCreatePatient, create);

// Route to get All patients (or all patients for specific guardian)
router.get("/", isGuardian, getAllPatients);

// Route to search a specific customer
router.get("/search", getCustomersBySearch);

// Route to get a specific customer who's patient by his id (Guardian can get one specific patient to)
router.get("/:id", isGuardian, getOnePatient);

// Route to update patient details
router.patch("/:id", validatorUpdatePatient, update);

// Route to remove a customer
router.delete("/:id", isAdmin, remove);

export default router;
