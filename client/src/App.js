import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { CssBaseline, Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SearchPage from './pages/SearchPage';
import RecipeCreationPage from './pages/RecipeCreationPage';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeEditPage from './pages/RecipeEditPage';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/FavoritesPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
        <CssBaseline />
        <Container maxWidth="lg">
          
          <AppContent />
        </Container>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}


const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Navigation Bar */}
      <Box sx={{ 
        mt: 4, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        mb: 4
      }}>
        <Button component={Link} to="/" variant="outlined">
          Home
        </Button>
        {user && (
          <>
            <Button component={Link} to="/search" variant="outlined">
              Search
            </Button>
            <Button component={Link} to="/recipes" variant="outlined">
              All Recipes
            </Button>
             <Button component={Link} to="/favorites" variant="outlined">
      Favorites
    </Button>
            <Button 
              component={Link} 
              to="/recipes/new" 
              variant="contained" 
              color="primary"
            >
              Create Recipe
            </Button>
          </>
        )}
      </Box>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Recipe Sharing App
            </Typography>
            <Button 
              component={Link}
              to="/login"
              variant="contained"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button 
              component={Link}
              to="/register"
              variant="outlined"
            >
              Register
            </Button>
          </Box>
        } />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* Protected Routes */}
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <RecipeList />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:id" element={
          <ProtectedRoute>
            <RecipeDetail />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:id/edit" element={
          <ProtectedRoute>
            <RecipeEditPage />
          </ProtectedRoute>
        } />
        <Route path="/recipes/new" element={
          <ProtectedRoute>
            <RecipeCreationPage />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
  <ProtectedRoute>
    <FavoritesPage />
  </ProtectedRoute>
} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;