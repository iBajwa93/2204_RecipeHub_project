const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updatePassword = async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.incrementDailyVisits = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.dailyVisits = (user.dailyVisits || 0) + 1;
    await user.save();

    res.json({ message: "Daily visits incremented", dailyVisits: user.dailyVisits });
  } catch (error) {
    console.error("Error incrementing daily visits:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// PATCH /api/users/:id/avgRating
exports.updateAvgRating = async (req, res) => {
  try {
    const { avgRating } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avgRating },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update avgRating" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};