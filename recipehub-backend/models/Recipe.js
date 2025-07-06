// models/Recipe.js

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    prepTime: { type: String }, // you can use Number if you want minutes as a number
    description: { type: String },
    ingredients: { type: String }, // or [String] if you want an array
    category: { type: String },
    videoUrl: { type: String }, // store video file URL or path after upload
    averageRating: {type: Number},
    reviews: {type: Array},
    // Reference to the user who created this recipe
    creator: {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
