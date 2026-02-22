// models/Application.js
const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    candidateName: String,
    email: String,
    resumePath: String,  // File path
    mcqScores: Number,
    status: { type: String, enum: ['applied', 'knocked_out', 'shortlisted'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', ApplicationSchema);