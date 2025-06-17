import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => createSuperAdmin())
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });

async function createSuperAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: "medline.nkenchor@gmail.com" });

    if (existingAdmin) {
      console.log("⚠️ Super Admin already exists");
    } else {
      const hashedPassword = await bcrypt.hash("SuperSecurePassword123!", 10);

      const superAdmin = new User({
        firstname: "Medline",
        lastname: "Nkenchor",
        email: "medline.nkenchor@gmail.com",
        password: hashedPassword,
        role: "superAdmin",
        department: "IT",
      });

      await superAdmin.save();
      console.log("✅ Super Admin created successfully");
    }
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error.message);
  } finally {
    mongoose.disconnect();
  }
}
