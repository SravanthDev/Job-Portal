const prisma = require('../config/prisma');

const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, location } = req.body;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        skillsRequired: skillsRequired || '',
        location: location || '',
        recruiterId: req.user.id
      },
      include: {
        recruiter: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { search, location, skills } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    if (skills) {
      where.skillsRequired = { contains: skills };
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        recruiter: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        recruiter: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skillsRequired, location } = req.body;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can update jobs' });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own jobs' });
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        title: title || job.title,
        description: description || job.description,
        skillsRequired: skillsRequired !== undefined ? skillsRequired : job.skillsRequired,
        location: location !== undefined ? location : job.location
      },
      include: {
        recruiter: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can delete jobs' });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    await prisma.job.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can access this endpoint' });
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {createJob, getAllJobs, getJobById, updateJob, deleteJob, getRecruiterJobs};
