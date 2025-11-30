const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, getRecruiterJobs } = require('../controllers/jobController');
router.get('/recruiter/my-jobs', auth, getRecruiterJobs);
router.post('/', auth, createJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
module.exports = router