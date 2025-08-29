import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ recipeId, size = 'medium' }) => {
    
  const { isFavorited, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await toggleFavorite(recipeId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };


  const isFavoritedState = isFavorited(recipeId);

  if (!user) {
    return (
      <Tooltip title="Login to add favorites">
        <span>
          <IconButton disabled size={size}>
            <FavoriteBorder color="disabled" />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isFavoritedState ? "Remove from favorites" : "Add to favorites"}>
      <IconButton
        onClick={handleClick}
        disabled={loading}
        color={isFavoritedState ? "error" : "default"}
        size={size}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : isFavoritedState ? (
          <Favorite />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;