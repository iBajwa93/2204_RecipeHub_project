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
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Check if creator is a pro chef
    const creator = await User.findById(recipe.creator);
    if (creator?.isProChef) {
      let revenueToAdd = 0.05; // base for every view
      if ((recipe.averageRating || 0) > 3) {
        revenueToAdd += 0.05; // bonus for high rating
      }

      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      let revenueDoc = await Revenue.findOne({ user: creator._id, month: monthKey });
      if (!revenueDoc) {
        revenueDoc = new Revenue({ user: creator._id, month: monthKey });
      }

      revenueDoc.monthlyIncome += revenueToAdd;
      revenueDoc.totalIncome += revenueToAdd;
      await revenueDoc.save();
    }

    res.json(recipe);
  } catch (err) {
    console.error("Failed to increment views and revenue:", err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
