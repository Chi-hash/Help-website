// models/notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    type: String, // e.g. "ticket", "user", "role-change"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    roleVisibleTo: [String], // e.g. ['superAdmin', 'admin']
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
