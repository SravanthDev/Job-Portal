const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { applyToJob, getUserApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController');
router.post('/:jobId', auth, applyToJob);
router.get('/my-applications', auth, getUserApplications);
router.get('/job/:jobId', auth, getJobApplications);
router.put('/:id/status', auth, updateApplicationStatus);
module.exports = router