const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user exists
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Attach the user data to the request object
      req.user = user;
      next();
    } catch (error) {
      // Handle token verification errors
      res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  } else {
    // Handle cases where there's no Authorization header
    res.status(401).json({ error: 'Not authorized, no token' });
  }
});

module.exports = { protect };
