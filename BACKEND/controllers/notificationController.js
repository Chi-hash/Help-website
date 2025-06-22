import Notification from '../models/notification.js';
import User from '../models/user.js';
import { sendEmail } from '../mailer.js';

// Test email function (for development/testing)
export const testEmail = async (req, res) => {
  try {
    const { email, message = 'This is a test email from HELP! system' } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email configuration missing. Please check EMAIL_USER and EMAIL_PASS in your .env file' 
      });
    }

    console.log('🧪 Testing email configuration...');
    console.log('📧 From:', process.env.EMAIL_USER);
    console.log('📧 To:', email);
    console.log('📧 Subject: Test Email from HELP!');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #634AFF; margin-bottom: 20px;">🔔 HELP! Test Email</h2>
          <p style="font-size: 16px; margin-bottom: 15px;">Hello,</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">${message}</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">If you received this email, the notification system is working correctly!</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;"><strong>Test Details:</strong></p>
          <ul style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <li>Sent at: ${new Date().toLocaleString()}</li>
            <li>From: ${process.env.EMAIL_USER}</li>
            <li>To: ${email}</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
          <p style="font-size: 12px; color: #6c757d; margin: 0;">
            Regards,<br>
            <strong>HELP! IT Support Team</strong>
          </p>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: email,
      subject: `🔔 Test Email from HELP! - ${new Date().toLocaleString()}`,
      html: emailContent,
    });

    res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    
    let errorMessage = 'Failed to send test email';
    let errorDetails = error.message;

    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed';
      errorDetails = 'Please check your EMAIL_USER and EMAIL_PASS. Make sure you\'re using an App Password for Gmail.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed';
      errorDetails = 'Please check your internet connection and try again.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timed out';
      errorDetails = 'The email server took too long to respond. Please try again.';
    }

    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: errorDetails,
      error: error.message 
    });
  }
};

// Test email configuration (without sending email)
export const testEmailConfig = async (req, res) => {
  try {
    console.log('🔍 Checking email configuration...');
    
    // Check environment variables
    if (!process.env.EMAIL_USER) {
      return res.status(500).json({ 
        success: false, 
        message: 'EMAIL_USER is not set in .env file',
        config: {
          emailUser: 'NOT SET',
          emailPass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
        }
      });
    }
    
    if (!process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        message: 'EMAIL_PASS is not set in .env file',
        config: {
          emailUser: process.env.EMAIL_USER,
          emailPass: 'NOT SET'
        }
      });
    }

    // Check if it looks like an App Password (16 characters, no spaces)
    const isAppPassword = process.env.EMAIL_PASS.length === 16 && !process.env.EMAIL_PASS.includes(' ');
    
    res.status(200).json({
      success: true,
      message: 'Email configuration found',
      config: {
        emailUser: process.env.EMAIL_USER,
        emailPass: 'SET',
        isAppPassword: isAppPassword,
        emailPassLength: process.env.EMAIL_PASS.length,
        hasSpaces: process.env.EMAIL_PASS.includes(' ')
      },
      recommendations: {
        appPassword: isAppPassword ? '✅ Looks like an App Password' : '❌ Should be 16 characters, no spaces',
        gmailFormat: process.env.EMAIL_USER.includes('@gmail.com') ? '✅ Gmail format detected' : '⚠️ Make sure this is a Gmail address'
      }
    });
  } catch (error) {
    console.error('❌ Configuration test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Configuration test failed',
      error: error.message 
    });
  }
};

// Create test notification (for development/testing)
export const createTestNotification = async (req, res) => {
  try {
    const { message = 'This is a test notification', type = 'test', roleVisibleTo = ['superAdmin', 'admin', 'it', 'staff'] } = req.body;
    
    const testNotification = new Notification({
      message,
      type,
      createdBy: req.user._id,
      roleVisibleTo,
    });

    await testNotification.save();

    res.status(201).json({
      success: true,
      message: 'Test notification created successfully',
      notification: testNotification
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get notifications for the current user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get notifications visible to the user's role
    const notifications = await Notification.find({
      roleVisibleTo: { $in: [userRole] }
    })
    .populate('createdBy', 'firstname lastname')
    .populate('ticketId', 'ticketNumber subject')
    .sort({ createdAt: -1 })
    .limit(50); // Limit to last 50 notifications

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      roleVisibleTo: { $in: [userRole] },
      readBy: { $not: { $elemMatch: { user: userId } } }
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user has already read this notification
    const alreadyRead = notification.readBy.some(read => read.user.toString() === userId.toString());
    
    if (!alreadyRead) {
      notification.readBy.push({
        user: userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark all notifications as read for the current user
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Find all unread notifications for the user's role
    const unreadNotifications = await Notification.find({
      roleVisibleTo: { $in: [userRole] },
      readBy: { $not: { $elemMatch: { user: userId } } }
    });

    // Mark each as read
    for (const notification of unreadNotifications) {
      notification.readBy.push({
        user: userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: `Marked ${unreadNotifications.length} notifications as read`,
      count: unreadNotifications.length,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete notification (for admins/superAdmins)
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userRole = req.user.role;

    // Only admins and superAdmins can delete notifications
    if (!['admin', 'superAdmin'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get notification statistics (for admins/superAdmins)
export const getNotificationStats = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only admins and superAdmins can view notification stats
    if (!['admin', 'superAdmin'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalNotifications = await Notification.countDocuments();
    const todayNotifications = await Notification.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const notificationsByType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentNotifications = await Notification.find()
      .populate('createdBy', 'firstname lastname')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        total: totalNotifications,
        today: todayNotifications,
        byType: notificationsByType,
        recent: recentNotifications,
      },
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


