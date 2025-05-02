import { Tabs, Tab, Box, Chip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

const StatusTabs = ({ value, onChange, tabsConfig }) => {
  const getTabIcon = (status) => {
    switch (status) {
      case "active":
      case "cleared":
        return <CheckCircleIcon fontSize="small" />;
      case "pending":
        return <WarningIcon fontSize="small" />;
      case "flagged":
        return <WarningIcon fontSize="small" />;
      case "under review":
        return <WarningAmberIcon fontSize="small" />;
      case "suspended":
        return <BlockIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getTabColor = (status) => {
    switch (status) {
      case "active":
      case "cleared":
        return "success";
      case "pending":
      case "under review":
        return "warning";
      case "flagged":
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        mb: 2,
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 600,
          minHeight: "48px",
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {getTabIcon(tab.value)}
              <span>{tab.label}</span>
              <Chip
                label={tab.count}
                size="small"
                color={getTabColor(tab.value)}
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
      ))}
    </Tabs>
  );
};

export default StatusTabs;
