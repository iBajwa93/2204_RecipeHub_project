const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // simple disk storage

// Create a recipe (protected)
router.post("/", upload.single('video'), recipeController.createRecipe);

// Get all recipes (public)
router.get("/", recipeController.getRecipes);

// Get one recipe by ID (public)
router.get("/:id", recipeController.getRecipeById);

module.exports = router;
