"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Typography, Grid, Box } from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  ExitToApp as LogOutIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import { DashboardLayout } from "../../components/DashboardLayout"
import StatCard from "../../components/molecules/StatCard"
import { ViolationsTable } from "../../components/ViolationsTable"
import { getViolationById } from "@/services/violation.service"
import { fetchUserProfile } from "../../redux/slices/userSlice"

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [violations, setViolations] = useState({
    todaysViolationsCount: 0,
    totalViolationsCount: 0,
    violations: [],
  })

  const sidebarItems = [
    { icon: <DashboardIcon fontSize="small" />, label: "Dashboard", path: "/dashboard" },
    { icon: <WarningIcon fontSize="small" />, label: "Violation List", path: "/violations" },
    { icon: <LogOutIcon fontSize="small" />, label: "Logout", path: "/logout" },
  ]

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile())
    }

    const fetchViolations = async () => {
      try {
        const res = await getViolationById(user.custom_id)
        setViolations({
          todaysViolationsCount: res.todays_violations_count,
          totalViolationsCount: res.total_violations_count,
          violations: res.violations,
        })
      } catch (error) {
        console.error("Failed to fetch violations:", error)
      }
    }

    if (user.custom_id) {
      fetchViolations()
    }
  }, [dispatch, user.name, user.custom_id])

  return (
    <DashboardLayout
      logo="RoadSense"
      sidebarItems={sidebarItems}
      activePath="/dashboard"
      onNavigate={(path) => console.log(`Navigate to: ${path}`)}
      userName={user.name}
      userRole={user.role}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
            Welcome, {user.name || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your traffic violations.
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Today's Violations"
              value={violations.todaysViolationsCount || "0"}
              icon={<CalendarIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Violations"
              value={violations.totalViolationsCount || "0"}
              icon={<WarningIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Offense Level"
              value="0"
              icon={<InfoIcon />}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Violations Table Section */}
        <Box>
          <Typography variant="h6" fontWeight="medium" color="text.primary" mb={2}>
            Violation History
          </Typography>
          <ViolationsTable violations={violations.violations} />
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default Dashboard
