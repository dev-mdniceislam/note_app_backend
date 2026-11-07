const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Token dewa hoyni' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User paoa jayni' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token valid na ba expired' });
  }
};
