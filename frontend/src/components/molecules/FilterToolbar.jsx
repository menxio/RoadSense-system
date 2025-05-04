import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import MonthFilter from "@/components/molecules/MonthFilter";

const FilterToolbar = ({
  filterMonth,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  searchPlaceholder = "Search by ID or plate",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <MonthFilter value={filterMonth} onChange={onFilterChange} />

      <TextField
        placeholder={searchPlaceholder}
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
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
        <IconButton onClick={onRefresh} color="primary" size="small">
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FilterToolbar;
