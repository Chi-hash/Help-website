import express from 'express';
import {createTicket, getTickets, assignTicket} from '../controllers/ticketController.js';
import upload from '../middlewares/uploads.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/", authMiddleware, upload.array('attachments'), createTicket);
router.get('/', authMiddleware, getTickets);
router.put("/assign", authMiddleware, assignTicket);  // new route for assigning tickets



export default router;

