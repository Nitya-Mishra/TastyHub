import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.success) {
        setFavorites(response.data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // ADD user as dependency

  // Check if a recipe is favorited
  const isFavorited = (recipeId) => {
    return favorites.some(fav => fav._id === recipeId);
  };

  // Add to favorites
  const addToFavorites = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/favorites/${recipeId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.success) {
        await fetchFavorites(); 
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/favorites/${recipeId}`, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.success) {
        await fetchFavorites(); 
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (recipeId) => {
    if (isFavorited(recipeId)) {
      return await removeFromFavorites(recipeId);
    } else {
      return await addToFavorites(recipeId);
    }
  };

  
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]); 

  const value = {
    favorites,
    loading,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};