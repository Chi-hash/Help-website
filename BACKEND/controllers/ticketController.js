import Ticket from '../models/ticket.js';
import User from '../models/user.js'; 

// Controller to create a ticket
export const createTicket = async (req, res) => {
  try {
    const {
      subject,         
      description,     
      status,         
      assignedTo,     
    } = req.body;

    
    const user = await User.findOne({ name: assignedTo });
    if (!user) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    // Get file paths of uploaded attachments
    const attachmentPaths = req.files?.map((file) => file.path) || [];

    //  Create a new ticket
    const ticket = new Ticket({
      subject,
      description,
      status,
      createdBy: req.user.id,       
      assignedTo: user._id,        
      attachments: attachmentPaths,
    });

    //Save to MongoDB
    await ticket.save();

    // Respond with the new ticket

    res.status(201).json({
      message: 'Ticket created with attachments',
      ticket,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
};


//to get ticktes based on role
export const getTickets = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;
     console.log('User role:', userRole);
    console.log('User ID:', userId);

    let tickets;

    if (userRole === 'admin') {
      tickets = await Ticket.find().populate('createdBy assignedTo');
    } else {
      tickets = await Ticket.find({ createdBy: userId }).populate('assignedTo');
    }

    res.json({ success: true, tickets });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



//assignticket
export const assignTicket = async (req, res) => {
  try {
    const { ticketId, assignedTo } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.assignedTo = assignedTo;
    ticket.status = 'in progress';  // match your enum value
    await ticket.save();

    res.json({ success: true, message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};