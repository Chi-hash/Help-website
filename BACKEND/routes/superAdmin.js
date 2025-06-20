import express from 'express';
import User from '../models/user.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import superAdminMiddleware from '../middlewares/superAdminMiddleware.js';
import { getSuperAdminStats } from "../controllers/superAdminController.js";
import { createNotification } from '../notify.js';
import { sendEmail } from '../mailer.js';

const router = express.Router();


router.get('/superAdmin-Dashboard', authMiddleware, superAdminMiddleware, getSuperAdminStats);


router.put('/users/by-email/:email/role', authMiddleware, superAdminMiddleware, async (req, res) => {
  const { role } = req.body;
  const email = req.params.email;

  if (!['staff', 'admin', 'superAdmin', 'IT'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Notify system
    await createNotification({
      message: `${req.user.firstname} ${req.user.lastname} changed ${user.firstname} ${user.lastname}'s role from ${oldRole} to ${role}`,
      type: 'role-change',
      createdBy: req.user._id,
      roleVisibleTo: ['admin', 'IT', 'superAdmin'],
    });

    // Email the affected user
    await sendEmail({
      to: user.email,
      subject: 'Your Role Has Been Updated',
      html: `
        <p>Hello ${user.firstname},</p>
        <p>Your role on <strong>HELP!</strong> has been changed from <strong>${oldRole}</strong> to <strong>${role}</strong>.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <br/>
        <p>Regards,<br/>HELP! Team</p>
      `,
    });

    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error('Error updating role:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
