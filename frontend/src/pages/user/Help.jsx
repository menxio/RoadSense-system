"use client"

import { useState } from "react"
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Card,
  CardContent,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpOutlineIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  DirectionsCar as DirectionsCarIcon,
  CalendarMonth as CalendarIcon,
  Flag as FlagIcon,
  Refresh as RefreshIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@mui/icons-material"

import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"

const HelpPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState("panel1")

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role="user" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          transition: "margin 0.2s, width 0.2s",
        }}
      >
        <Header onToggleSidebar={handleDrawerToggle} />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Help Header */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              bgcolor: "#f1f5f9",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <HelpOutlineIcon fontSize="large" color="primary" />
              <Typography variant="h4" fontWeight="bold">
                Help & Information
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Welcome to the Roadsense Traffic Monitoring System. This guide will help you understand how to use the
              dashboard and interpret the information provided.
            </Typography>
          </Paper>

          {/* Help Content */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel1" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <InfoIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 Overview
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    This system allows you to view and monitor any traffic or policy violations recorded under your profile.
                    You can track the status of your violations, understand your offense level, and respond to flagged
                    incidents.
                  </Typography>
                  <Typography variant="body1">
                    The dashboard provides real-time information about your violations, helping you stay informed about your
                    status and any actions required from your end.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel2" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <DashboardIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 Dashboard Sections
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <CalendarIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Today's Violations"
                        secondary="Shows how many violations have been recorded today. This helps you stay updated on recent incidents."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Total Violations"
                        secondary="Shows the total number of violations associated with your ID across all time periods."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <InfoIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Offense Level"
                        secondary="Indicates your current standing based on the number of active violations."
                      />
                    </ListItem>
                    <Box sx={{ pl: 7, mt: 1 }}>
                      <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#10b981",
                            mr: 1,
                          }}
                        />
                        <strong>Level 0 (Low):</strong> 0 flagged or under review violations
                      </Typography>
                      <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#f59e0b",
                            mr: 1,
                          }}
                        />
                        <strong>Level 1 (Caution):</strong> 1-2 flagged or under review violations
                      </Typography>
                      <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#f97316",
                            mr: 1,
                          }}
                        />
                        <strong>Level 2 (Warning):</strong> 3-4 flagged or under review violations
                      </Typography>
                      <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#ef4444",
                            mr: 1,
                          }}
                        />
                        <strong>Level 3 (Critical):</strong> 5 or more flagged or under review violations
                      </Typography>
                    </Box>
                    <Divider component="li" sx={{ mt: 2 }} />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <RefreshIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Monthly Violations Chart"
                        secondary="Visualizes your violations over time, helping you identify patterns and track improvements."
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel3" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <FlagIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 Violation Statuses
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <WarningIcon sx={{ color: "#ef4444" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Flagged
                          </Typography>
                        }
                        secondary="Violation has been marked and will impact your offense level. This requires your attention."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <RefreshIcon sx={{ color: "#f59e0b" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Under Review
                          </Typography>
                        }
                        secondary="Violation is being reviewed by the admin and still impacts your offense level. You've taken action, and we're processing your response."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: "#10b981" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Cleared
                          </Typography>
                        }
                        secondary="Violation has been resolved and no longer affects your offense level. No further action is required."
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel4" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 What You Can Do
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <InfoIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="View details of each violation including date, time, and nature of the offense." />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <RefreshIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Monitor the review progress of any flagged issues." />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <WarningIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Check your offense level to understand your current standing." />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <DashboardIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Stay informed—updates will reflect once the admin reviews your violations." />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <UploadIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Submit appeals for flagged violations by uploading supporting documents." />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel5" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <QuestionAnswerIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 FAQs
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Q: Why is my offense level high?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      A: It is based on the number of violations that are either flagged or under review. To lower your
                      offense level, you need to address these violations by submitting appeals or following the required
                      actions.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Q: Can I dispute a violation?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      A: Yes, you can appeal flagged violations. Navigate to the Violations page, find the violation you
                      wish to dispute, and click the "Appeal" button. You'll need to upload supporting documentation
                      explaining why you believe the violation should be reviewed.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Q: How often is the data updated?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      A: The dashboard updates automatically whenever new data is available or upon refresh. For the most
                      current information, you can manually refresh the page.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Q: What happens when I reach Offense Level 3?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      A: At Offense Level 3, your gatepass access will be suspended. You'll need to contact the
                      administration to discuss the steps required to reinstate your access privileges.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Q: How long do violations stay on my record?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      A: Cleared violations remain on your record for historical purposes but no longer affect your offense
                      level. Flagged and under review violations will continue to impact your offense level until they are
                      cleared.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
                sx={{ mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "8px !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: "8px", bgcolor: expanded === "panel6" ? "rgba(14, 165, 233, 0.05)" : "transparent" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <DirectionsCarIcon color="primary" />
                    <Typography variant="h6" fontWeight="medium">
                      🔹 Types of Violations
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <SpeedIcon sx={{ color: "#ef4444" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Speed Violations
                          </Typography>
                        }
                        secondary="Recorded when your vehicle exceeds the speed limit. Violations are categorized based on how much you exceeded the limit."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <VolumeUpIcon sx={{ color: "#f59e0b" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Noise Violations
                          </Typography>
                        }
                        secondary="Recorded when your vehicle produces noise above the permitted decibel level. This could be due to modified exhaust systems or other factors."
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <DirectionsCarIcon sx={{ color: "#0ea5e9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            Other Traffic Violations
                          </Typography>
                        }
                        secondary="Includes violations such as improper parking, unauthorized access, or other policy infractions detected by the system."
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}

// Import this icon separately to avoid circular dependency
const UploadIcon = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: color === "primary" ? "#0ea5e9" : "currentColor" }}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export default HelpPage
