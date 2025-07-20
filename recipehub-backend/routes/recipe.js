const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // this folder must exist
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// Create a recipe (protected)
router.post("/", upload.single('video'), recipeController.createRecipe);

// Get all recipes (public)
router.get("/", recipeController.getRecipes);

// Get all recipes by user

router.get("/user/:userId", recipeController.getRecipesByUser);

// Get one recipe by ID (public)
router.get("/:id", recipeController.getRecipeById);

// Delete one recipe by id
router.delete('/:id', recipeController.deleteRecipe);


module.exports = router;
