const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = Router();


/**
 * /api/auth ENDPOINT
 */
router.get(
  '/',
  async (_, res) => {
  try {
    const user = new User({});

    await user.save();

    const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
    );
  
    res.status(200).json({ data: { token, userId: user.id }, message: 'Success' });
  } catch (e) {
    res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' })
  }
});

module.exports = router;