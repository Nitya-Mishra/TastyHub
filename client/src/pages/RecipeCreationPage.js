import { Box, CircularProgress } from '@mui/material';
import RecipeForm from '../components/RecipeForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RecipeCreationPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const verifyAuth = async () => {
      if (!authLoading && !user) {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        try {
          
          await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { 'x-auth-token': token }
          });
        } catch (err) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    verifyAuth();
  }, [user, authLoading, navigate]);

  const handleSubmit = async (recipeData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Your session has expired. Please login again.');
      }

      const response = await axios.post('http://localhost:5000/api/recipes', recipeData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (response.status === 201) {
        navigate('/', { state: { recipeCreated: true } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to create recipe. Please try again.';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: 800, 
      mx: 'auto',
      boxShadow: 3,
      borderRadius: 2,
      bgcolor: 'background.paper',
      position: 'relative'
    }}>
      {error && (
        <Box 
          sx={{ 
            color: 'error.main', 
            mb: 3, 
            p: 2, 
            bgcolor: 'error.light', 
            borderRadius: 1 
          }}
        >
          {error}
        </Box>
      )}
      
      <RecipeForm 
        onSubmit={handleSubmit} 
        disabled={submitting}
      />
      
      {submitting && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.7)',
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default RecipeCreationPage;