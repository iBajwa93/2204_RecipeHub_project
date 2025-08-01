// routes/admin.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken, protect } = require("../middleware/auth");

const { approveApplication, rejectApplication } = require('../controllers/proChefController');

router.put('/prochef-applications/:id/approve', protect, approveApplication);
router.put('/prochef-applications/:id/reject', protect, rejectApplication);

// ✅ Ban user
router.put(
  "/user/:id/ban",
  authenticateToken,
  
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
router.get("/stats", authenticateToken,async (req, res) => {
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
