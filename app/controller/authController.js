const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const asyncHandler = require('../middleware/catchAsync');

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.error(400, 'Name, email and password are required');
  }

  // role body থেকে নেওয়া হচ্ছে না, security এর জন্য default 'user' থাকবে
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id, user.role);

  res.success(201, 'Registration successful', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.error(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password',
  );

  if (!user || !(await user.comparePassword(password))) {
    return res.error(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  res.success(200, 'Login successful', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

// GET /api/auth/me  (protected)
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.error(404, 'User not found');

  res.success(200, 'Profile fetched', user);
});
