import Ticket from "../models/ticket.js";
import User from "../models/user.js";





export const getSuperAdminStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: /admin/i });
    const totalIT = await User.countDocuments({ role: "it" });
    const totalStaff = await User.countDocuments({ role: "staff" });
    const totalSuperAdmins = await User.countDocuments({ role: "superAdmin" });

    const activeAdmins = await User.countDocuments({ role: "admin", status: "Active" });
    const suspendedAdmins = await User.countDocuments({ role: "admin", status: "Suspended" });

    const departments = await User.distinct("department");
    const totalDepartments = departments.filter(Boolean).length;

    res.json({
      success: true,
      data: {
        totalTickets,
        totalUsers,
        totalAdmins,
        activeAdmins,
        suspendedAdmins,
        totalIT,
        totalStaff,
        totalSuperAdmins,
        totalDepartments,
      },
    });
  } catch (error) {
    console.error("Super admin stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


