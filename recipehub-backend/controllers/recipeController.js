const Recipe = require("../models/Recipe");

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { title, prepTime, description, ingredients, category, videoUrl, creatorID, creatorUsername, creator } = req.body;

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
      creator
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
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
