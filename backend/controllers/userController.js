const prisma = require('../config/prisma');
const getProfile = async (req, res) => {
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

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        email: email || req.user.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        resumeUrl: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the resume URL
    const resumeUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { resumeUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        resumeUrl: true
      }
    });

    res.json({
      message: 'Resume uploaded successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume
};
