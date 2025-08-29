const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one rating per recipe
ratingSchema.index({ recipe: 1, user: 1 }, { unique: true });

// Static method to get average rating of a recipe
ratingSchema.statics.getAverageRating = async function(recipeId) {
  const obj = await this.aggregate([
    {
      $match: { recipe: recipeId }
    },
    {
      $group: {
        _id: '$recipe',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Recipe').findByIdAndUpdate(recipeId, {
      averageRating: obj[0] ? obj[0].averageRating : 0,
      ratingCount: obj[0] ? obj[0].ratingCount : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ratingSchema.post('save', function() {
  this.constructor.getAverageRating(this.recipe);
});

// Call getAverageRating after remove
ratingSchema.post('remove', function() {
  this.constructor.getAverageRating(this.recipe);
});

module.exports = mongoose.model('Rating', ratingSchema);