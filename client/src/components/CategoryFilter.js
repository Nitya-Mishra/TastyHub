import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CategoryFilter = ({ onFilterChange }) => {
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel>Difficulty</InputLabel>
      <Select
        defaultValue="all"
        onChange={(e) => onFilterChange(e.target.value)}
        label="Difficulty"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;