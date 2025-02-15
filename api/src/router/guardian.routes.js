import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  create,
  getAll,
  getBySearch,
  getOne,
  remove,
  update,
} from "../controllers/guardian.controller.js";
import {
  validatorCreateGuardian,
  validatorUpdateGuardian,
} from "../middlewares/validator.js";

const router = Router();

router.post("/", validatorCreateGuardian, create);

router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.patch("/:id", validatorUpdateGuardian, update);

router.delete("/:id", isAdmin, remove);

export default router;
