import { Router } from "express";

import {
	getBySearch,
} from "../controllers/practitioner.controller.js";

const router = Router();

// Route to search care, patients or guardians (only for practitioner whoo's logged)
router.get("/search", getBySearch);

export default router;
