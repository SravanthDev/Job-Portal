import prisma from '../config/database.js';
import fs from 'fs';
import path from 'path';


export const getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                resumeUrl: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};


export const uploadResume = async (req, res, next) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl || !resumeUrl.trim()) {
            return res.status(400).json({ error: 'Resume URL is required' });
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { resumeUrl },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                resumeUrl: true,
                createdAt: true
            }
        });

        res.json({
            message: 'Resume uploaded successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};


export const uploadResumeFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate full URL for the resume file
        const protocol = req.protocol; // http or https
        const host = req.get('host'); // backend domain
        const resumeUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { resumeUrl },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                resumeUrl: true,
                createdAt: true
            }
        });

        res.json({
            message: 'Resume file uploaded successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};
