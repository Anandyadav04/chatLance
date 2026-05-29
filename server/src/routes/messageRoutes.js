import express from "express";

import protect from "../middleware/authMiddleware.js";

import { getMessages } from "../controllers/messageController.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/:roomId", protect, getMessages);

export default router;