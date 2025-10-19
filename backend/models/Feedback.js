const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
