const prisma = require('../config/prisma');

// Apply to a job 
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can apply to jobs' });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        jobId: parseInt(jobId)
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        jobId: parseInt(jobId)
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all applications for logged-in user (Job Seeker)
const getUserApplications = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can access this endpoint' });
    }

    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        job: {
          include: {
            recruiter: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all applications for a specific job (Recruiter only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can view job applications' });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ error: 'You can only view applications for your own jobs' });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: {
        user: {
          select: { id: true, name: true, email: true, resumeUrl: true }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update application status (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can update application status' });
    }

    if (!['Pending', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Shortlisted, or Rejected' });
    }

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update applications for your own jobs' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        job: true
      }
    });

    res.json(updatedApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  applyToJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus
};
