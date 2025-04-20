import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import {
  LayoutDashboardIcon,
  AlertTriangleIcon,
  LogOutIcon,
  CalendarIcon,
  AlertCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatsCard } from '../../components/StatsCard';
import { ViolationsTable } from '../../components/ViolationsTable';
import api from 'utils/api'; 
import { getViolationById } from '@/services/violation.service';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'Rosmar',
    role: 'Student',
  });

  const [violations, setViolations] = useState([]); // State to store violations
  const [todaysViolationsCount, setTodaysViolationsCount] = useState(0); // State for today's violations count
  const [totalViolationsCount, setTotalViolationsCount] = useState(0); // State for total violations count

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

  const handleNavigate = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  const handleAction = (action) => {
    console.log(`Action: ${action}`);
  };

  // Fetch user data and violations when the component mounts
  useEffect(() => {
    const fetchUserDataAndViolations = async () => {
      try {
        // Fetch user data
        // const userResponse = await api.get('/user'); // Replace with your API endpoint
        // const userData = userResponse.data;
        // setUser({
        //   name: userData.name,
        //   role: userData.role,
        // });

        // Fetch violations for the user's custom_user_id
        const violationsResponse = await getViolationById('GP0003'); // Replace with the actual custom_user_id

        console.log('Violations Response:', violationsResponse); // Log the response for debugging

        // setViolations(violationsData.violations); // Set violations
        setTodaysViolationsCount(violationsResponse.todays_violations_count);
        console.log(todaysViolationsCount);
        setTotalViolationsCount(violationsResponse.total_violations_count); 
        console.log(totalViolationsCount);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchUserDataAndViolations();
  }, []);

  return (
    <DashboardLayout
      logo="RoadSense"
      sidebarItems={sidebarItems}
      activePath="/dashboard"
      onNavigate={handleNavigate}
      userName={user.name}
      userRole={user.role}
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
        spacing={3}
        sx={{
          mb: 4,
        }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<CalendarIcon size={24} />}
            title="Today's Violations"
            value={todaysViolationsCount} // Display today's violations count
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
            value={totalViolationsCount} // Display total violations count
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
      <ViolationsTable violations={violations} /> {/* Pass violations to the table */}
    </DashboardLayout>
  );
};

export default Dashboard;