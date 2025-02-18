import { Router } from "express";
import {
  login,
  logout,
  refreshLogin,
  register,
} from "../controllers/auth.controller.js";
import { validatorCreateUser } from "../middlewares/validator.js";
import isAdmin from "../middlewares/isAdmin.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.post("/register", authCheck, isAdmin, validatorCreateUser, register); // OK
router.post("/login", login); // OK
router.post("/logout", logout); // OK
router.post("/refresh-login", authCheck, refreshLogin); // OK

// connexion customer
// deconnexion customer
// register customer avec génération de TOKEN
// regeration du token

export default router;
