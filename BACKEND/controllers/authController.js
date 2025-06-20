import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Notification from "../models/notification.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendEmail } from "../mailer.js";
import { createNotification } from "../notify.js";



// === REGISTER (SIGNUP) ===
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, department } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'This user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      department,
      emailToken,
      emailTokenExpires: tokenExpiry,
      isVerified: false,
    });

    await newUser.save();
    await createNotification({
      message: `New user ${firstname} ${lastname} signed up.`,
      type: "registration",
      createdBy: newUser._id,
      roleVisibleTo: ["superAdmin"],
    });


    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}&email=${newUser.email}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Help Desk" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: "Verify Your Email",
      html: `
        <p>Hi ${firstname},</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `,
    });



    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// === EMAIL VERIFICATION ===


export const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  console.log("Raw query params:", req.query);
  console.log("Token length:", token?.length);
  console.log("Email format:", email);


  try {
    console.log(" Incoming verification request:", { email, token });

    const user = await User.findOne({ email, emailToken: token });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: "Invalid verification link." });
    }


    if (user.isVerified) {
      console.log('User already verified:', email);
      return res.status(200).json({ message: "Email already verified. Please log in." });
    }

    if (!user.emailToken || user.emailToken !== token || user.emailTokenExpires < Date.now()) {
      console.log('Invalid or expired token for user:', { email, token, expires: user.emailTokenExpires });
      return res.status(400).json({ message: "Invalid or expired verification link." });
    }

    user.isVerified = true;
    user.emailToken = null;
    user.emailTokenExpires = null;
    await user.save();

    console.log("✅ User verified:", user.email);
    res.status(200).json({ message: "Email successfully verified. You can now log in." });
  } catch (error) {
    console.error("❌ Error during email verification:", error.message);
    res.status(500).json({ message: "Something went wrong during verification." });
  }
};

// === LOGIN ===
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

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }



    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Notify login (optional)
    await Notification.create({
      message: `${user.firstname} just logged in.`,
      type: "login",
      createdBy: user._id,
      roleVisibleTo: ["superAdmin"],
    });

    res.status(200).json({
      token,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      department: user.department,
      email: user.email,
      profilePic: user.profilePic || null,
      isVerified: user.isVerified,
      user: {
        id: user._id,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        department: user.department,
        profilePic: user.profilePic || null,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.emailToken = crypto.randomBytes(32).toString("hex");
    user.emailTokenExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${user.emailToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. Link expires in 1 hour.</p>`,
    });

    res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending email" });
  }
};
