const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    monthlyIncome: {
      type: Number,
      default: 0, // in dollars or cents
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    month: {
      type: String,
      default: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        // Example: 2025-08
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Revenue", revenueSchema);
