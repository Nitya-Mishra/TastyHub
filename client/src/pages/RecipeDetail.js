import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Chip, CircularProgress, Divider, 
  List, ListItem, ListItemText, CardMedia, Paper, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import FavoriteButton from '../components/FavoriteButton';
import RatingSystem from '../components/RatingSystem'; 

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/recipes/${id}`)
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate('/recipes');
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Recipe deleted successfully!',
        severity: 'success'
      });
      
      setTimeout(() => navigate('/recipes'), 1000);
    } catch (err) {
      console.error('Delete error:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to delete recipe',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      {recipe.image && (
        <CardMedia
          component="img"
          height="300"
          image={recipe.image}
          alt={recipe.title}
          sx={{ mb: 3, borderRadius: 1 }}
        />
      )}
      
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1, mr: 2 }}>
          {recipe.title}
        </Typography>
        <FavoriteButton recipeId={recipe._id} size="large" />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={recipe.difficulty} 
          color={
            recipe.difficulty === 'Easy' ? 'success' : 
            recipe.difficulty === 'Medium' ? 'warning' : 'error'
          } 
        />
        <Typography variant="body1">
          Prep Time: {recipe.prepTime} minutes
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Ingredients</Typography>
        <List dense>
          {recipe.ingredients.map((ingredient, i) => (
            <ListItem key={i}>
              <ListItemText primary={`• ${ingredient}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Steps</Typography>
        <Typography whiteSpace="pre-line" component="div">
          {recipe.steps.split('\n').map((step, i) => (
            <Typography key={i} paragraph sx={{ mb: 2 }}>
              {i + 1}. {step}
            </Typography>
          ))}
        </Typography>
      </Box>

      {/* ADD RATING SYSTEM COMPONENT */}
      <RatingSystem recipeId={id} />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          component={Link}
          to={`/recipes/${id}/edit`}
          variant="contained"
        >
          Edit Recipe
        </Button>
        
        <Button 
          variant="contained" 
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Recipe
        </Button>
        
        <Button 
          component={Link}
          to="/recipes"
          variant="outlined"
        >
          Back to Recipes
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RecipeDetail;