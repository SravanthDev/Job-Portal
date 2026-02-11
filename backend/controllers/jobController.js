import prisma from '../config/database.js';
import { validateRequired } from '../utils/validation.js';


export const createJob = async (req, res, next) => {
    try {
        const { title, description, skills, location } = req.body;

        const missing = validateRequired(['title', 'description', 'skills', 'location'], req.body);
        if (missing.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                skills,
                location,
                postedById: req.user.id
            },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            message: 'Job posted successfully',
            job
        });
    } catch (error) {
        next(error);
    }
};


export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ jobs });
    } catch (error) {
        next(error);
    }
};


export const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if the current user has already applied (only if authenticated)
        let hasApplied = false;
        if (req.user) {
            const existingApplication = await prisma.application.findUnique({
                where: {
                    jobId_userId: {
                        jobId: parseInt(id),
                        userId: req.user.id
                    }
                }
            });
            hasApplied = !!existingApplication;
        }

        res.json({ job, hasApplied });
    } catch (error) {
        next(error);
    }
};


export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, skills, location } = req.body;

        const existingJob = await prisma.job.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingJob) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (existingJob.postedById !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own jobs' });
        }

        const job = await prisma.job.update({
            where: { id: parseInt(id) },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(skills && { skills }),
                ...(location && { location })
            },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            message: 'Job updated successfully',
            job
        });
    } catch (error) {
        next(error);
    }
};


export const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingJob = await prisma.job.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingJob) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (existingJob.postedById !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own jobs' });
        }

        await prisma.job.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};
