const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');


//  Get logged-in user's profile

router.get('/me', auth, async (req, res) => {
  try {
    
    const user = await User.findById(req.user).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
    
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;