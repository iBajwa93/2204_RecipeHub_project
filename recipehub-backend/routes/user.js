const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { updateAvgRating } = require("../controllers/userController");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { authenticateToken } = require("../middleware/auth");
const User = require("../models/User"); // ✅ Add this missing line

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.patch("/:id/increment-visit", userController.incrementDailyVisits);

// PATCH update avg rating
router.patch("/:id/avgRating", updateAvgRating);

// PATCH /api/users/:id → update password
router.patch("/:id", userController.updatePassword);

router.get("/", userController.getAllUsers);

// Get own profile info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// Follow a user
router.post("/:id/follow", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;  // logged-in user
    const targetId = req.params.id; // user to follow/unfollow

    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter((id) => id.toString() !== targetId);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);
    } else {
      // Follow
      user.following.push(targetId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: user.following.length,
    });
  } catch (err) {
    console.error("Follow/unfollow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get the current user's following list
router.get("/me/following", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("following");
    res.json({ following: user.following });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/users/:id → get user info by id (no auth needed or add auth if you want)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch user by ID failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Update own profile
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const updates = {
      email: req.body.email,
      username: req.body.username,
    };

    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updates.password = hashedPassword;
    }

    await User.findByIdAndUpdate(req.user.id, updates);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// POST /api/user/upload-avatar
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const filePath = `/uploads/${req.file.filename}`;
      await User.findByIdAndUpdate(req.user.id, { profileImage: filePath });
      res.json({ imageUrl: filePath });
    } catch (err) {
      console.error("Upload failed", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

module.exports = router;
