"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  Stack,
} from "@mui/material"
import {
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
} from "@mui/icons-material"

import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import { getViolationById } from "@/services/violation.service"
import { fetchUserProfile } from "@/redux/slices/userSlice"

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [dashboardData, setDashboardData] = useState({
    todaysViolationsCount: 0,
    totalViolationsCount: 0,
    offenseLevel: 0,
    violations: [],
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    if (!user.name) dispatch(fetchUserProfile())

    const fetchViolations = async () => {
      try {
        const res = await getViolationById(user.custom_id)
        const flaggedCount = res.violations.filter(
          (v) => v.status === "flagged" || v.status === "under review"
        ).length
        const offenseLevel = calculateOffenseLevel(flaggedCount)

        setDashboardData({
          todaysViolationsCount: res.todays_violations_count || 0,
          totalViolationsCount: res.total_violations_count || 0,
          offenseLevel,
          violations: res.violations || [],
        })
      } catch (error) {
        console.error("Failed to fetch violations:", error)
      }
    }

    if (user.custom_id) fetchViolations()
  }, [dispatch, user.name, user.custom_id])

  const calculateOffenseLevel = (count) => (count >= 3 ? 3 : count)

  const getOffenseLevelInfo = (level) => {
    switch (level) {
      case 1:
        return {
          color: "#f59e0b",
          action: "Letter of apology required",
          description: "Upload a letter of apology to change status to Under Review",
        }
      case 2:
        return {
          color: "#f97316",
          action: "Visit office required",
          description: "You will receive an SMS and notification to visit the office",
        }
      case 3:
        return {
          color: "#ef4444",
          action: "Gatepass suspended",
          description: "Your gatepass access has been disabled",
        }
      default:
        return {
          color: "#10b981",
          action: "No action required",
          description: "You have no current offenses",
        }
    }
  }

  const offenseInfo = getOffenseLevelInfo(dashboardData.offenseLevel)

  const processViolationsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()
    const speedData = Array(12).fill(0)
    const noiseData = Array(12).fill(0)

    dashboardData.violations.forEach((violation) => {
      if (!violation.detected_at) return
      const date = new Date(violation.detected_at)
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth()
        if (violation.speed > 30) speedData[month]++
        if (violation.decibel_level > 70) noiseData[month]++
      }
    })

    return {
      labels: months,
      speedData,
      noiseData,
    }
  }

  const chartData = processViolationsData()

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role="user" />
      <Box component="main" sx={{ flexGrow: 1, mt: "64px" }}>
        <Header onToggleSidebar={handleDrawerToggle} />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-end" },
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" color="black" mb={0.5}>
                Welcome back, {user.name || "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's an overview of your traffic violations
              </Typography>
            </Box>
            <Box
              sx={{
                mt: { xs: 2, md: 0 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#f1f5f9",
              }}
            >
              <CalendarIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Today's Violations",
                count: dashboardData.todaysViolationsCount,
                icon: <CalendarIcon sx={{ fontSize: 24, color: "#0ea5e9" }} />,
                color: "#0ea5e9",
                bg: "rgba(14, 165, 233, 0.1)",
                note:
                  dashboardData.todaysViolationsCount === 0
                    ? "No violations detected today"
                    : `${dashboardData.todaysViolationsCount} violation${dashboardData.todaysViolationsCount !== 1 ? "s" : ""} detected today`,
              },
              {
                title: "Total Violations",
                count: dashboardData.totalViolationsCount,
                icon: <WarningIcon sx={{ fontSize: 24, color: "#f97316" }} />,
                color: "#f97316",
                bg: "rgba(249, 115, 22, 0.1)",
                note:
                  dashboardData.totalViolationsCount === 0
                    ? "No violations on record"
                    : "Total violations on your record",
              },
              {
                title: "Offense Level",
                count: dashboardData.offenseLevel,
                icon: <InfoIcon sx={{ fontSize: 24, color: offenseInfo.color }} />,
                color: offenseInfo.color,
                bg: `${offenseInfo.color}15`,
                note: (
                  <>
                    <Typography variant="body2" fontWeight="medium" color={offenseInfo.color}>
                      {offenseInfo.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {offenseInfo.description}
                    </Typography>
                  </>
                ),
              },
            ].map(({ title, count, icon, color, bg, note }) => (
              <Card
                key={title}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    bgcolor: color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      {title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: bg,
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {icon}
                    </Box>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: "#0f172a" }}>
                    {count}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {typeof note === "string" ? (
                      <Typography variant="body2" color="text.secondary">{note}</Typography>
                    ) : (
                      note
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Monthly Violations
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <LegendItem color="rgba(239, 68, 68, 0.7)" label="Speed" />
                    <LegendItem color="rgba(245, 158, 11, 0.7)" label="Noise" />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3, height: 400 }}>
                <MonthlyViolationsChartInline data={chartData} />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}

const LegendItem = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
)

const MonthlyViolationsChartInline = ({ data }) => {
  useEffect(() => {
    let chart
    if (typeof window !== "undefined") {
      import("chart.js").then(({ Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }) => {
        Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
        const ctx = document.getElementById("violationsChart")
        if (ctx) {
          if (chart) chart.destroy()
          chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: data.labels,
              datasets: [
                {
                  label: "Speed Violations",
                  data: data.speedData,
                  backgroundColor: "rgba(239, 68, 68, 0.7)",
                  borderColor: "rgba(239, 68, 68, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Noise Violations",
                  data: data.noiseData,
                  backgroundColor: "rgba(245, 158, 11, 0.7)",
                  borderColor: "rgba(245, 158, 11, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            },
          })
        }
      })
    }

    return () => {
      if (chart) chart.destroy()
    }
  }, [data])

  return <canvas id="violationsChart" style={{ width: "100%", height: "100%" }}></canvas>
}

export default Dashboard
