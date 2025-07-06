const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a recipe (protected)
router.post("/", authMiddleware, recipeController.createRecipe);

// Get all recipes (public)
router.get("/", recipeController.getRecipes);

// Get one recipe by ID (public)
router.get("/:id", recipeController.getRecipeById);

module.exports = router;
