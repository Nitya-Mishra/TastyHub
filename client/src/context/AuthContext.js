import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios interceptors for token management
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Only logout if it's NOT a login/register request
          const isAuthRequest = error.config?.url?.includes('/auth/');
          
          if (!isAuthRequest) {
            console.log('Auto-logout due to 401 on non-auth request');
            localStorage.removeItem('token');
            setUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Get user data with the token
        const { data: userData } = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'x-auth-token': token
          }
        });
        
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          token: token
        });
        
      } catch (err) {
        console.error('Failed to load user:', err.message);
        
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { 
        email: email.toString(), 
        password 
      });
      
      localStorage.setItem('token', data.token);
      
      // Get user details after successful login
      const { data: userData } = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'x-auth-token': data.token
        }
      });
      
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        token: data.token
      });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      logout,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };