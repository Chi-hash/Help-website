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

import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;


//middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Hello ,server is running");
});
app.use("/api/auth", authRoutes); //auth routes

app.use("/api/tickets", ticketRoutes); //ticket routes

app.use("/api/superadmin", superAdminRoutes);

app.use("/api/admins", adminsRouter);

app.use('/api/users', userRoutes);




app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
