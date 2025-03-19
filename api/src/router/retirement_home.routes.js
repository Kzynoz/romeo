import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
	create,
	getAll,
	getBySearch,
	getOne,
	remove,
	update,
} from "../controllers/retirement_home.controller.js";
import {
	validatorCreateRH,
	validatorUpdateRH,
} from "../middlewares/validators/retirementHomeValidator.js";

const router = Router();

router.post("/", validatorCreateRH, create);

router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.patch("/:id", validatorUpdateRH, update);

router.delete("/:idItem", isAdmin, remove);

export default router;
