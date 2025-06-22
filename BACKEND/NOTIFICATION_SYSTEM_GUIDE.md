# 🚨 Notification System Implementation Guide

This guide will walk you through building a robust notification system for your helpdesk app, including backend and frontend integration.

---

## 1. Backend Setup

### 1.1. Create the Notification Model
**File:** `BACKEND/models/notification.js`
```js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    type: String, // e.g. "ticket-create", "ticket-assign", "login"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    roleVisibleTo: [String], // e.g. ['superAdmin', 'admin', 'it', 'staff']
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now }
      }
    ],
    link: String, // Optional link to related content
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
```

### 1.2. Create Notification Controller
**File:** `BACKEND/controllers/notificationController.js`
- Implement endpoints for:
  - Getting user notifications
  - Marking as read
  - Marking all as read
  - (Optional) Deleting notifications

### 1.3. Add Notification Routes
**File:** `BACKEND/routes/notification.js`
```js
import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  // ...other controllers
} from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/user', getUserNotifications);
router.patch('/:notificationId/read', markNotificationAsRead);
router.patch('/mark-all-read', markAllNotificationsAsRead);
// ...other routes
export default router;
```

### 1.4. Register the Route in Your Server
**File:** `BACKEND/server.js`
```js
import notificationRoutes from './routes/notification.js';
app.use('/api/notifications', notificationRoutes);
```

### 1.5. Trigger Notifications in Business Logic
- In your ticket/user controllers, create notifications when relevant events occur (e.g., ticket created, assigned, resolved).
- Example:
```js
import Notification from '../models/notification.js';
await Notification.create({
  message: `Ticket #${ticket.ticketNumber} created`,
  type: 'ticket-create',
  createdBy: req.user._id,
  ticketId: ticket._id,
  roleVisibleTo: ['admin', 'superAdmin', 'it'],
});
```

---

## 2. Frontend Setup

### 2.1. Create Notification API Utilities
- Create functions to call your backend notification endpoints (get, mark as read, etc).

### 2.2. Create Notification Context (Optional but recommended)
- Use React Context to manage notification state globally.

### 2.3. Build Notification UI Components
- **Notification Bell/Dropdown:** Shows unread count and lists notifications.
- **Toast Notifications:** For real-time popups.
- **Settings Modal:** For user preferences (optional).

### 2.4. Integrate in App
- Add the notification dropdown to your main header/dashboard layout.
- Use the context/provider at the top level (e.g., in `App.jsx`).

### 2.5. Real-Time (Optional)
- For real-time updates, use WebSockets (e.g., Socket.io) or polling.

---

## 3. Email Notifications (Optional)
- Use nodemailer or similar in your backend to send emails when creating notifications.
- Store email preferences in user settings.

---

## 4. Testing
- Test notification creation by triggering events (e.g., create a ticket).
- Test marking as read, deleting, and UI updates.
- Test email delivery if enabled.

---

## 5. Security & Performance
- Ensure only authorized users can access/modify their notifications.
- Paginate or limit notification queries for performance.

---

## 6. Example Notification Object
```json
{
  "_id": "...",
  "message": "Ticket #123 created",
  "type": "ticket-create",
  "createdBy": { "_id": "...", "firstname": "..." },
  "ticketId": "...",
  "roleVisibleTo": ["admin", "superAdmin"],
  "readBy": [{ "user": "...", "readAt": "..." }],
  "createdAt": "..."
}
```

---

## 7. Further Enhancements
- Add push notifications (PWA, mobile)
- Add notification filtering/search
- Add notification preferences per user
- Add batch actions (mark all as read, delete all)

---

## ✅ Notification System Implementation Checklist

### Backend
- [ ] Create `Notification` model in `models/notification.js`
- [ ] Implement notification controller functions in `controllers/notificationController.js`
  - [ ] Get user notifications
  - [ ] Mark notification as read
  - [ ] Mark all as read
  - [ ] (Optional) Delete notification
- [ ] Add notification routes in `routes/notification.js`
- [ ] Register notification routes in `server.js`
- [ ] Trigger notifications in business logic (e.g., ticket creation, assignment, status change)
- [ ] (Optional) Implement email notification logic

### Frontend
- [ ] Create notification API utilities (fetch, mark as read, etc.)
- [ ] (Optional) Create notification context/provider for global state
- [ ] Build notification UI components:
  - [ ] Notification bell/dropdown
  - [ ] Toast notifications
  - [ ] (Optional) Notification settings modal
- [ ] Integrate notification UI into main header/dashboard
- [ ] (Optional) Implement real-time updates (WebSockets or polling)

### Testing & Enhancements
- [ ] Test notification creation and display
- [ ] Test marking as read and deleting
- [ ] Test email delivery (if enabled)
- [ ] Ensure security (only authorized users access/modify notifications)
- [ ] (Optional) Add pagination, filtering, or batch actions
- [ ] (Optional) Add push notifications or user preferences

---

**Use this checklist to track your progress as you build your notification system!** 