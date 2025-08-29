import { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import axios from 'axios';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#f9f9f9',
    },
  },
});

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/search?q=${query}`);
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <SearchBar onSearch={handleSearch} loading={loading} />
            {error && (
              <Box sx={{ color: 'error.main', mt: 2 }}>
                {error}
              </Box>
            )}
            <SearchResults results={results} loading={loading} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SearchPage;
