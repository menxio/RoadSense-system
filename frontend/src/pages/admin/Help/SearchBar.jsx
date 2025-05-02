import {
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          placeholder="Search help topics..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <LightbulbIcon color="warning" /> Quick Tips
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the tabs below to navigate between different help topics. You
              can also search for specific keywords across all topics.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
