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
