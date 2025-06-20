import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import notification from "../models/notification.js";



export const getNotifications = async (req, res) => {
  try {
    const { limit } = req.query;
    const notifications = await Notification.find({
      $or: [
        { roleVisibleTo: req.user.role },
        { createdBy: req.user._id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 50);

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: "Not found" });

    const alreadyRead = notification.readBy.find(r => r.user.toString() === req.user._id);
    if (!alreadyRead) {
      notification.readBy.push({ user: req.user._id });
      await notification.save();
    }

    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update read status" });
  }
};


