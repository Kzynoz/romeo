import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  create,
  getAll,
  getBySearch,
  getOne,
  update,
} from "../controllers/care.controller.js";
import { validatorCreateCare } from "../middlewares/validator.js";

const router = Router();

router.post("/", validatorCreateCare, create);

router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.patch("/:id", update);

//router.delete("/:id", isAdmin, remove);

export default router;
