import { Router } from "express";
import {
	getBySearch,
} from "../controllers/practitioner.controller.js";

const router = Router();

router.get("/search", getBySearch);

export default router;
