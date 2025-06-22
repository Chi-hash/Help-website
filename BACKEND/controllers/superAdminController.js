import Ticket from "../models/ticket.js";
import User from "../models/user.js";





export const getSuperAdminStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const resolvedTickets = await Ticket.countDocuments({ status: "Resolved" });
    const closedTickets = await Ticket.countDocuments({ status: "Closed" });
    const inProgressTickets = await Ticket.countDocuments({ status: "InProgress" });
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: /admin/i });
    const totalIT = await User.countDocuments({ role: "it" });
    const totalStaff = await User.countDocuments({ role: "staff" });
    const totalSuperAdmins = await User.countDocuments({ role: "superAdmin" });
    const suspendedUsers = await User.countDocuments({ role: "staff", status: "Suspended" });
    const activeUsers = await User.countDocuments({ role: "staff", status: "Active" });
    const activeAdmins = await User.countDocuments({ role: "admin", status: "Active" });
    const suspendedAdmins = await User.countDocuments({ role: "admin", status: "Suspended" });


    const departments = await User.distinct("department");
    const totalDepartments = departments.filter(Boolean).length;

    res.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        resolvedTickets,
        closedTickets,
        inProgressTickets,
        totalUsers,
        totalAdmins,
        activeAdmins,
        suspendedAdmins,
        suspendedUsers,
        activeUsers,
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


