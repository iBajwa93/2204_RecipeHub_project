// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;
    console.log(req.body);

    // Check all fields
    if (!fullName || !username || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "yesss" });

    // Password match
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Check for existing email/username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or username already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password)
      return res.status(400).json({ message: "Please enter all fields" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isProChef: user.isProChef,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };
