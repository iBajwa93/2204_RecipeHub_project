// Inside recipehub-backend/models/Recipe.js
const mongoose = require("mongoose");

const Recipe = require("../models/Recipe"); // double check import

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  instructions: [String],
  // New field:
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
