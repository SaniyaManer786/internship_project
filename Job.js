const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    role: String,
    jd: String,
    mcqs: [{ q: String, options: [String], correct: Number }],  // 5 MCQs
    linkId: { type: String, unique: true },  // Short UUID for sharing
    recruiterId: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Job', JobSchema);