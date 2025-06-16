// routes/auth.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
