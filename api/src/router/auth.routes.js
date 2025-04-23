import { Router } from "express";

// Validator for create and update
import {
	validatorCreateUser,
	validatorRegisterGuardian,
} from "../middlewares/validators/authValidator.js";

import {
	guardianLogin,
	login,
	logout,
	refreshLogin,
	guardianRegister,
	register
} from "../controllers/auth.controller.js";

// Middlewares
import isAdmin from "../middlewares/isAdmin.js";
import authCheck from "../middlewares/authCheck.js";


const router = Router();

// Route to register a new user, requires authentication and admin role 
// (Not yet implemented on the front-end, will be part of v2)
router.post("/register", authCheck, isAdmin, validatorCreateUser, register);

// Route to log in a practitioner
router.post("/login", login);

// Route to log out a user
router.post("/logout", logout);

// Route to refresh user login (reissue a token)
router.post("/refresh-login", authCheck, refreshLogin);

// Route for a guardian to log in
router.post("/login-guardian", guardianLogin);

// Route for a guardian to register, requires a token URL for validation
// (Not yet implemented on the front-end, will be part of v2)
router.patch("/register/:tokenUrl", validatorRegisterGuardian, guardianRegister);

export default router;
