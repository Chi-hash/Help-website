import express from "express";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticket.js";
import upload from "./middlewares/uploads.js";
import superAdminRoutes from "./routes/superAdmin.js";
import adminsRouter from "./routes/admin.js";
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/message.js";
import notificationRoutes from "./routes/notification.js";
import { verifyTransporter } from "./mailer.js";

import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('🔍 Server Environment Variables Debug:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('CLIENT_URL:', process.env.CLIENT_URL || 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET (using default 3000)');

// Verify email transporter after environment variables are loaded
const initializeEmailSystem = async () => {
  try {
    console.log('🔧 Initializing email system...');
    await verifyTransporter();
    console.log('✅ Email system initialized successfully');
  } catch (error) {
    console.error('❌ Email system initialization failed:', error.message);
  }
};

connectDB();

const app = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.get("/", (req, res) => {
    res.send("Hello ,server is running");
});

// Test endpoint to verify user routes
app.get("/api/users/test", (req, res) => {
    res.json({ message: "User routes are accessible!" });
});

// Test endpoint to verify superadmin routes
app.get("/api/superadmin/test", (req, res) => {
    res.json({ message: "Superadmin routes are accessible!" });
});

// Add a debug endpoint to check environment variables
app.get("/debug-env", (req, res) => {
    res.json({
        emailUser: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
        emailPass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
        clientUrl: process.env.CLIENT_URL || 'NOT SET',
        port: process.env.PORT || 'NOT SET'
    });
});

app.use("/api/auth", authRoutes); //auth routes
app.use("/api/tickets", ticketRoutes); //ticket routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admins", adminsRouter);
app.use('/api/users', userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, async () => {
    console.log(`server is running on port ${port}`);
    
    // Initialize email system after server starts
    await initializeEmailSystem();
});
