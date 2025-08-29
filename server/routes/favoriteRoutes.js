const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');


router.post('/:recipeId', auth, async (req, res) => {
  try {
    // Check if recipe exists
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Get user and check if already favorited
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipe already in favorites' 
      });
    }

    // Add to favorites
    user.favorites.push(req.params.recipeId);
    await user.save();

    res.json({ 
      success: true, 
      favorites: user.favorites 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites'); 

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      favorites: user.favorites 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.delete('/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if recipe exists in favorites
    const index = user.favorites.indexOf(req.params.recipeId);
    if (index === -1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipe not in favorites' 
      });
    }

    // Remove from array
    user.favorites.splice(index, 1);
    await user.save();

    res.json({ 
      success: true, 
      favorites: user.favorites 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;