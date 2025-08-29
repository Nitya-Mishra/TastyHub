const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  ingredients: {
    type: [String],
    required: [true, 'Please add at least one ingredient'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(ing => ing.trim().length > 0);
      },
      message: 'Please add at least one valid ingredient'
    }
  },
  steps: {
    type: String,
    required: [true, 'Please add preparation steps']
  },
  prepTime: {
    type: Number,
    required: [true, 'Please add prep time'],
    min: [1, 'Prep time must be at least 1 minute']
  },
  cookTime: {
    type: Number,
    required: [true, 'Please add cook time'],
    min: [1, 'Cook time must be at least 1 minute']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);