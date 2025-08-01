// routes/admin.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const { authorizeAdmin } = require("../middleware/authorizeAdmin"); // You can create this if needed

// ✅ Ban user
router.put(
  "/user/:id/ban",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { isBanned: true });
      res.json({ message: "User banned successfully" });
    } catch (err) {
      res.status(500).json({ error: "Ban failed" });
    }
  }
);

// ✅ Unban user
router.put(
  "/user/:id/unban",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { isBanned: false });
      res.json({ message: "User unbanned successfully" });
    } catch (err) {
      res.status(500).json({ error: "Unban failed" });
    }
  }
);

// ✅ Admin site statistics
router.get("/stats", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const proChefs = await User.countDocuments({ isProChef: true });
    const amateurChefs = await User.countDocuments({ isProChef: false });

    // Optional: Replace with real metrics later
    const dailyVisits = 324;
    const monthlyVisits = 5343;

    res.json({
      totalUsers,
      proChefs,
      amateurChefs,
      dailyVisits,
      monthlyVisits,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
