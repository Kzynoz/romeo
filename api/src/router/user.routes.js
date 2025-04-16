import { Router } from "express";
import {
	createInvoice,
	getBySearch,
	getInvoice,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/search", getBySearch);
/* router.get("/invoice/:id", getInvoice);

router.get("/invoicePdf/:id", createInvoice); */

export default router;
