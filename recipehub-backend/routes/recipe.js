const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticateToken } = require("../middleware/auth");

// Import controller functions directly
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  addOrUpdateReview,
  deleteReview,
  getRecipesByUser,
} = require("../controllers/recipeController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// POST a review/comment
router.post("/:id/review", authenticateToken, addOrUpdateReview);

// DELETE a review
router.delete("/:id/review", authenticateToken, deleteReview);

// Create a recipe (protected)
router.post("/", upload.single("video"), authenticateToken, createRecipe);

// Get all recipes (public)
router.get("/", getRecipes);

// Get recipes by user
router.get("/user/:userId", getRecipesByUser);

// Get a single recipe by ID
router.get("/:id", getRecipeById);

module.exports = router;
/*
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
*/