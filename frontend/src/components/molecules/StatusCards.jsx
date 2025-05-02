import { Box } from "@mui/material";
import StatusCard from "@/components/atoms/StatusCard";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

const StatusCards = ({ counts, activeTab, onTabChange }) => {
  const cards = [
    {
      id: "flagged",
      title: "Flagged",
      count: counts.flagged,
      icon: <WarningIcon color="error" />,
      color: "#f44336",
    },
    {
      id: "under review",
      title: "Under Review",
      count: counts["under review"],
      icon: <WarningAmberIcon color="warning" />,
      color: "#ff9800",
    },
    {
      id: "cleared",
      title: "Cleared",
      count: counts.cleared,
      icon: <CheckCircleIcon color="success" />,
      color: "#4caf50",
    },
  ];

  // For users table
  if (counts.active !== undefined) {
    cards.splice(0, cards.length);
    cards.push(
      {
        id: "active",
        title: "Active Users",
        count: counts.active,
        icon: <CheckCircleIcon color="success" />,
        color: "#4caf50",
      },
      {
        id: "pending",
        title: "Pending Users",
        count: counts.pending,
        icon: <WarningIcon color="warning" />,
        color: "#ff9800",
      },
      {
        id: "suspended",
        title: "Suspended Users",
        count: counts.suspended,
        icon: <BlockIcon color="error" />,
        color: "#f44336",
      }
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {cards.map((card) => (
        <StatusCard
          key={card.id}
          title={card.title}
          count={card.count}
          icon={card.icon}
          color={card.color}
          isActive={activeTab === card.id}
          onClick={() => onTabChange(card.id)}
        />
      ))}
    </Box>
  );
};

export default StatusCards;
