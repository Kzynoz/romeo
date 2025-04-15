import { Router } from "express";
import {
	validatorCreatePatient,
	validatorUpdatePatient,
} from "../middlewares/validators/patientValidator.js";
import isAdmin from "../middlewares/isAdmin.js";
import isGuardian from "../middlewares/isGuardian.js";
import {
	create,
	getAll,
	getBySearch,
	getOne,
	remove,
	update,
} from "../controllers/patient.controller.js";
import { getOneCare } from "../controllers/care.controller.js";

const router = Router();

router.post("/", validatorCreatePatient, create);

router.get("/", isGuardian, getAll);
router.get("/search", getBySearch);
router.get("/:patientId/care/:id", isGuardian, getOneCare);
router.get("/:id", isGuardian, getOne);

router.patch("/:id", validatorUpdatePatient, update);

router.delete("/:id", isAdmin, remove);

export default router;
