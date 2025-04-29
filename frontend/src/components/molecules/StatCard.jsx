import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

const StatCard = ({ title, value, icon, color = "primary", onClick }) => {
  const theme = useTheme();

  const colorMap = {
    primary: {
      light: "#e3f2fd",
      main: "#2196f3",
      dark: "#1565c0",
    },
    success: {
      light: "#e8f5e9",
      main: "#4caf50",
      dark: "#2e7d32",
    },
    warning: {
      light: "#fff8e1",
      main: "#ff9800",
      dark: "#f57c00",
    },
    error: {
      light: "#ffebee",
      main: "#f44336",
      dark: "#c62828",
    },
    info: {
      light: "#e1f5fe",
      main: "#03a9f4",
      dark: "#0277bd",
    },
  };

  const selectedColor = colorMap[color];

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px 0 rgba(0,0,0,0.15)",
        },
        cursor: onClick ? "pointer" : "default",
        borderRadius: 2,
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          height: 8,
          backgroundColor: selectedColor.main,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: selectedColor.dark }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedColor.light,
              borderRadius: "50%",
              width: 56,
              height: 56,
              color: selectedColor.main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
