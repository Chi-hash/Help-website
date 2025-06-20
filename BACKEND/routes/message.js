import express from "express";
import { createMessage, markMessageAsRead, getMessagesForTicket } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/:ticketId", authMiddleware, getMessagesForTicket);
router.patch("/:messageId/read", authMiddleware, markMessageAsRead);

export default router;
