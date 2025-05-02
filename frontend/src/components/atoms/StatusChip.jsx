import { Chip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

const StatusChip = ({ status, onClick, customStyles = {} }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    <Chip
      icon={getStatusIcon(status)}
      label={status?.toUpperCase()}
      color={getStatusColor(status)}
      size="small"
      onClick={onClick}
      sx={{
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          opacity: onClick ? 0.9 : 1,
          transform: onClick ? "translateY(-1px)" : "none",
        },
        ...customStyles,
      }}
    />
  );
};

export default StatusChip;
