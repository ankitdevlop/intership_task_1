const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../modules/user'); // Make sure to import your User model

// Middleware to extract user ID from JWT token
const extractUserIdFromToken = (req, res, next) => {
  const token = req.headers.authorization;
console.log(token)
  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded._id;
    next();
  });
};

// Route to fetch user data
router.get('/profile', extractUserIdFromToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Use Mongoose to fetch user data from MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
    console.log(`User data retrieved at ${new Date().toISOString()}:`, user);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
