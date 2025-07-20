console.log("✅ recipes.js router loaded");

// routes/recipes.js
const express = require("express");
const router = express.Router();
const { addOrUpdateReview } = require("../controllers/recipeController");
const { authenticateToken } = require("../middleware/auth");

router.get("/test", (req, res) => {
  res.json({ message: "✅ Recipes route is working!" });
});

router.post("/:id/review", authenticateToken, addOrUpdateReview);

module.exports = router;
