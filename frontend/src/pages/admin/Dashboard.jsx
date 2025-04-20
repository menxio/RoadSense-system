import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import ChartCard from "@/components/molecules/ChartCard";
import {
  CalendarMonth as CalendarIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { getViolations } from "@/services/violation.service";
import { getUsers } from "@/services/user.service";

const Dashboard = () => {
  const user = { firstName: "Admin", lastName: "User" }; // Temp admin
  const [stats, setStats] = useState({
    todayViolations: 0,
    totalUsers: 0,
    totalViolations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [violationData, userData] = await Promise.all([
          getViolations(),
          getUsers(),
        ]);

        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        const todayViolations = violationData.filter((v) =>
          v.detected_at.startsWith(today)
        ).length;

        setStats({
          todayViolations,
          totalUsers: userData.length,
          totalViolations: violationData.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          ml: "240px", // sidebar width
          flexGrow: 1,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header user={user} />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Typography variant="h3" sx={{ mb: 4, color: "#5a6a7a" }}>
            Welcome {user.firstName} {user.lastName}!
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Today's Violations"
                value={stats.todayViolations}
                icon={<CalendarIcon fontSize="large" />}
                buttonColor="primary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Driver's Listed"
                value={stats.totalUsers}
                icon={<GroupIcon fontSize="large" />}
                buttonColor="success"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Traffic Violations"
                value={stats.totalViolations}
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
