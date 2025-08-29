import { Box, Typography, Card, CardContent, Chip, Stack, Skeleton } from '@mui/material';
import { useState } from 'react';
import CategoryFilter from './CategoryFilter';

const SearchResults = ({ results, loading }) => {
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        {[...Array(3)].map((_, i) => (
          <Skeleton 
            key={i} 
            variant="rectangular" 
            height={120} 
            sx={{ mb: 2, borderRadius: 1 }} 
          />
        ))}
      </Box>
    );
  }

 
  const filteredResults = results.filter(recipe => 
    difficultyFilter === 'all' || 
    (recipe.difficulty && recipe.difficulty.toLowerCase() === difficultyFilter)
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="textPrimary">
          {filteredResults.length} {filteredResults.length === 1 ? 'recipe' : 'recipes'} found
        </Typography>
        <CategoryFilter onFilterChange={setDifficultyFilter} />
      </Box>
      
      <Stack spacing={2}>
        {filteredResults.map((recipe) => (
          <Card 
            key={recipe._id} 
            sx={{ 
              backgroundColor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">
                {recipe.title}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                {recipe.difficulty && (
                  <Chip 
                    label={recipe.difficulty} 
                    size="small" 
                    color="secondary" 
                  />
                )}
                {recipe.prepTime && (
                  <Chip 
                    label={`Prep: ${recipe.prepTime} mins`} 
                    size="small" 
                  />
                )}
                {recipe.cookTime && (
                  <Chip 
                    label={`Cook: ${recipe.cookTime} mins`} 
                    size="small" 
                  />
                )}
              </Stack>
              <Typography variant="body2" color="textSecondary">
                {recipe.ingredients.slice(0, 3).join(', ')}...
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default SearchResults;