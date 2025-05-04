import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";

const ChartCard = ({ title, children }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        }
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          p: 2,
        }}
      />
      <CardContent
        sx={{
          p: 2,
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children || (
          <Typography variant="body2" color="text.secondary">
            Chart data will be displayed here
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
