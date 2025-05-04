import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
} from "@mui/material";
import EmptyState from "@/components/molecules/EmptyState";
import TablePagination from "@/components/molecules/TablePagination";

const DataTable = ({
  columns,
  data,
  loading,
  emptyState,
  renderRow,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  paginationEnabled = true,
}) => {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = paginationEnabled
    ? data.slice(startIndex, endIndex)
    : data;
  const totalCount = data.length;

  return (
    <Box
      sx={{
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f5f7fa" }}>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                      <Skeleton
                        width={colIndex === 0 ? 100 : 120}
                        height={colIndex === 4 ? 32 : 24}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              // Data rows
              paginatedData.map((item, index) => renderRow(item, index))
            ) : (
              // Empty state
              <EmptyState {...emptyState} />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {paginationEnabled && !loading && data.length > 0 && (
        <TablePagination
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Box>
  );
};

export default DataTable;
