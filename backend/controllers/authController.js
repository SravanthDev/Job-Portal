const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return res.status(400).json({ error: 'Email already used' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login };
