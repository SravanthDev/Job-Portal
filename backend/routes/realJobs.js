const express = require('express');
const router = express.Router();
const { getRealJobs, getCompanyProfile } = require('../controllers/realJobsController');

// GET /api/realjobs - Get real jobs from JSearch API
router.get('/', getRealJobs);

// GET /api/company/:name - Get company profile and jobs
router.get('/company/:name', getCompanyProfile);

module.exports = router;
