import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getProfile, uploadResume, uploadResumeFile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOC files are allowed'));
        }
    }
});

router.use(authenticate);

router.get('/me', getProfile);

router.post('/upload-resume', uploadResume);

router.post('/upload-resume-file', upload.single('resume'), uploadResumeFile);

export default router;
