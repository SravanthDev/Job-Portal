const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all jobs with optional filters
const getAllJobs = async (req, res) => {
    try {
        const { keyword, location, skillsRequired, company } = req.query;

        // Build filter conditions
        const where = {};

        if (keyword) {
            where.OR = [
                { title: { contains: keyword } },
                { description: { contains: keyword } }
            ];
        }

        if (location) {
            where.location = { contains: location };
        }

        if (skillsRequired) {
            where.skillsRequired = { contains: skillsRequired };
        }

        // Filter by company name (searches in recruiter's name)
        const include = {
            recruiter: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        };

        const jobs = await prisma.job.findMany({
            where,
            include,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Filter by company name if provided (client-side filter since it's in related table)
        let filteredJobs = jobs;
        if (company) {
            filteredJobs = jobs.filter(job =>
                job.recruiter?.name?.toLowerCase().includes(company.toLowerCase())
            );
        }

        res.json(filteredJobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

// Get single job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
            include: {
                recruiter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Failed to fetch job details' });
    }
};

module.exports = {
    getAllJobs,
    getJobById
};
