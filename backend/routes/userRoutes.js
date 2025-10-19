const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes
router.get("/profile", protect, getUserProfile);  // Fetch user details
router.put("/profile", protect, updateUserProfile); // Update user details

router.get("/me", protect, (req, res) => {
  res.json(req.user); 
});

module.exports = router;
