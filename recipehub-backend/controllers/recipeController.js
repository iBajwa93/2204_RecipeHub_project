const Recipe = require("../models/Recipe");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const fs = require('fs');


// Delete a recipe
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


// Get a recipe from user
exports.getRecipesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const recipes = await Recipe.find({ creatorID: userId }).sort({ avgRating: -1});
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching user's recipes: ", err);
    res.status(500).json({ message: "Server error"});
  }
}

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createRecipe = async (req, res) => {
  const {
    title,
    prepTime,
    description,
    ingredients,
    category,
    creatorID,
    creatorUsername,
    creator
  } = req.body;

  const videoFile = req.file;
  if (!videoFile) {
    return res.status(400).json({ message: "Video file is missing." });
  }

  const videoPath = `/uploads/${videoFile.filename}`;
  const fullVideoPath = path.join(__dirname, '..', videoPath);

  // Prepare thumbnail file paths
  const thumbnailFilename = `${path.parse(videoFile.filename).name}.jpg`;
  const thumbnailDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
  const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
  const thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;

  try {
    // Ensure thumbnail directory exists
    fs.mkdirSync(thumbnailDir, { recursive: true });

    // Generate thumbnail using ffmpeg
    ffmpeg(fullVideoPath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: thumbnailFilename,
        folder: thumbnailDir,
        size: '320x240'
      })
      .on('end', async () => {
        // Save recipe to DB after thumbnail is created
        const newRecipe = new Recipe({
          title,
          prepTime,
          description,
          ingredients,
          category,
          videoUrl: videoPath,
          thumbnailUrl: thumbnailUrl,
          creatorID,
          creatorUsername,
          creator
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ message: 'Error generating thumbnail' });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating recipe", error });
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
    const recipe = await Recipe.findById(recipeId).populate("creator", "fullName username");
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
