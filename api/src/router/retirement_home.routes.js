import { Router } from "express";

// Middlewarz
import isAdmin from "../middlewares/isAdmin.js";

import {
	create,
	getAll,
	getBySearch,
	getOne,
	remove,
	update,
} from "../controllers/retirement_home.controller.js";

// Validator to create and update
import {
	validatorCreateRH,
	validatorUpdateRH,
} from "../middlewares/validators/retirementHomeValidator.js";

const router = Router();

// Route to create a new retirement home
router.post("/", validatorCreateRH, create);

// Route to get All retirement homes
router.get("/", getAll);

// Route to search a specific retirement home
router.get("/search", getBySearch);

// Route to get a specific retirement home by his id
router.get("/:id", getOne);

// Route to update retirement home details
router.patch("/:id", validatorUpdateRH, update);

// Route to remove a retirement home
router.delete("/:idItem", isAdmin, remove);

export default router;
