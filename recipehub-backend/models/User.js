// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isProChef: { type: Boolean, default: false }, // future feature
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    followers: {type: Number, required: true},
    dailyVisits: {type: Number, required: true},
    recipes: {type: Array, required: true}

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
