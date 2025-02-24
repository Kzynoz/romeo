import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  create,
  getAll,
  getBySearch,
  getOne,
  getTotalCareByYear,
  getTotalCareThisMonth,
  remove,
  update,
} from "../controllers/care.controller.js";
import {
  validatorCreateCare,
  validatorUpdateCare,
} from "../middlewares/validators/careValidator.js";

const router = Router();

router.post("/", validatorCreateCare, create);

router.get("/", getAll);
router.get("/count-this-month", getTotalCareThisMonth);
router.get("/count-by-year/:year", getTotalCareByYear);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.patch("/:id", validatorUpdateCare, update);

router.delete("/:id", isAdmin, remove);

export default router;
