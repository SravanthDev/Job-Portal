import express from 'express';
import {
    applyForJob,
    getUserApplications,
    getJobApplications,
    updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/:jobId', authorize('JOB_SEEKER'), applyForJob);

router.get('/user', authorize('JOB_SEEKER'), getUserApplications);

router.get('/job/:jobId', authorize('RECRUITER'), getJobApplications);

router.put('/:applicationId/status', authorize('RECRUITER'), updateApplicationStatus);

export default router;
