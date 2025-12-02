import express from 'express';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);

router.get('/:id', getJobById);

router.post('/', authenticate, authorize('RECRUITER'), createJob);

router.put('/:id', authenticate, authorize('RECRUITER'), updateJob);

router.delete('/:id', authenticate, authorize('RECRUITER'), deleteJob);

export default router;
