const express = require("express");
const router = express.Router();
const { applyForProChef } = require('../controllers/proChefController');
const { authenticateToken, protect } = require("../middleware/auth");

router.post("/apply", protect, applyForProChef);

module.exports = router;