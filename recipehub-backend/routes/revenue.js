const revenueController = require("../controllers/revenueController");
const express = require("express");
const router = express.Router();

router.get("/:userId", revenueController.getRevenue);
router.patch("/add/:userId", revenueController.addRevenue);

module.exports = router;