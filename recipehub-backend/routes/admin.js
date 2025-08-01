// routes/admin.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// ✅ Ban user
// PUT /api/user/:id/ban
router.put("/user/:id/ban", authenticateToken, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Unban user
router.put("/user/:id/unban", authenticateToken, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id); // ✅ SAFE here
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    await User.findByIdAndUpdate(req.params.id, { isBanned: false });
    res.json({ message: "User unbanned successfully" });
  } catch (err) {
    console.error("Unban error:", err);
    res.status(500).json({ error: "Unban failed" });
  }
});

// ✅ Admin site statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    // continue stats logic
  } catch (err) {
    res.status(500).json({ error: "Stats fetch failed" });
  }
});

module.exports = router;
