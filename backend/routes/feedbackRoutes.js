const express = require('express');
const { giveFeedback, getFeedbackForUser } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, giveFeedback); // Give feedback
router.get('/:userId', protect, getFeedbackForUser); // View feedback for a user

module.exports = router;
