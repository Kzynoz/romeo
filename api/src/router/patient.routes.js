import { Router } from "express";
import {
  validatorCreatePatient,
  validatorUpdatePatient,
} from "../middlewares/validators/patientValidator.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  create,
  getAll,
  getBySearch,
  getOne,
  remove,
  update,
} from "../controllers/patient.controller.js";

const router = Router();

router.post("/", validatorCreatePatient, create);

router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.patch("/:id", validatorUpdatePatient, update);

router.delete("/:id", isAdmin, remove);

export default router;
