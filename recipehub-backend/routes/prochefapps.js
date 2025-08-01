const express = require("express");
const router = express.Router();
const {
  applyForProChef,
  getAllApplications,
  approveApplication,
  rejectApplication,
} = require("../controllers/proChefController");
const { authenticateToken, protect } = require("../middleware/auth");

router.post("/apply", authenticateToken, applyForProChef);

router.get("/", getAllApplications);

// Admin approves an application
router.put("/:id/approve", authenticateToken,approveApplication);

// Admin rejects an application
router.put("/:id/reject", authenticateToken, rejectApplication);

module.exports = router;