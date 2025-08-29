import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  CardMedia, 
  Box 
} from '@mui/material';
import FavoriteButton from './FavoriteButton';

const RecipeCard = ({ recipe }) => {
  return (
    <Card sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {recipe.image && (
        <CardMedia
          component="img"
          height="140"
          image={recipe.image}
          alt={recipe.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {recipe.title}
          </Typography>
          
         
          <FavoriteButton recipeId={recipe._id} size="small" />
        </Box>
        
        <Chip 
          label={recipe.difficulty} 
          size="small" 
          sx={{ mt: 1, mb: 1, alignSelf: 'flex-start' }}
          color={
            recipe.difficulty === 'Easy' ? 'success' : 
            recipe.difficulty === 'Medium' ? 'warning' : 'error'
          }
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Prep Time: {recipe.prepTime} mins
        </Typography>
        
        <Button 
          component={Link} 
          to={`/recipes/${recipe._id}`}
          size="small"
          variant="contained"
          sx={{ mt: 'auto' }}
          fullWidth
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
