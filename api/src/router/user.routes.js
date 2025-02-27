import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import authCheck from "../middlewares/authCheck.js";
import { getBySearch } from "../controllers/user.controller.js";

const router = Router();

router.get("/search", authCheck, getBySearch);

export default router;
