const Feedback = require('../models/Feedback');

// Give feedback
const giveFeedback = async (req, res) => {
    try {
        const { toUserId, projectId, rating, comment } = req.body;

        const feedback = await Feedback.create({
            fromUserId: req.user._id,
            toUserId,
            projectId,
            rating,
            comment
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get feedback for a user
const getFeedbackForUser = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ toUserId: req.params.userId })
            .populate('fromUserId', 'name email')
            .populate('projectId', 'title');

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { giveFeedback, getFeedbackForUser };
