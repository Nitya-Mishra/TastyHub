import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Typography, Button, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;