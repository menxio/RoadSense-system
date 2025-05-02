import { TableCell, Box } from "@mui/material";

const TableHeaderCell = ({ icon, children }) => {
  return (
    <TableCell sx={{ fontWeight: "bold" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        {children}
      </Box>
    </TableCell>
  );
};

export default TableHeaderCell;
