import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { CalendarMonth as CalendarIcon } from "@mui/icons-material";

const MonthFilter = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Filter by Month</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label="Filter by Month"
        startAdornment={
          <InputAdornment position="start">
            <CalendarIcon fontSize="small" />
          </InputAdornment>
        }
      >
        <MenuItem value="">All Months</MenuItem>
        <MenuItem value="1">January</MenuItem>
        <MenuItem value="2">February</MenuItem>
        <MenuItem value="3">March</MenuItem>
        <MenuItem value="4">April</MenuItem>
        <MenuItem value="5">May</MenuItem>
        <MenuItem value="6">June</MenuItem>
        <MenuItem value="7">July</MenuItem>
        <MenuItem value="8">August</MenuItem>
        <MenuItem value="9">September</MenuItem>
        <MenuItem value="10">October</MenuItem>
        <MenuItem value="11">November</MenuItem>
        <MenuItem value="12">December</MenuItem>
      </Select>
    </FormControl>
  );
};

export default MonthFilter;
