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
