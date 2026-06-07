import express from "express";

import { sendDirectMessage, getDirectMessages } from "../controllers/dmController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendDirectMessage);

router.get("/:id", protect, getDirectMessages);

export default router;
