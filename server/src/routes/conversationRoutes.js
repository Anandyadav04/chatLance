import express from "express";

import { createConversation, getConversations } from "../controllers/ConversationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createConversation);

router.get("/", protect, getConversations);

export default router;