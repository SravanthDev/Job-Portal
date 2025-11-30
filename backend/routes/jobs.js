const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById } = require('../controllers/jobController');

// GET /api/jobs - Get all jobs with optional filters
router.get('/', getAllJobs);

// GET /api/jobs/:id - Get single job by ID
router.get('/:id', getJobById);

module.exports = router;
