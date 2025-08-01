const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Recipe = require("../models/Recipe");
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

// Delete a recipe
router.delete("/:id", authenticateToken, require("../controllers/recipeController").deleteRecipe);


// Get recipes by user
router.get("/user/:userId", getRecipesByUser);

// Get a single recipe by ID
router.get("/:id", getRecipeById);

router.patch("/:id/view", async (req, res) => {
  console.log("Increment view request for ID:", req.params.id);
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    console.error("Failed to increment views:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
