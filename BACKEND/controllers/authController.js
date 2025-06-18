import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, department } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'This user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      department
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    res.status(200).json({
      token,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      department: user.department,
      email: user.email,
      profilePic: user.profilePic || null,
      user: {
        id: user._id,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        department: user.department,
        profilePic: user.profilePic || null
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};