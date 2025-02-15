import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import { remove } from "../controllers/customer.controller.js";

const router = Router();

router.delete("/", isAdmin, remove);
