const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');


//  Add rating to recipe

router.post('/', auth, async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;
    
    // Validate input
    if (!recipeId || !rating) {
      return res.status(400).json({ msg: 'Recipe ID and rating are required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ msg: 'Invalid recipe ID format' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if user already rated this recipe
    const existingRating = await Rating.findOne({ 
      recipe: recipeId, 
      user: req.user.id 
    });
    
    if (existingRating) {
      return res.status(400).json({ msg: 'You already rated this recipe' });
    }

    // Create new rating
    const newRating = new Rating({
      recipe: recipeId,
      user: req.user.id, 
      rating,
      comment: comment || ''
    });

    await newRating.save();
    res.json(newRating);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/:recipeId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.recipeId)) {
      return res.status(400).json({ msg: 'Invalid recipe ID format' });
    }

    const ratings = await Rating.find({ recipe: req.params.recipeId })
      .populate('user', ['username'])  
      .sort({ createdAt: -1 });

    res.json(ratings);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;