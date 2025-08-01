const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user?._id; // From JWT middleware

    // 1. Find the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 2. Optional: Only allow owner or admin to delete
    if (userId && recipe.creatorID.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not allowed to delete this recipe" });
    }

    // 3. Remove files (video + thumbnail) if they exist
    if (recipe.videoUrl) {
      const videoPath = path.join(__dirname, "..", recipe.videoUrl);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    if (recipe.thumbnailUrl) {
      const thumbPath = path.join(__dirname, "..", recipe.thumbnailUrl);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    // 4. Delete the recipe from DB
    await Recipe.findByIdAndDelete(recipeId);

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting recipe:", err);
    res.status(500).json({ message: "Server error deleting recipe" });
  }
};


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

// Create a new recipe with thumbnail generation
exports.createRecipe = async (req, res) => {
  const {
    title,
    prepTime,
    description,
    ingredients,
    category,
    views,
    creatorID,
    creatorUsername,
    creator,
  } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Save video path
    const videoFile = req.file;
    const videoUrl = `/uploads/${videoFile.filename}`;

    // Ensure thumbnails folder exists
    const thumbnailFolder = path.join(__dirname, "../uploads/thumbnails");
    if (!fs.existsSync(thumbnailFolder)) {
      fs.mkdirSync(thumbnailFolder, { recursive: true });
    }

    // Generate thumbnail filename & path
    const thumbnailFilename = `${Date.now()}-thumbnail.png`;
    const thumbnailFullPath = path.join(thumbnailFolder, thumbnailFilename);

    // Generate a single thumbnail (screenshot) with ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(videoFile.path)
        .on("end", () => {
          console.log("✅ Thumbnail generated:", thumbnailFilename);
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ Thumbnail generation failed:", err);
          reject(err);
        })
        .screenshots({
          count: 1,
          folder: thumbnailFolder,
          filename: thumbnailFilename,
          size: "464x232", // match your Body.js display size
        });
    });

    // Save recipe with video + thumbnail
    const newRecipe = new Recipe({
      title,
      prepTime,
      description,
      ingredients,
      category,
      videoUrl,
      views,
      thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
      creatorUsername,
      creatorID,
      creator,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("🔥 Error creating recipe:", error);
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

    // 1. Apply review changes
    const existingReview = recipe.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      recipe.reviews.push({ user: userId, rating, comment });
    }

    // 2. Update average rating
    recipe.averageRating =
      recipe.reviews.reduce((acc, r) => acc + r.rating, 0) / recipe.reviews.length;

    await recipe.save();
    await recipe.populate("reviews.user", "username fullName");

    // 3. Handle Pro Chef revenue
    const creator = await require("../models/User").findById(recipe.creator);
    if (creator?.isProChef) {
      let commentRevenue = 0.10; // base for comment
      if ((rating || 0) > 3) {
        commentRevenue += 0.05; // bonus for rating > 3
      }

      const Revenue = require("../models/Revenue"); // import model here
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      let revenueDoc = await Revenue.findOne({ user: creator._id, month: monthKey });
      if (!revenueDoc) {
        revenueDoc = new Revenue({ user: creator._id, month: monthKey });
      }

      revenueDoc.monthlyIncome += commentRevenue;
      revenueDoc.totalIncome += commentRevenue;
      await revenueDoc.save();
    }

    res.status(200).json({ message: "Review submitted", reviews: recipe.reviews });

  } catch (err) {
    console.error("🔥 Error in addOrUpdateReview:", err);
    res.status(500).json({ message: "Server error" });
  }
};