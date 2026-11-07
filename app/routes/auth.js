const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email ar password dite hobe' });
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Email valid na' });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: 'Password minimum 6 character hote hobe' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(409)
        .json({ message: 'Ei email diye already account ache' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email ar password dite hobe' });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email ba password vul' });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ user: { id: _id, name, email } });
});

module.exports = router;
