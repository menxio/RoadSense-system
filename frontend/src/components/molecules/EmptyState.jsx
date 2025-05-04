import { TableRow, TableCell, Box, Typography, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

const EmptyState = ({ icon, message, subMessage, onReset, colSpan = 7 }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon}
          <Typography variant="h6" color="text.secondary">
            {message}
          </Typography>
          {subMessage && (
            <Typography variant="body2" color="text.secondary">
              {subMessage}
            </Typography>
          )}
          {onReset && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={onReset}
              sx={{ mt: 1 }}
              startIcon={<RefreshIcon />}
            >
              Reset Search
            </Button>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
