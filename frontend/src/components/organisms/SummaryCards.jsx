import { Grid, Skeleton } from "@mui/material";
import SummaryCard from "@/components/atoms/SummaryCard";
import {
  Warning as WarningIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";

const SummaryCards = ({
  loading,
  totalViolations,
  speedViolations,
  noiseViolations,
  flaggedViolations,
  reviewedViolations,
  clearedViolations,
  monthlyAverage,
  isFiltered,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={4}>
        <SummaryCard
          title="Total Violations"
          value={loading ? <Skeleton width={80} /> : totalViolations}
          icon={<WarningIcon color="primary" />}
          chips={[
            {
              icon: <SpeedIcon fontSize="small" />,
              label: `${speedViolations} Speed`,
              color: "error",
            },
            {
              icon: <VolumeUpIcon fontSize="small" />,
              label: `${noiseViolations} Noise`,
              color: "info",
            },
          ]}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SummaryCard
          title="Status Breakdown"
          value={loading ? <Skeleton width={80} /> : `${totalViolations}`}
          icon={<PieChartIcon color="primary" />}
          chips={[
            {
              icon: <WarningIcon fontSize="small" />,
              label: `${flaggedViolations} Flagged`,
              color: "error",
            },
            {
              icon: <WarningAmberIcon fontSize="small" />,
              label: `${reviewedViolations} Under Review`,
              color: "warning",
            },
            {
              icon: <CheckCircleIcon fontSize="small" />,
              label: `${clearedViolations} Cleared`,
              color: "success",
            },
          ]}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SummaryCard
          title="Monthly Average"
          value={loading ? <Skeleton width={80} /> : monthlyAverage}
          icon={<BarChartIcon color="primary" />}
          chips={[
            {
              icon: <CalendarIcon fontSize="small" />,
              label: isFiltered ? "Filtered Month" : "All Months",
              color: "primary",
            },
          ]}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
