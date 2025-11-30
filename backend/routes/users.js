const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../utils/upload');
const { getProfile, updateProfile, uploadResume } = require('../controllers/userController');
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/upload-resume', auth, upload.single('resume'), uploadResume);
module.exports = router