const Recipe = require('../models/Recipe');
const { validationResult } = require('express-validator');

//  Create a new recipe

exports.createRecipe = async (req, res) => {
  // 1. Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Extract fields from request body
  const { title, ingredients, steps, prepTime, cookTime, difficulty } = req.body;

  try {
    // 3. Create recipe with user reference
    const recipe = await Recipe.create({
      title,
      ingredients: ingredients.filter(ing => ing.trim() !== ''), // Remove empty ingredients
      steps,
      prepTime,
      cookTime,
      difficulty,
      user: req.user.userId 
    });

    // 4. Return successful response
    res.status(201).json({
      success: true,
      data: recipe
    });

  } catch (err) {
    // 5. Handle errors
    console.error('Recipe creation error:', err.message);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    // Other server errors
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

