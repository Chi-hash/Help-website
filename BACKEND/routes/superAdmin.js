import express from 'express';
import User from '../models/user.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import superAdminMiddleware from '../middlewares/superAdminMiddleware.js';
import { getSuperAdminStats } from "../controllers/superAdminController.js";

const router = express.Router();


router.get('/superAdmin-Dashboard', authMiddleware, superAdminMiddleware, getSuperAdminStats);


router.put('/users/by-email/:email/role', authMiddleware, superAdminMiddleware, async (req, res) => {
  const { role } = req.body;
  const email = req.params.email;


  if (!['staff', 'admin', 'superAdmin', 'it'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error("Error updating role:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
