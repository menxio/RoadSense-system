import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { fetchUserProfile } from '../../redux/slices/userSlice';

const Dashboard = () => {
   const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Get user data from Redux store
;
  const [violations, setViolations] = useState({
    todaysViolationsCount: 0,
    totalViolationsCount: 0,
  }); // State to hold violations data
 

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
    if(!user.name) {
      dispatch(fetchUserProfile);
    }

    const fetchUserViolations = async () => {
      try {
        const violationsResponse = await getViolationById(user.custom_id); 

        setViolations({
          todaysViolationsCount: violationsResponse.todays_violations_count,
          totalViolationsCount: violationsResponse.total_violations_count,
          violations: violationsResponse.violations,
        });

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchUserViolations();
  }, [dispatch, user.name]);

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
        Welcome, {user.name || 'User...'}!
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
            value= {violations?.todaysViolationsCount | "0"}// Display today's violations count
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
            value={violations?.totalViolationsCount | "0"} // Display total violations count
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
      <ViolationsTable violations={violations.violations || []} /> {/* Pass violations to the table */}
    </DashboardLayout>
  );
};

export default Dashboard;