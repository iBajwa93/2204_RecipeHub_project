const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { updateAvgRating } = require("../controllers/userController");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middleware/auth");
const User = require("../models/User");

// Storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/pfps");
    console.log("Saving file to:", uploadPath);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
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

// Follow/unfollow a user
router.post("/:id/follow", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter((id) => id.toString() !== targetId);
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );
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

// GET user by ID
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

//  POST /api/users/upload-avatar
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `/uploads/pfps/${req.file.filename}`;

      // Find user first to get old profileImage
      const user = await User.findById(req.user.id);

      if (user.profileImage) {
        // Get absolute path to old file
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
       
        // Delete old file if exists
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old profile image:", err);
          });
        }
      }

      // Update profileImage in DB with new file path
      user.profileImage = filePath;
      await user.save();

      res.json({ imageUrl: filePath, user });
    } catch (err) {
      console.error("Upload failed", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);


module.exports = router;
