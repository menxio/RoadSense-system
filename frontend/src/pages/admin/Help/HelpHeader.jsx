import { Box, Typography } from "@mui/material";
import { MenuBook as MenuBookIcon } from "@mui/icons-material";

const HelpHeader = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: "bold",
          color: "#0d1b2a",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <MenuBookIcon fontSize="large" /> Admin Guide
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Learn how to manage violations, handle offense levels, and export
        reports.
      </Typography>
    </Box>
  );
};

export default HelpHeader;
