// routes/auth.js

const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
