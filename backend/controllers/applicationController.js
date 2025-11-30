import prisma from '../config/database.js';
import { validateApplicationStatus } from '../utils/validation.js';


export const applyForJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const job = await prisma.job.findUnique({
            where: { id: parseInt(jobId) }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const existingApplication = await prisma.application.findUnique({
            where: {
                jobId_userId: {
                    jobId: parseInt(jobId),
                    userId: req.user.id
                }
            }
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        const application = await prisma.application.create({
            data: {
                jobId: parseInt(jobId),
                userId: req.user.id
            },
            include: {
                job: {
                    include: {
                        postedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        resumeUrl: true
                    }
                }
            }
        });

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        next(error);
    }
};


export const getUserApplications = async (req, res, next) => {
    try {
        const applications = await prisma.application.findMany({
            where: { userId: req.user.id },
            include: {
                job: {
                    include: {
                        postedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const stats = {
            total: applications.length,
            pending: applications.filter(app => app.status === 'PENDING').length,
            shortlisted: applications.filter(app => app.status === 'SHORTLISTED').length,
            rejected: applications.filter(app => app.status === 'REJECTED').length
        };

        res.json({ applications, stats });
    } catch (error) {
        next(error);
    }
};


export const getJobApplications = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { status } = req.query; 

        const job = await prisma.job.findUnique({
            where: { id: parseInt(jobId) }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.postedById !== req.user.id) {
            return res.status(403).json({ error: 'You can only view applicants for your own jobs' });
        }

        const where = {
            jobId: parseInt(jobId)
        };

        if (status && validateApplicationStatus(status)) {
            where.status = status;
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        resumeUrl: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ applications });
    } catch (error) {
        next(error);
    }
};


export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!status || !validateApplicationStatus(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be PENDING, SHORTLISTED, or REJECTED'
            });
        }

        const application = await prisma.application.findUnique({
            where: { id: parseInt(applicationId) },
            include: { job: true }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.job.postedById !== req.user.id) {
            return res.status(403).json({
                error: 'You can only update applications for your own jobs'
            });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        resumeUrl: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        location: true
                    }
                }
            }
        });

        res.json({
            message: 'Application status updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        next(error);
    }
};
