import express from 'express';
import {createTicket, getAllTickets, assignTicket} from '../controllers/ticketController.js';
import upload from '../middlewares/uploads.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateTicketStatus } from '../controllers/ticketController.js';
import { createMessage } from '../controllers/messageController.js';


const router = express.Router();

router.post("/", authMiddleware, upload.array('attachments'), createTicket);
router.get('/', authMiddleware, getAllTickets);
router.put("/assign", authMiddleware, assignTicket);  // new route for assigning tickets
router.put("/status/:ticketId", authMiddleware, updateTicketStatus); //to update ticket status
router.post("/messages", authMiddleware, createMessage);




export default router;

