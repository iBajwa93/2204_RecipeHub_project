const Recipe = require("../models/Recipe");
const mongoose = require("mongoose"); //

// POST /api/recipes/:id/review
const addOrUpdateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  console.log("✅ POST hit for recipe ID:", id);

  try {
    const recipe = await Recipe.findById(new mongoose.Types.ObjectId(id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existingReview = recipe.reviews.find(
      (review) => review.user.toString() === userId
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      // Add new review
      recipe.reviews.push({ user: userId, rating, comment });
    }

    // Recalculate average
    recipe.averageRating =
      recipe.reviews.reduce((acc, r) => acc + r.rating, 0) /
      recipe.reviews.length;

    await recipe.save();
    res.status(200).json({ message: "Review submitted", recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addOrUpdateReview };
