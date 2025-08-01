// models/Recipe.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    prepTime: { type: String }, 
    description: { type: String },
    ingredients: { type: String }, 
    category: { type: String },
    videoUrl: { type: String }, 
    thumbnailUrl: {type: String},
    averageRating: { type: Number, default: 0 },
    views: { type: Number },
    reviews: [reviewSchema],
    creatorID: { type: String },
    creatorUsername: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    reviews: [reviewSchema],
    averageRating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
