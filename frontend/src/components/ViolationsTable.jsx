"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  TableContainer,
} from "@mui/material"

export const ViolationsTable = ({ violations = [] }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Function to determine the violation type
  const getViolationType = (speed, decibelLevel) => {
    const isSpeedViolation = speed > 10 // Speed exceeds 10 kph
    const isNoiseViolation = decibelLevel > 70 // Noise exceeds 70 dB

    if (isSpeedViolation && isNoiseViolation) {
      return "Speed & Noise"
    } else if (isSpeedViolation) {
      return "Speed"
    } else if (isNoiseViolation) {
      return "Noise"
    }
    return null // No violation type if neither condition is met
  }

  // Function to get chip styles based on violation type
  const getViolationChipStyles = (type) => {
    switch (type) {
      case "Speed & Noise":
        return { backgroundColor: "#f8d7da", color: "#721c24" }
      case "Speed":
        return { backgroundColor: "#d1ecf1", color: "#0c5460" }
      case "Noise":
        return { backgroundColor: "#fff3cd", color: "#856404" }
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" }
    }
  }

  // Function to get chip styles based on status
  const getStatusChipStyles = (status) => {
    switch (status) {
      case "flagged":
        return { backgroundColor: "#ffeeba", color: "#856404" }
      case "pending":
        return { backgroundColor: "#d1ecf1", color: "#0c5460" }
      case "cleared":
        return { backgroundColor: "#d4edda", color: "#155724" }
      case "reviewed":
        return { backgroundColor: "#cce5ff", color: "#004085" }
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" }
    }
  }

  if (violations.length === 0) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, backgroundColor: "#fff", textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50" }}>
          Recent Violations
        </Typography>
        <Typography sx={{ color: "#7f8c8d", fontStyle: "italic", py: 4 }}>No violations found</Typography>
      </Box>
    )
  }

  // Mobile view - card-based layout
  if (isMobile) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, backgroundColor: "#fff" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}>
          Recent Violations
        </Typography>

        {violations.map((violation, index) => {
          const violationType = getViolationType(violation.speed, violation.decibel_level)
          const violationChipStyles = getViolationChipStyles(violationType)
          const statusChipStyles = getStatusChipStyles(violation.status)

          return (
            <Card
              key={violation.id || index}
              sx={{
                mb: 2,
                borderRadius: 1,
                boxShadow: "none",
                border: "1px solid rgba(0,0,0,0.08)",
                "&:last-child": { mb: 0 },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {violation.plate_number}
                  </Typography>
                  <Chip
                    label={violation.status}
                    size="small"
                    sx={{
                      ...statusChipStyles,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      height: 24,
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(violation.detected_at).toLocaleString()}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Speed
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: violation.speed > 10 ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {violation.speed} / 10
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Noise
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: violation.decibel_level > 70 ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {violation.decibel_level} / 70
                    </Typography>
                  </Box>

                  <Chip
                    label={violationType}
                    size="small"
                    sx={{
                      ...violationChipStyles,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      height: 24,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    )
  }

  // Desktop view - table layout
  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, backgroundColor: "#fff" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}>
        Recent Violations
      </Typography>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650, borderCollapse: "separate", borderSpacing: "0 10px" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Plate Number</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Speed</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Noise Level</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Violation Type</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violations.map((violation, index) => {
              const violationType = getViolationType(violation.speed, violation.decibel_level)
              const violationChipStyles = getViolationChipStyles(violationType)
              const statusChipStyles = getStatusChipStyles(violation.status)

              return (
                <TableRow
                  key={violation.id || index}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "&:hover": { backgroundColor: "#f1f1f1" },
                    borderRadius: "10px",
                  }}
                >
                  <TableCell>{violation.plate_number}</TableCell>
                  <TableCell>{new Date(violation.detected_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: violation.speed > 10 ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {violation.speed} / 10
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: violation.decibel_level > 70 ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {violation.decibel_level} / 70
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={violationType}
                      sx={{
                        ...violationChipStyles,
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={violation.status}
                      sx={{
                        ...statusChipStyles,
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ViolationsTable
