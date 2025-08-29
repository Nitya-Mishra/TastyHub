import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, TextField, Chip, 
  CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import axios from 'axios';

const RecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [],
    steps: '',
    difficulty: 'Easy',
    prepTime: 0,
    image: ''
  });

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        setRecipe(response.data);
        setFormData({
          title: response.data.title,
          ingredients: response.data.ingredients,
          steps: response.data.steps,
          difficulty: response.data.difficulty,
          prepTime: response.data.prepTime,
          image: response.data.image || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle ingredients 
  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, ingredients }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // DEBUG: Log the token and request
      //console.log('Token being sent:', token);
      //console.log('Recipe ID:', id);
      //console.log('Form data:', formData);
      
      const response = await axios.put(
        `http://localhost:5000/api/recipes/${id}`,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Update successful:', response.data);
      setSuccess(true);
      setTimeout(() => navigate(`/recipes/${id}`), 1500);
    } catch (err) {
      console.error('Update error details:', err);
      console.error('Response data:', err.response?.data);
      setError('Failed to update recipe: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Edit Recipe</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Recipe updated!</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Ingredients (comma-separated)"
          value={formData.ingredients.join(', ')}
          onChange={handleIngredientsChange}
          fullWidth
          margin="normal"
          required
          multiline
        />

        <TextField
          label="Steps"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          multiline
          rows={4}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            label="Difficulty"
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Prep Time (minutes)"
          name="prepTime"
          type="number"
          value={formData.prepTime}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/recipes/${id}`)}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default RecipeEditPage;