import { Router } from "express";

// Middleware
import isAdmin from "../middlewares/isAdmin.js";

import {
  create,
  getAll,
  getBySearch,
  getOne,
  remove,
  update,
} from "../controllers/guardian.controller.js";

// Form validator for create and update
import {
  validatorCreateGuardian,
  validatorUpdateGuardian,
} from "../middlewares/validators/guardianValidator.js";

const router = Router();

// Route to create a new guardian
router.post("/", validatorCreateGuardian, create);

// Route to get All guardians
router.get("/", getAll);

// Route to search a specific guardian
router.get("/search", getBySearch);

// Route to get a specific guardian with ID
router.get("/:id", getOne);

// Route to update a guardian
router.patch("/:id", validatorUpdateGuardian, update);

// Route to remove a guardian
router.delete("/:idItem", isAdmin, remove);

export default router;
