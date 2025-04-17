import React from 'react';
import { Typography, Grid } from '@mui/material';
import {
  LayoutDashboardIcon,
  AlertTriangleIcon,
  LogOutIcon,
  CalendarIcon,
  AlertCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatsCard } from '../components/StatsCard';
import { ViolationsTable } from '../components/ViolationsTable';

const StudentDashboard = () => {
  const sidebarItems = [
    {
      icon: <LayoutDashboardIcon size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <AlertTriangleIcon size={20} />,
      label: 'Violation List',
      path: '/violations',
    },
    {
      icon: <LogOutIcon size={20} />,
      label: 'Logout',
      path: '/logout',
    },
  ];

  const violations = []; // Replace with actual violation data when available

  const handleNavigate = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  const handleAction = (action) => {
    console.log(`Action: ${action}`);
  };

  return (
    <DashboardLayout
      logo="RoadSense"
      sidebarItems={sidebarItems}
      activePath="/dashboard"
      onNavigate={handleNavigate}
      userName="Catherine Ledner"
      userRole="Student"
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          color: 'text.secondary',
          mb: 4,
        }}
      >
        Student Dashboard
      </Typography>
      <Grid
        container
        spacing={3} // Adds spacing between grid items
        sx={{
          mb: 4,
        }}
      >
        {/* Each Grid item is now responsive */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<CalendarIcon size={24} />}
            title="Today's Violations"
            value="0"
            actionText="VIEW"
            iconBgColor="#1a73e8"
            actionTextColor="#1a73e8"
            onAction={() => handleAction('view-today')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<AlertCircleIcon size={24} />}
            title="Total Violations"
            value="0"
            actionText="VIEW"
            iconBgColor="#e74c3c"
            actionTextColor="#e74c3c"
            onAction={() => handleAction('view-total')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<InfoIcon size={24} />}
            title="Penalty Level"
            value="0"
            actionText="APPEAL"
            iconBgColor="#f39c12"
            actionTextColor="#f39c12"
            onAction={() => handleAction('appeal')}
          />
        </Grid>
      </Grid>
      <ViolationsTable violations={violations} />
    </DashboardLayout>
  );
};

export default StudentDashboard;