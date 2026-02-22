const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // Serve HTML/CSS/JS
app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dmless');

// Job routes
app.post('/api/jobs', async (req, res) => {
    const { role, jd, mcqs } = req.body;
    const linkId = uuidv4().slice(0, 8);
    const job = new Job({ role, jd, mcqs, linkId, recruiterId: 'demo' });
    await job.save();
    res.json({ link: `http://localhost:3000/apply.html?job=${linkId}` });
});

app.get('/api/jobs/:linkId', async (req, res) => {
    const job = await Job.findOne({ linkId: req.params.linkId });
    res.json(job);
});

app.get('/api/dashboard/stats', async (req, res) => {
    const total = await Application.countDocuments();
    const knocked = await Application.countDocuments({ status: 'knocked_out' });
    const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
    res.json({ total, knocked, shortlisted });
});

app.get('/api/applications', async (req, res) => {
    const apps = await Application.find().populate('jobId', 'role');
    res.json(apps);
});

// Apply logic
app.post('/api/apply/:linkId/knockout', async (req, res) => {
    const { score, isCorrect } = req.body;
    if (!isCorrect) {
        const app = new Application({ jobId: req.params.linkId, mcqScores: score, status: 'knocked_out' });
        await app.save();
        return res.json({ knockedOut: true });
    }
    res.json({ continue: true });
});

app.post('/api/apply/:linkId/submit', upload.single('resume'), async (req, res) => {
    const { name, email, mcqScores } = req.body;
    const app = new Application({
        jobId: req.params.linkId,
        candidateName: name,
        email,
        resumePath: req.file ? `/uploads/${req.file.filename}` : null,
        mcqScores,
        status: 'shortlisted'
    });
    await app.save();
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server on 3000'));






