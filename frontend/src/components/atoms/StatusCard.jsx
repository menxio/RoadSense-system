import { Card, CardContent, Box, Typography, Badge } from "@mui/material";

const StatusCard = ({ title, count, icon, color, isActive, onClick }) => {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: "200px" },
        cursor: "pointer",
        borderLeft: `4px solid ${color}`,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
        bgcolor: isActive
          ? `rgba(${color.replace(/[^\d,]/g, "")}, 0.08)`
          : "background.paper",
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Badge
            badgeContent={count}
            color={
              color.includes("#f44336")
                ? "error"
                : color.includes("#ff9800")
                ? "warning"
                : "success"
            }
          >
            {icon}
          </Badge>
        </Box>
        <Typography
          variant="h4"
          sx={{ mt: 1, fontWeight: "bold", color: color }}
        >
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
