import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import StatCard from '@/components/molecules/StatCard';
import ChartCard from '@/components/molecules/ChartCard';
import { 
  CalendarMonth as CalendarIcon, 
  Group as GroupIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const user = { firstName: 'Admin', lastName: 'User' }; // temp

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header user={user} />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Typography variant="h3" sx={{ mb: 4, color: '#5a6a7a' }}>
            Welcome {user.firstName} {user.lastName}!
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Today's Violations" 
                value="0" 
                icon={<CalendarIcon fontSize="large" />}
                buttonColor="primary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Driver's Listed" 
                value="0" 
                icon={<GroupIcon fontSize="large" />}
                buttonColor="success"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Total Traffic Violations" 
                value="0" 
                icon={<WarningIcon fontSize="large" />}
                buttonColor="warning"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <ChartCard title="Violation Distribution" />
            </Grid>
            <Grid item xs={12} md={5}>
              <ChartCard title="Monthly Violations" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;