const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title must be 3+ characters').isLength({ min: 3 }),
      check('ingredients', 'At least 1 ingredient is required').isArray({ min: 1 }),
      check('steps', 'Steps must be 10+ characters').isLength({ min: 10 }),
      check('difficulty', 'Invalid difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
      check('prepTime', 'Prep time must be a number').optional().isNumeric(),
      check('cookTime', 'Cook time must be a number').optional().isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newRecipe = new Recipe({
        user: req.user.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        difficulty: req.body.difficulty,
        categories: req.body.categories || []
      });

      const recipe = await newRecipe.save();
      res.json(recipe);
    } catch (err) {
      console.error('Recipe creation error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error('Get recipes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/recipes/search
// @desc    Search recipes by title/ingredients
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q: query, difficulty, maxCookTime } = req.query;

    // Validate search query
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Search term must be at least 2 characters',
        example: '/api/recipes/search?q=pasta&difficulty=Easy&maxCookTime=30'
      });
    }

    // Build search filters
    const filters = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } }
      ]
    };

    // Add optional filters
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filters.difficulty = difficulty;
    }

    if (maxCookTime && !isNaN(maxCookTime)) {
      filters.cookTime = { $lte: Number(maxCookTime) };
    }

    const recipes = await Recipe.find(filters)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      count: recipes.length,
      results: recipes
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      error: 'Search failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (err) {
    console.error('Get recipe error:', err);
    res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // FIXED: Changed req.user._id to req.user.id
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { title, ingredients, steps, prepTime, cookTime, difficulty, categories } = req.body;
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: { title, ingredients, steps, prepTime, cookTime, difficulty, categories } },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//   Delete a recipe

router.delete('/:id', auth, async (req, res) => {
  try {
    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    // 2. Find recipe
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // 4. Delete
    await recipe.deleteOne();
    res.json({ msg: 'Recipe deleted' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;