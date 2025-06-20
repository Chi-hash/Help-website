import notification from "./models/notification.js";
import User from "./models/user.js";
import { sendEmail } from "./mailer.js";

export const createNotification = async ({
  message,
  type,
  createdBy,
  roleVisibleTo,
  ticketId,
  link, // optional link to ticket or page
}) => {
  try {
    const notification = await Notification.create({
      message,
      type,
      createdBy,
      roleVisibleTo,
      ticketId,
    });

    //  emails to users with the matching role
    const usersToNotify = await User.find({
      role: { $in: roleVisibleTo },
    });

    for (const user of usersToNotify) {
      const emailContent = `
        <p>Hello ${user.firstname},</p>
        <p>${message}</p>
        ${
          link
            ? `<p>Click <a href="${link}">here</a> to view more details.</p>`
            : ""
        }
        <p>Regards,<br>HELP! IT Support</p>
      `;

      await sendEmail({
        to: user.email,
        subject: `🔔 New Notification from HELP!`,
        html: emailContent,
      });
    }

    return notification;
  } catch (err) {
    console.error("❌ Notification creation failed:", err.message);
  }
};
