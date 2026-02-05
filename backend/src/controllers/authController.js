import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  getAllUsers,
} from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

const sendToken = (res, user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '3d' },
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUSer = await findUserByEmail(email);
    if (existingUSer) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashed);

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found ' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    sendToken(res, user);

    res.status(200).json({
      message: 'Login successful',
      // token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).json({ message: 'Logged out' });
};

export const currentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userDetails = await findUserByEmail(user.email);

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: userDetails.id,
        username: userDetails.username,
        email: userDetails.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { store_id } = req.params;
    const users = await getAllUsers(store_id);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
