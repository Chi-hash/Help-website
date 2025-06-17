// controllers/userController.js

import User from '../models/user.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload Profile Picture
export const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(file.path);
    const mimeType = file.mimetype;
    const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: base64Image },
      { new: true, select: '-password' }
    );

    fs.unlinkSync(file.path); // Clean up temp file

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ profilePic: user.profilePic });
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password for security
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
