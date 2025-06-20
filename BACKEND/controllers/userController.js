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

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      fs.unlinkSync(file.path); // Clean up temp file
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      fs.unlinkSync(file.path); // Clean up temp file
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }

    const fileBuffer = fs.readFileSync(file.path);
    const mimeType = file.mimetype;
    const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: base64Image },
      { new: true, select: '-password' }
    );

    // Clean up temp file
    fs.unlinkSync(file.path);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true,
      profilePic: user.profilePic,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while uploading profile picture',
      error: error.message 
    });
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
