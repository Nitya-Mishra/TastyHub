import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Rating as MuiRating, 
  TextField, Button, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

const RatingSystem = ({ recipeId }) => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  // Fetch recipe ratings and check if user already rated
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Get recipe details which includes averageRating and ratingCount
        const recipeResponse = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
        setAverageRating(recipeResponse.data.averageRating || 0);
        setRatingCount(recipeResponse.data.ratingCount || 0);

        // Check if user already rated this recipe
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const ratingsResponse = await axios.get(`http://localhost:5000/api/rating/${recipeId}`, {
              headers: { 'x-auth-token': token }
            });
            
            const userRatingData = ratingsResponse.data.find(rating => 
              rating.user._id === JSON.parse(localStorage.getItem('user')).id
            );
            
            if (userRatingData) {
              setExistingRating(userRatingData);
              setUserRating(userRatingData.rating);
              setComment(userRatingData.comment || '');
            }
          } catch (err) {
            // Silent fail - user might not have rated yet
          }
        }
      } catch (err) {
        console.error('Error fetching ratings:', err);
      }
    };

    fetchRatings();
  }, [recipeId]);

  const handleSubmitRating = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to rate recipes');
        setLoading(false);
        return;
      }

      await axios.post('http://localhost:5000/api/rating', {
        recipeId,
        rating: userRating,
        comment
      }, {
        headers: { 'x-auth-token': token }
      });

      setSuccess('Rating submitted successfully!');
      setDialogOpen(false);
      
      // Refresh ratings
      const recipeResponse = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
      setAverageRating(recipeResponse.data.averageRating);
      setRatingCount(recipeResponse.data.ratingCount);
      setExistingRating({ rating: userRating, comment });

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Rate this Recipe
      </Typography>

      {/* Average Rating Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MuiRating
          value={averageRating}
          readOnly
          precision={0.1}
          emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          ({averageRating.toFixed(1)}) from {ratingCount} rating{ratingCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Rate Button or Already Rated Message */}
      {existingRating ? (
        <Box>
          <Typography variant="body2" color="text.secondary">
            You rated this recipe: {existingRating.rating} stars
            {existingRating.comment && ` - "${existingRating.comment}"`}
          </Typography>
        </Box>
      ) : (
        <Button
          variant="outlined"
          onClick={() => setDialogOpen(true)}
          disabled={!localStorage.getItem('token')}
        >
          {localStorage.getItem('token') ? 'Rate This Recipe' : 'Login to Rate'}
        </Button>
      )}

      {/* Rating Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate This Recipe</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <MuiRating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
            />
          </Box>

          <TextField
            label="Comment (optional)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitRating} 
            variant="contained" 
            disabled={loading || userRating === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RatingSystem;