import Message from "../models/message.js";

// Create message
export const createMessage = async (req, res) => {
  try {
    const { content, ticketId } = req.body;

    const message = new Message({
      content,
      ticketId,
      sender: req.user._id,
    });

    await message.save();

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to send message" });
  }


  await createNotification({
  message: `New message on ticket ${ticket.ticketNumber}`,
  type: "message",
  createdBy: req.user._id,
  ticketId: ticket._id,
  roleVisibleTo: ["admin", "IT", "superAdmin", ticket.createdByRole],
  link: `${process.env.CLIENT_URL}/tickets/${ticket._id}`,
});

};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages for a ticket
export const getMessagesForTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const messages = await Message.find({ ticketId }).populate("sender", "firstname lastname role").sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
