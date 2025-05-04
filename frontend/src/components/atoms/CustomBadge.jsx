import { Box } from "@mui/material";

const CustomBadge = ({ children, onClick }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        color: "#1565c0",
        padding: "4px 12px",
        borderRadius: "16px",
        display: "inline-block",
        fontWeight: "medium",
        fontSize: "0.875rem",
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "#1565c0",
          color: "#fff",
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default CustomBadge;
