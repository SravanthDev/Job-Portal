import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateToken } from '../utils/tokenUtils.js';
import { validateEmail, validatePassword, validateRequired, validateRole } from '../utils/validation.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const missing = validateRequired(['name', 'email', 'password', 'role'], req.body);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!validateRole(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be JOB_SEEKER or RECRUITER' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const missing = validateRequired(['email', 'password'], req.body);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // If user doesn't exist, create a new one
      // If role is not provided for new user, we might need to handle it
      // Defaulting to JOB_SEEKER if not specified, but typically we'd ask in UI
      if (!role) {
        return res.status(400).json({
          error: 'Role is required for first-time Google sign-up',
          needsRole: true,
          googleData: { name, email, credential }
        });
      }

      user = await prisma.user.create({
        data: {
          name,
          email,
          role: role,
          // password is optional now
        }
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Google login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};
