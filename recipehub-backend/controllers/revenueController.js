const Revenue = require("../models/Revenue");
const User = require("../models/User");

// Ensure a revenue entry exists for this month if user is Pro Chef
exports.ensureRevenueEntry = async (userId) => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let revenue = await Revenue.findOne({ user: userId, month: monthKey });

  if (!revenue) {
    revenue = await Revenue.create({
      user: userId,
      monthlyIncome: 0,
      totalIncome: 0,
      month: monthKey,
    });
  }

  return revenue;
};

// GET /api/revenue/:userId
exports.getRevenue = async (req, res) => {
  try {
    const userId = req.params.userId;
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const currentMonthRevenue = await Revenue.findOne({ user: userId, month: monthKey });
    const totalRevenue = await Revenue.find({ user: userId });

    res.json({
      currentMonthRevenue: currentMonthRevenue?.monthlyIncome || 0,
      totalRevenue: totalRevenue.length
        ? totalRevenue[totalRevenue.length - 1].totalIncome
        : 0,
    });
  } catch (err) {
    console.error("Get revenue error:", err);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
};

// PATCH /api/revenue/add/:userId  (for testing income)
exports.addRevenue = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.params.userId;

    const revenue = await exports.ensureRevenueEntry(userId);

    revenue.monthlyIncome += amount;
    revenue.totalIncome += amount;
    await revenue.save();

    res.json({ message: "Revenue updated", revenue });
  } catch (err) {
    console.error("Add revenue error:", err);
    res.status(500).json({ message: "Failed to update revenue" });
  }
};
