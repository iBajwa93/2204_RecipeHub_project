const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { authenticateToken } = require("../middleware/auth");

const {
  addOrUpdateReview,
  deleteReview,
  getRecipeById,
  createRecipe,
  getRecipes,
} = require("../controllers/recipeController");

// ✅ Protected routes (require token)
router.post("/:id/review", authenticateToken, addOrUpdateReview);
router.delete("/:id/review/:reviewId", authenticateToken, deleteReview);
router.post("/", upload.single("video"), authenticateToken, createRecipe);

// 🌐 Public routes
router.get("/", getRecipes);
router.get("/:id", getRecipeById);

module.exports = router;
