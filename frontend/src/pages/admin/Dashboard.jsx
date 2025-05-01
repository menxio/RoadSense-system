import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import ChartCard from "@/components/molecules/ChartCard";
import { getViolations } from "@/services/violation.service";
import { getUsers } from "@/services/user.service";
import { fetchUserProfile } from "@/redux/slices/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({
    todayViolations: 0,
    totalUsers: 0,
    totalViolations: 0,
    speedViolations: 0,
    noiseViolations: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile());
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [violationData, userData] = await Promise.all([
          getViolations(),
          getUsers(),
        ]);

        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        const todayViolations = violationData.filter((v) =>
          v.detected_at.startsWith(today)
        ).length;

        const speedViolations = violationData.filter(
          (v) => v.speed && v.speed > 30
        ).length;
        const noiseViolations = violationData.filter(
          (v) => v.decibel_level && v.decibel_level > 85
        ).length;

        setStats({
          todayViolations,
          totalUsers: userData.length,
          totalViolations: violationData.length,
          speedViolations,
          noiseViolations,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch, user.name]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Header user={user} onToggleSidebar={handleDrawerToggle} />

        <Box
          sx={{
            py: 3,
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: "100%",
          }}
        >
          {/* Welcome Section */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#0d1b2a",
                mb: 1,
              }}
            >
              Welcome {user.firstName || user.name || "User"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your traffic monitoring system today.
            </Typography>
          </Box>

          {/* Statistics Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Today's Violations"
                value={stats.todayViolations}
                icon={<CalendarIcon fontSize="large" />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Driver's Listed"
                value={stats.totalUsers}
                icon={<GroupIcon fontSize="large" />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Traffic Violations"
                value={stats.totalViolations}
                icon={<WarningIcon fontSize="large" />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Speed Violations"
                value={stats.speedViolations}
                icon={<SpeedIcon fontSize="large" />}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Noise Violations"
                value={stats.noiseViolations}
                icon={<VolumeUpIcon fontSize="large" />}
                color="info"
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <ChartCard title="Violation Distribution" />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Monthly Violations" />
            </Grid>
          </Grid>

          {/* Recent Activity Section */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  height: "300px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
                >
                  Recent Activity
                </Typography>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Recent activity data will be displayed here
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
