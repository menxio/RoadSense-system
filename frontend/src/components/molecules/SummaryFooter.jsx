import { Box, Typography } from "@mui/material";

const SummaryFooter = ({
  filteredCount,
  totalCount,
  filterMonth,
  searchQuery,
}) => {
  const getMonthName = (monthNumber) => {
    return new Date(2023, Number.parseInt(monthNumber, 10) - 1).toLocaleString(
      "default",
      {
        month: "long",
      }
    );
  };

  return (
    <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
      <Typography variant="body2" color="text.secondary">
        Showing {filteredCount} of {totalCount} total violations
        {filterMonth && <> filtered by {getMonthName(filterMonth)}</>}
        {searchQuery && <> with search term "{searchQuery}"</>}
      </Typography>
    </Box>
  );
};

export default SummaryFooter;
