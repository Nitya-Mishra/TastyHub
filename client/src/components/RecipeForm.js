import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';

const RecipeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    steps: '',
    prepTime: '',
    cookTime: '',
    difficulty: 'Medium'
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  // Add new ingredient field
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, '']
    });
  };

  // Remove ingredient
  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients.length > 0 ? newIngredients : ['']
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty ingredients
      const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
      if (filteredIngredients.length === 0) {
        throw new Error('At least one ingredient is required');
      }

      // Prepare the request data
      const recipeData = {
        title: formData.title.trim(),
        ingredients: filteredIngredients,
        steps: formData.steps.trim(),
        prepTime: Number(formData.prepTime),
        cookTime: Number(formData.cookTime),
        difficulty: formData.difficulty
      };

      // Make API request
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create recipe');
      }

      // Success - redirect to recipes page
      navigate('/recipes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Recipe Title */}
      <TextField
        fullWidth
        label="Recipe Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        margin="normal"
      />

      {/* Ingredients */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Ingredients</Typography>
      {formData.ingredients.map((ingredient, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            margin="normal"
          />
          {formData.ingredients.length > 1 && (
            <Chip 
              label="Remove" 
              color="error" 
              onClick={() => removeIngredient(index)}
            />
          )}
        </Box>
      ))}
      <Button 
        onClick={addIngredient} 
        variant="outlined" 
        sx={{ mt: 1 }}
      >
        + Add Ingredient
      </Button>

      {/* Preparation Steps */}
      <TextField
        fullWidth
        label="Preparation Steps"
        name="steps"
        value={formData.steps}
        onChange={handleChange}
        required
        multiline
        rows={4}
        margin="normal"
      />

      {/* Time Inputs */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Prep Time (minutes)"
          name="prepTime"
          type="number"
          value={formData.prepTime}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Cook Time (minutes)"
          name="cookTime"
          type="number"
          value={formData.cookTime}
          onChange={handleChange}
          required
          fullWidth
        />
      </Box>

      {/* Difficulty */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Difficulty</InputLabel>
        <Select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          label="Difficulty"
          required
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Recipe'}
      </Button>
    </Box>
  );
};

export default RecipeForm;