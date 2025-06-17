import express from "express";
import User from "../models/user.js";  // <-- your user model

const router = express.Router();

// GET all admins (users with role 'admin')
router.get("/", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json({ success: true, data: admins });
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create new admin (a user with role 'admin')
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, role = "admin", department } = req.body;
    if (!firstname || !lastname || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const newAdmin = new User({ firstname, lastname, email, role, department });
    await newAdmin.save();

    res.status(201).json({ success: true, data: newAdmin });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update admin
router.put("/:id", async (req, res) => {
  try {
    const updatedAdmin = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, data: updatedAdmin });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE admin
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await User.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH toggle admin status 
router.patch("/:id/status", async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Toggle status
    admin.status = admin.status === "Active" ? "Suspended" : "Active";
    await admin.save();

    res.json({ success: true, message: `Admin status changed to ${admin.status}`, data: admin });
  } catch (err) {
    console.error("Error toggling admin status:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
