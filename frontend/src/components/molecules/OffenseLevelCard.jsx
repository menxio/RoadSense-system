"use client"

import { useState } from "react"
import { Box, Card, CardContent, Typography, Tooltip, IconButton } from "@mui/material"
import { Info as InfoIcon } from "@mui/icons-material"
import OffenseLevelDialog from "./OffenseLevelDialog"

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

const OffenseLevelCard = ({ level = 0 }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { color, action, description } = getOffenseLevelInfo(level)

  return (
    <>
      <Card
        sx={{
          height: "100%",
          borderTop: `4px solid ${color}`,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Offense Level
            </Typography>
            <Tooltip title="View offense escalation details">
              <IconButton size="small" onClick={() => setDialogOpen(true)}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", color }}>
              {level}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${color}15`,
                borderRadius: "50%",
                width: 56,
                height: 56,
                color: color,
              }}
            >
              <InfoIcon sx={{ fontSize: 32 }} />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {action}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <OffenseLevelDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}

export default OffenseLevelCard
