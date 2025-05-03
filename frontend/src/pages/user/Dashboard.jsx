"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Typography, Box, useTheme, useMediaQuery, Grid, Container, Card, CardContent } from "@mui/material"
import { Warning as WarningIcon, CalendarMonth as CalendarIcon, Info as InfoIcon } from "@mui/icons-material"

import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import { getViolationById } from "@/services/violation.service"
import { fetchUserProfile } from "@/redux/slices/userSlice"

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

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
    if (!user.name) {
      dispatch(fetchUserProfile())
    }

    const fetchViolations = async () => {
      try {
        const res = await getViolationById(user.custom_id)

        const flaggedCount = res.violations.filter((v) => v.status === "flagged" || v.status === "under review").length
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

    if (user.custom_id) {
      fetchViolations()
    }
  }, [dispatch, user.name, user.custom_id])

  const calculateOffenseLevel = (offenseCount) => {
    if (offenseCount >= 3) return 3
    if (offenseCount >= 2) return 2
    if (offenseCount >= 1) return 1
    return 0
  }

  // Get offense level info
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

  // Process violations data for chart
  const processViolationsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()

    // Initialize data arrays
    const speedData = Array(12).fill(0)
    const noiseData = Array(12).fill(0)

    // Count violations by month and type
    dashboardData.violations.forEach((violation) => {
      const date = new Date(violation.detected_at)
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth()

        // Determine violation type (simplified logic - adjust as needed)
        if (violation.speed > 30) {
          speedData[month]++
        }
        if (violation.decibel_level > 70) {
          noiseData[month]++
        }
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
        <Header onToggleSidebar={handleDrawerToggle} />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-end" },
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5, color: "black" }}>
                Welcome back, {user.name || "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's an overview of your traffic violations
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: { xs: 2, md: 0 },
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

          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Today's Violations */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
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
                    bgcolor: "#0ea5e9",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" color="text.secondary" fontWeight="medium">
                      Today's Violations
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(14, 165, 233, 0.1)",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 24, color: "#0ea5e9" }} />
                    </Box>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: "#0f172a" }}>
                    {dashboardData.todaysViolationsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {dashboardData.todaysViolationsCount === 0
                      ? "No violations detected today"
                      : `${dashboardData.todaysViolationsCount} violation${
                          dashboardData.todaysViolationsCount !== 1 ? "s" : ""
                        } detected today`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Violations */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
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
                    bgcolor: "#f97316",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" color="text.secondary" fontWeight="medium">
                      Total Violations
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(249, 115, 22, 0.1)",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <WarningIcon sx={{ fontSize: 24, color: "#f97316" }} />
                    </Box>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: "#0f172a" }}>
                    {dashboardData.totalViolationsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {dashboardData.totalViolationsCount === 0
                      ? "No violations on record"
                      : `Total violations on your record`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Offense Level */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
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
                    bgcolor: offenseInfo.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" color="text.secondary" fontWeight="medium">
                      Offense Level
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${offenseInfo.color}15`,
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 24, color: offenseInfo.color }} />
                    </Box>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: "#0f172a" }}>
                    {dashboardData.offenseLevel}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium" color={offenseInfo.color}>
                      {offenseInfo.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {offenseInfo.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Monthly Violations
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "rgba(239, 68, 68, 0.7)",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Speed
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "rgba(245, 158, 11, 0.7)",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Noise
                      </Typography>
                    </Box>
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

// Inline chart component to avoid external dependencies
const MonthlyViolationsChartInline = ({ data }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chart.js").then(({ Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }) => {
        Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

        const ctx = document.getElementById("violationsChart")
        if (ctx) {
          const chartInstance = new Chart(ctx, {
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
                legend: {
                  display: false,
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                  grid: {
                    drawBorder: false,
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
            },
          })

          return () => {
            chartInstance.destroy()
          }
        }
      })
    }
  }, [data])

  return <canvas id="violationsChart" />
}

export default Dashboard
