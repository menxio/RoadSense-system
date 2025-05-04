import { Card, CardContent, Box, Typography, Chip } from "@mui/material";

const SummaryCard = ({ title, value, icon, chips, loading = false }) => {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {chips.map((chip, index) => (
            <Chip
              key={index}
              size="small"
              icon={chip.icon}
              label={chip.label}
              color={chip.color || "default"}
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
