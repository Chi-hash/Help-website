// routes/notification.js
import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationStats,
  testEmail,
  testEmailConfig,
  createTestNotification,
  getLatestNotifications,
} from '../controllers/notificationController.js';
import  authMiddleware  from '../middlewares/authMiddleware.js';
import  adminMiddleware  from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Test email configuration (no auth required)
router.get('/test-config', testEmailConfig);

// Test email route (for development/testing)
router.post('/test-email', testEmail);

// All routes require authentication
router.use(authMiddleware);

// Create test notification (for development/testing)
router.post('/test', createTestNotification);

// Get user's notifications
router.get('/user', getUserNotifications);

// Add latest notifications route
router.get('/latest', getLatestNotifications);

// Mark notification as read
router.patch('/:notificationId/read', markNotificationAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllNotificationsAsRead);

// Admin/SuperAdmin routes
router.use(adminMiddleware);

// Delete notification (admin/superAdmin only)
router.delete('/:notificationId', deleteNotification);

// Get notification statistics (admin/superAdmin only)
router.get('/stats', getNotificationStats);

export default router; 