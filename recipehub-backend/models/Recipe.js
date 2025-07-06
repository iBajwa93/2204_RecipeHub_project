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
    views: {type: Number},
    reviews: {type: Array},
    creatorID: {type: String},
    creatorUsername: {type: String},
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This enables .populate() later
      required: true
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
