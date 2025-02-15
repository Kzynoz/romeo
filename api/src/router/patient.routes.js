import { Router } from "express";
import { validatorCreateUser } from "../middlewares/validator.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  add,
  getAll,
  getOne,
  remove,
} from "../controllers/patient.controller.js";

const router = Router();

router.get("/", getAll); // En cours SQL bon
router.get("/:id", getOne); // à refaire
router.post("/", add); // à refaire
router.delete("/:id", isAdmin, remove); // à refaire

//router.patch("/:id", update);

//router.get("/:id/soin", getAll);

export default router;
