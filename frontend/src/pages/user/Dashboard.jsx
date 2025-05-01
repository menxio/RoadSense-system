"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Typography, Grid, Box } from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  ExitToApp as LogOutIcon,
  CalendarMonth as CalendarIcon,
  Error as AlertCircleIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
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
  })

  const sidebarItems = [
    {
      icon: <DashboardIcon fontSize="small" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <WarningIcon fontSize="small" />,
      label: "Violation List",
      path: "/violations",
    },
    {
      icon: <LogOutIcon fontSize="small" />,
      label: "Logout",
      path: "/logout",
    },
  ]

  const handleNavigate = (path) => {
    console.log(`Navigate to: ${path}`)
  }

  const handleAction = (action) => {
    console.log(`Action: ${action}`)
  }

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile())
    }

    const fetchUserViolations = async () => {
      try {
        const violationsResponse = await getViolationById(user.custom_id)

        setViolations({
          todaysViolationsCount: violationsResponse.todays_violations_count,
          totalViolationsCount: violationsResponse.total_violations_count,
          violations: violationsResponse.violations,
        })
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    if (user.custom_id) {
      fetchUserViolations()
    }
  }, [dispatch, user.name, user.custom_id])

  return (
    <DashboardLayout
      logo="RoadSense"
      sidebarItems={sidebarItems}
      activePath="/dashboard"
      onNavigate={handleNavigate}
      userName={user.name}
      userRole={user.role}
    >
      <Box sx={{ 
        width: "100%", 
        maxWidth: "1200px", 
        mx: "auto", 
        px: { xs: 2, sm: 3, md: 4 } 
      }}>
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
            Welcome, {user.name || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your traffic violations.
          </Typography>
        </Box>

        {/* Statistics Section */}
        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            justifyContent: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Today's Violations"
              value={violations?.todaysViolationsCount || "0"}
              icon={<CalendarIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Violations"
              value={violations?.totalViolationsCount || "0"}
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

        {/* Violations Table */}
        <Box sx={{ mb: 4 }}>
          <ViolationsTable violations={violations.violations || []} />
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default Dashboard
