import User from '../models/user.js';
import { createNotification } from '../notify.js';
import bcrypt from 'bcryptjs';

// Create new user (for admins/superAdmins)
export const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      role,
      department,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      department,
    });

    await newUser.save();

    // Notification to the new user 
    await createNotification({
      message: `Welcome to HELP! Your account has been created. You can now log in and start using the system.`,
      type: "account-created",
      createdBy: req.user._id,
      roleVisibleTo: [newUser.role],
      specificUsers: [newUser._id], // Send email to the new user
      link: `${process.env.CLIENT_URL}/login`,
    });

    // Notification to admins/superAdmins
    await createNotification({
      message: `New ${role} user account created for ${firstname} ${lastname} (${email})`,
      type: "user-created",
      createdBy: req.user._id,
      roleVisibleTo: ["admin", "superAdmin"],
      link: `${process.env.CLIENT_URL}/manage-users`,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user status (suspend/activate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    // Notification to the user whose status was changed
    await createNotification({
      message: `Your account status has been changed to ${status} by ${req.user.firstname} ${req.user.lastname}`,
      type: "status-change",
      createdBy: req.user._id,
      roleVisibleTo: [user.role],
      specificUsers: [user._id], // Send email to the affected user
      link: `${process.env.CLIENT_URL}/profile`,
    });

    // Notification to admins/superAdmins 
    await createNotification({
      message: `User ${user.firstname} ${user.lastname} (${user.email}) status changed from ${oldStatus} to ${status}`,
      type: "user-status-change",
      createdBy: req.user._id,
      roleVisibleTo: ["admin", "superAdmin"],
      link: `${process.env.CLIENT_URL}/manage-users`,
    });

    res.status(200).json({
      message: 'User status updated successfully',
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Notification to the user whose role was changed
    await createNotification({
      message: `Your role has been changed from ${oldRole} to ${role} by ${req.user.firstname} ${req.user.lastname}`,
      type: "role-change",
      createdBy: req.user._id,
      roleVisibleTo: [user.role],
      specificUsers: [user._id], // Send email to the affected user
      link: `${process.env.CLIENT_URL}/profile`,
    });

    // Notification to admins/superAdmins 
    await createNotification({
      message: `User ${user.firstname} ${user.lastname} (${user.email}) role changed from ${oldRole} to ${role}`,
      type: "user-role-change",
      createdBy: req.user._id,
      roleVisibleTo: ["admin", "superAdmin"],
      link: `${process.env.CLIENT_URL}/manage-users`,
    });

    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has any active tickets
    const Ticket = (await import('../models/ticket.js')).default;
    const activeTickets = await Ticket.find({
      $or: [
        { createdBy: userId, status: { $ne: 'Closed' } },
        { assignedTo: userId, status: { $ne: 'Closed' } }
      ]
    });

    if (activeTickets.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete user with active tickets. Please close or reassign tickets first.',
        activeTicketsCount: activeTickets.length
      });
    }

    const userInfo = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    };

    await User.findByIdAndDelete(userId);

    // Notification to admins/superAdmins
    await createNotification({
      message: `User ${userInfo.firstname} ${userInfo.lastname} (${userInfo.email}) has been deleted by ${req.user.firstname} ${req.user.lastname}`,
      type: "user-deleted",
      createdBy: req.user._id,
      roleVisibleTo: ["admin", "superAdmin"],
      link: `${process.env.CLIENT_URL}/manage-users`,
    });

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: userInfo,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 