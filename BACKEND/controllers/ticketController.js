// controllers/ticketController.js
import Ticket from '../models/ticket.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import { createNotification } from '../notify.js';

// Generate ticket number
let ticketCounter = 0;

function formatTicketNumber(number) {
  return `#${String(number).padStart(3, '0')}`;
}

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
    let counter = await Counter.findOne({ name: "ticket" });
    if (!counter) {
      counter = await Counter.create({ name: "ticket", value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const formattedNumber = `#${counter.value.toString().padStart(3, "0")}`;


    const ticket = new Ticket({
      subject,
      description,
      status,
      createdBy: req.user.id,
      assignedTo: user._id,
      attachments: attachmentPaths,
      ticketNumber: formattedNumber,

    });

    //Save to MongoDB
    await ticket.save();



    // To the staff themselves
    await createNotification({
      message: `You created a new ticket ${formattedNumber}: ${subject}`,
      type: "ticket",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: [user.role],
      link: `${process.env.CLIENT_URL}/my-tickets/${ticket._id}`,
    });

    // To admins, IT, superAdmin
    await createNotification({
      message: `New ticket ${formattedNumber} created by ${req.user.firstname} ${req.user.lastname}`,
      type: "ticket",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: ["admin", "IT", "superAdmin"],
       link: `${process.env.CLIENT_URL}/tickets/${ticket._id}`,
    });


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













export const assignTicket = async (req, res) => {
  try {
    const { ticketId, assignedTo } = req.body;
    const assignedBy = req.user._id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.assignedTo = assignedTo;
    ticket.status = 'Assigned';
    await ticket.save();

    const assigner = await User.findById(assignedBy);
    const assignee = await User.findById(assignedTo);

    await Notification.create({
      message: `Ticket ${ticket.ticketNumber} has been assigned to ${assignedUser.firstname} ${assignedUser.lastname}`,
      type: "assignment",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: ["admin", "IT", "superAdmin"],
      link: `${process.env.CLIENT_URL}/tickets/${ticket._id}`,
    });

    res.status(200).json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user._id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = 'Closed';
    await ticket.save();

    const user = await User.findById(userId);

    await createNotification({
  message: `Ticket ${ticket.ticketNumber} has been closed by ${req.user.firstname} ${req.user.lastname}`,
  type: "ticket-close",
  createdBy: req.user._id,
  ticketId: ticket._id,
  roleVisibleTo: ["admin", "IT", "superAdmin", ticket.createdBy.Role],
  link: `${process.env.CLIENT_URL}/tickets/${ticket._id}`,
});

await createNotification({
      message: `You closed ticket ${ticket.ticketNumber} `,
      type: "ticket-close",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: [req.user.role], 
      link: `${process.env.CLIENT_URL}/my-tickets/${ticket._id}`,
    });


    res.status(200).json({ message: 'Ticket closed successfully' });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const ticket = await Ticket.findById(ticketId).populate("createdBy");
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    await ticket.save();

    const user = await User.findById(userId);

    await Notification.create({
      message: `Ticket ${ticket.ticketNumber} status changed to ${ticket.status} by ${req.user.firstname} ${req.user.lastname}`,
      type: "status-change",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: ["admin", "IT", "superAdmin", ticket.createdBy.Role], // Replace with actual roles
      link: `${process.env.CLIENT_URL}/tickets/${ticket._id}`,
    });


    await createNotification({
      message: `You changed status of ticket ${ticket.ticketNumber} to ${ticket.status}`,
      type: "status-change",
      createdBy: req.user._id,
      ticketId: ticket._id,
      roleVisibleTo: [req.user.role], // likely "staff"
      link: `${process.env.CLIENT_URL}/my-tickets/${ticket._id}`,
    });

    res.status(200).json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};








export const getAllTickets = async (req, res) => {
  try {
    const { role, _id } = req.user;
    const {
      assignedTo,
      createdBy,
      email,
      department,
      status,
      startDate,
      endDate,
    } = req.query;

    let query = {};

    // 🧍 Staff sees only their own tickets
    if (role === "staff") {
      query.createdBy = _id;
    }

    // ✅ Search/Filter logic
    if (assignedTo) {
      const assignedUser = await User.findOne({
        $or: [
          { firstname: new RegExp(assignedTo, "i") },
          { lastname: new RegExp(assignedTo, "i") },
          { email: new RegExp(assignedTo, "i") },
        ],
      });
      if (assignedUser) query.assignedTo = assignedUser._id;
    }

    if (createdBy) {
      const creator = await User.findOne({
        $or: [
          { firstname: new RegExp(createdBy, "i") },
          { lastname: new RegExp(createdBy, "i") },
          { email: new RegExp(createdBy, "i") },
        ],
      });
      if (creator) query.createdBy = creator._id;
    }

    if (email) {
      const emailUser = await User.findOne({ email: new RegExp(email, "i") });
      if (emailUser) {
        query.$or = [
          { createdBy: emailUser._id },
          { assignedTo: emailUser._id },
        ];
      }
    }

    if (department) {
      const departmentUsers = await User.find({ department: new RegExp(department, "i") });
      const ids = departmentUsers.map((u) => u._id);
      query.$or = query.$or || [];
      query.$or.push({ createdBy: { $in: ids } }, { assignedTo: { $in: ids } });
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const tickets = await Ticket.find(query)
      .populate("createdBy", "firstname lastname email department role")
      .populate("assignedTo", "firstname lastname email department role")
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    console.error("❌ Failed to fetch tickets:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};