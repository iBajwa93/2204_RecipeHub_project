const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.deleteReview = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "reviews.user",
    "username fullName"
  );
  if (!recipe) throw new Error("Recipe not found");

  const userId = req.user._id;
  const reviewIndex = recipe.reviews.findIndex(
    (r) => r.user.toString() === userId.toString()
  );

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  recipe.reviews.splice(reviewIndex, 1);
  await recipe.save();
  await recipe.populate("reviews.user", "username fullName");

  res.json({ message: "Review deleted", reviews: recipe.reviews });
});

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const {
    title,
    prepTime,
    description,
    ingredients,
    category,
    videoUrl,
    creatorID,
    creatorUsername,
    creator,
  } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      prepTime,
      description,
      ingredients,
      category,
      videoUrl,
      creatorUsername,
      creatorID,
      creator,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating recipe", error });
  }
};

exports.getRecipesByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const recipes = await Recipe.find({ creatorID: userId }).populate(
      "creator",
      "username fullName"
    );
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's recipes" });
  }
};

// Get all recipes (optionally populate creator)
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("creator", "fullName username") // populate creator with name and username only
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  }
};

// Get one recipe by ID
exports.getRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipe = await Recipe.findById(recipeId)
      .populate("creator", "fullName username")
      .populate("reviews.user", "username fullName");

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error });
  }
};

// POST /api/recipes/:id/review
exports.addOrUpdateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  if (!userId) {
    console.error("❌ No user ID in token.");
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  console.log("✅ POST hit for recipe ID:", id);

  try {
    const recipe = await Recipe.findById(new mongoose.Types.ObjectId(id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existingReview = recipe.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      recipe.reviews.push({ user: userId, rating, comment });
    }

    recipe.averageRating =
      recipe.reviews.reduce((acc, r) => acc + r.rating, 0) /
      recipe.reviews.length;

    await recipe.save();
    await recipe.populate("reviews.user", "username fullName");

    console.log("✅ Updated reviews list:", recipe.reviews);

    res
      .status(200)
      .json({ message: "Review submitted", reviews: recipe.reviews });
  } catch (err) {
    console.error("🔥 Error in addOrUpdateReview:", err);
    res.status(500).json({ message: "Server error" });
  }
};
