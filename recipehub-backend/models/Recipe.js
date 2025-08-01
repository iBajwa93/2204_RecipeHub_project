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
    prepTime: { type: String }, // you can use Number if you want minutes as a number
    description: { type: String },
    ingredients: { type: String }, // or [String] if you want an array
    category: { type: String },
    videoUrl: { type: String }, // store video file URL or path after upload
    thumbnailUrl: {type: String},
    averageRating: { type: Number, default: 0 },
    views: { type: Number },
    reviews: [reviewSchema],
    creatorID: { type: String },
    creatorUsername: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This enables .populate() later
      required: true,
    },
    reviews: [reviewSchema],
    averageRating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
