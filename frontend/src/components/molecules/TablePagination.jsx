import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event.target.value);
  };

  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
        px: 2,
        py: 1.5,
        borderTop: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <FormControl size="small" variant="outlined">
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            sx={{ minWidth: 70, height: 32 }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {`${(page - 1) * rowsPerPage + 1}-${Math.min(
            page * rowsPerPage,
            count
          )} of ${count}`}
        </Typography>
      </Box>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size="medium"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default TablePagination;
