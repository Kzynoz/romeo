import { Router } from "express";
import {
  guardianLogin,
  guardianRegister,
  login,
  logout,
  refreshLogin,
  register,
} from "../controllers/auth.controller.js";
import {
  validatorCreateUser,
  validatorRegisterGuardian,
} from "../middlewares/validators/authValidator.js";
import isAdmin from "../middlewares/isAdmin.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.post("/register", authCheck, isAdmin, validatorCreateUser, register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-login", authCheck, refreshLogin);
router.post("/login-guardian", guardianLogin);

router.patch(
  "/register/:tokenUrl",
  validatorRegisterGuardian,
  guardianRegister
);

export default router;
