"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

const offenseData = [
  {
    level: "1st",
    action: "Letter of apology",
    behavior: "User uploads DOCX/PDF → Status: Under Review",
  },
  {
    level: "2nd",
    action: "SMS + Notification to visit office",
    behavior: "Automate sends notification (SMS API/ notif in web), admin logs visit",
  },
  {
    level: "3rd",
    action: "Gatepass suspended",
    behavior: "Admin sets suspended flag on user account, disables gatepass access",
  },
]

const OffenseLevelDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Offense Escalation Logic
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Offense</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>System Behavior</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offenseData.map((row) => (
                <TableRow key={row.level}>
                  <TableCell sx={{ fontWeight: "medium" }}>{row.level}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.behavior}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

export default OffenseLevelDialog
