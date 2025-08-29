import { TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                type="submit" 
                disabled={loading || query.length < 2}
              >
                {loading ? <CircularProgress size={24} /> : <SearchIcon />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 1
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'primary.main',
            },
            '&:hover fieldset': {
              borderColor: 'primary.light',
            },
          }
        }}
      />
    </form>
  );
};

export default SearchBar;