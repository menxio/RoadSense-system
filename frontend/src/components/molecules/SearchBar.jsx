import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const SearchBar = ({
  value,
  onChange,
  onRefresh,
  placeholder = "Search...",
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        placeholder={placeholder}
        size="small"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: "100%", sm: "250px" } }}
      />

      <Tooltip title="Refresh data">
        <IconButton onClick={onRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SearchBar;
