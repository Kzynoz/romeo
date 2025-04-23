import { Router } from "express";

// Middlewares
import isAdmin from "../middlewares/isAdmin.js";
import isGuardian from "../middlewares/isGuardian.js";

import {
  create,
  getAll,
  getBySearch,
  getTotalCareByYear,
  getTotalCareThisMonth,
  remove,
  update,
  getInvoice,
  getOneCare
} from "../controllers/care.controller.js";

// Validator for create and update
import {
  validatorCreateCare,
  validatorUpdateCare,
} from "../middlewares/validators/careValidator.js";

const router = Router();

// Route to create a new care
router.post("/", validatorCreateCare, create);

// Route to get all care
router.get("/", getAll);

// Route to get a specific care by patient ID and care ID
router.get("/:patientId/:id", isGuardian, getOneCare);

// Route to count the number of cares made during the current month, use for statistics
router.get("/count-this-month", getTotalCareThisMonth);

// Route to count the number of care made this year, use for statistics
router.get("/count-by-year/:year", getTotalCareByYear);

// Route to search a specific care
router.get("/search", getBySearch);

// Route to get a specifi invoice by its filename
router.get("/invoices/:filename", getInvoice);

// Route to update care details
router.patch("/:id", validatorUpdateCare, update);

// Route to remove a care
router.delete("/:idItem", isAdmin, remove);

export default router;
