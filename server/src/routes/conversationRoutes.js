import express from "express";

import { createConversation, getConversations, getUnreadCounts } from "../controllers/ConversationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createConversation);

router.get("/", protect, getConversations);

router.get("/unread", protect, getUnreadCounts);

export default router;