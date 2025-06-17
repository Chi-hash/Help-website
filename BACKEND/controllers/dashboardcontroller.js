import Ticket from "../models/ticket.js";
import User from "../models/user.js";

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
   const [tickets, allAdmins, activeAdmins, suspendedAdmins, users, departments] = await Promise.all([
  Ticket.find(),
  User.find({ role: "admin" }),
  User.find({ role: "admin", status: "Active" }),
  User.find({ role: "admin", status: "Suspended" }),
  User.find({ role: { $in: ["staff", "it"] } }),
  User.distinct("department"),
   User.find({ role: "admin", status: "Active" }),
      User.find({ role: "admin", status: "Suspended" }),
]);


    res.status(200).json({
  totalTickets: tickets.length,
        totalAdmins: admins.length,
        totalUsers: users.length,
        totalDepartments: departments.filter(Boolean).length,
        totalStaff: await User.countDocuments({ role: "staff" }),
        totalIT: await User.countDocuments({ role: "it" }),
        totalSuperAdmins: await User.countDocuments({ role: "superAdmin" }),
        activeAdmins: activeAdmins.length,
        suspendedAdmins: suspendedAdmins.length,
});

  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};
