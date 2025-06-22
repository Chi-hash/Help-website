import express from 'express';
import {
  createTicket, 
  getAllTickets, 
  assignTicket,
  updateTicketStatus,
  openTicket,
  startProgressTicket,
  resolveTicket,
  closeTicket
} from '../controllers/ticketController.js';
import upload from '../middlewares/uploads.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createMessage } from '../controllers/messageController.js';

const router = express.Router();

// Create ticket
router.post("/", authMiddleware, upload.array('attachments'), createTicket);

// Get all tickets
router.get('/', authMiddleware, getAllTickets);

// Assign ticket
router.put("/assign", authMiddleware, assignTicket);

// Generic status update (legacy)
router.put("/status/:ticketId", authMiddleware, updateTicketStatus);

// Specific status change routes with notifications and emails
router.put("/:ticketId/open", authMiddleware, openTicket);
router.put("/:ticketId/start-progress", authMiddleware, startProgressTicket);
router.put("/:ticketId/resolve", authMiddleware, resolveTicket);
router.put("/:ticketId/close", authMiddleware, closeTicket);

// Messages
router.post("/messages", authMiddleware, createMessage);

export default router;

