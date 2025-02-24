import { Router } from "express";
import {
  guardianRegister,
  login,
  logout,
  refreshLogin,
  register,
} from "../controllers/auth.controller.js";
import { validatorCreateUser } from "../middlewares/validators/authValidator.js";
import isAdmin from "../middlewares/isAdmin.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.post("/register", authCheck, isAdmin, validatorCreateUser, register);
router.patch("/register/:tokenUrl", guardianRegister);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-login", authCheck, refreshLogin);

// login guardian
// deconnexion guardian
// refresh login guardian
// regeration du token

export default router;
