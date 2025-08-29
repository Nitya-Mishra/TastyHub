import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Grid, Card, CardContent, 
  CardMedia, Button, Chip, Alert, Container
} from '@mui/material';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const { favorites, loading, fetchFavorites } = useFavorites();
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);


useEffect(() => {
  let isMounted = true;
  
  const loadFavorites = async () => {
    try {
      await fetchFavorites();
      if (isMounted) {
        setInitialLoad(false);
      }
    } catch (err) {
      if (isMounted) {
        setError('Failed to load favorites');
        setInitialLoad(false);
      }
      console.error('Error fetching favorites:', err);
    }
  };

  loadFavorites();

  return () => {
    isMounted = false;
  };
}, []); 

  
  if (initialLoad) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column'
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your favorites...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={fetchFavorites} variant="outlined">
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Your Favorite Recipes
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 8,
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No favorite recipes yet!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding some recipes to your favorites.
          </Typography>
          <Button 
            component={Link} 
            to="/recipes" 
            variant="contained"
            size="large"
          >
            Browse Recipes
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
          </Typography>

          <Grid container spacing={3}>
            {favorites.map((recipe) => (
              <Grid item key={recipe._id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}>
                  {recipe.image && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={recipe.image}
                      alt={recipe.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '64px'
                      }}
                    >
                      {recipe.title}
                    </Typography>
                    
                    <Chip 
                      label={recipe.difficulty} 
                      size="small" 
                      sx={{ mb: 1 }}
                      color={
                        recipe.difficulty === 'Easy' ? 'success' : 
                        recipe.difficulty === 'Medium' ? 'warning' : 'error'
                      }
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Prep Time: {recipe.prepTime} mins
                    </Typography>
                    
                    <Button 
                      component={Link} 
                      to={`/recipes/${recipe._id}`}
                      size="small"
                      variant="contained"
                      fullWidth
                    >
                      View Recipe
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default FavoritesPage;