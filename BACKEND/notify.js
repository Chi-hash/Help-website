import Notification from "./models/notification.js";
import User from "./models/user.js";
import { sendEmail } from "./mailer.js";

export const createNotification = async ({
  message,
  type,
  createdBy,
  roleVisibleTo,
  ticketId,
  link, // optional link to ticket or page
  specificUsers = [], // Array of user IDs to send emails to specifically
}) => {
  try {
    const newNotification = await Notification.create({
      message,
      type,
      createdBy,
      roleVisibleTo,
      ticketId,
    });

    let usersToNotify = [];

    // If specific users are provided, send emails to them
    if (specificUsers.length > 0) {
      usersToNotify = await User.find({
        _id: { $in: specificUsers }
      });
    } else {
      // Fallback to role-based notification (for general announcements)
      usersToNotify = await User.find({
        role: { $in: roleVisibleTo },
      });
    }

    for (const user of usersToNotify) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #634AFF; margin-bottom: 20px;">🔔 HELP! Notification</h2>
            <p style="font-size: 16px; margin-bottom: 15px;">Hello ${user.firstname},</p>
            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">${message}</p>
            ${
              link
                ? `<p style="margin-bottom: 20px;"><a href="${link}" style="background-color: #634AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Details</a></p>`
                : ""
            }
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
            <p style="font-size: 12px; color: #6c757d; margin: 0;">
              Regards,<br>
              <strong>HELP! IT Support Team</strong>
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: `🔔 New Notification from HELP!`,
        html: emailContent,
      });
    }

    return newNotification;
  } catch (err) {
    console.error("❌ Notification creation failed:", err.message);
    throw err;
  }
};
