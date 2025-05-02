"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
} from "@mui/material"
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material"

const ViolationsTable = ({
  violations,
  violationCounts,
  activeTab,
  onTabChange,
  onAppeal,
  isLoading,
  isModalOpen,
  selectedFile,
  handleFileChange,
  handleUpload,
  handleCloseModal,
}) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "flagged":
        return {
          bg: "#ef4444",
          text: "white",
        }
      case "under review":
        return {
          bg: "#f59e0b",
          text: "white",
        }
      case "cleared":
        return {
          bg: "#10b981",
          text: "white",
        }
      default:
        return {
          bg: "#6b7280",
          text: "white",
        }
    }
  }

  return (
    <>
      {/* Status Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
        {/* Flagged Card */}
        <Card
          sx={{
            flex: { xs: "1 0 100%", sm: "1 0 30%", md: 1 },
            borderLeft: "4px solid #ef4444",
            cursor: "pointer",
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.05)",
            },
            position: "relative",
            overflow: "visible",
            p: 3,
          }}
          onClick={() => onTabChange("flagged")}
        >
          <Typography sx={{ color: "#6b7280" }}>Flagged</Typography>
          <Typography variant="h3" sx={{ color: "#ef4444", fontWeight: "bold", mt: 1 }}>
            {violationCounts.flagged}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#ef4444",
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 32 }} />
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {violationCounts.flagged}
            </Box>
          </Box>
        </Card>

        {/* Under Review Card */}
        <Card
          sx={{
            flex: { xs: "1 0 100%", sm: "1 0 30%", md: 1 },
            borderLeft: "4px solid #f59e0b",
            cursor: "pointer",
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(245, 158, 11, 0.05)",
            },
            position: "relative",
            overflow: "visible",
            p: 3,
          }}
          onClick={() => onTabChange("under review")}
        >
          <Typography sx={{ color: "#6b7280" }}>Under Review</Typography>
          <Typography variant="h3" sx={{ color: "#f59e0b", fontWeight: "bold", mt: 1 }}>
            {violationCounts["under review"]}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#f59e0b",
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 32 }} />
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "#f59e0b",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {violationCounts["under review"]}
            </Box>
          </Box>
        </Card>

        {/* Cleared Card */}
        <Card
          sx={{
            flex: { xs: "1 0 100%", sm: "1 0 30%", md: 1 },
            borderLeft: "4px solid #10b981",
            cursor: "pointer",
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(16, 185, 129, 0.05)",
            },
            position: "relative",
            overflow: "visible",
            p: 3,
          }}
          onClick={() => onTabChange("cleared")}
        >
          <Typography sx={{ color: "#6b7280" }}>Cleared</Typography>
          <Typography variant="h3" sx={{ color: "#10b981", fontWeight: "bold", mt: 1 }}>
            {violationCounts.cleared}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#10b981",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "#10b981",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {violationCounts.cleared}
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderBottom: activeTab === "flagged" ? "2px solid #ef4444" : "none",
            color: activeTab === "flagged" ? "#111827" : "#6b7280",
            cursor: "pointer",
            "&:hover": {
              color: "#111827",
            },
          }}
          onClick={() => onTabChange("flagged")}
        >
          <ErrorOutlineIcon sx={{ fontSize: 20, mr: 1, color: "#ef4444" }} />
          <Typography>Flagged</Typography>
          <Box
            sx={{
              ml: 1,
              bgcolor: "#ef4444",
              color: "white",
              borderRadius: 10,
              px: 1,
              fontSize: 12,
              minWidth: 24,
              textAlign: "center",
            }}
          >
            {violationCounts.flagged}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderBottom: activeTab === "under review" ? "2px solid #f59e0b" : "none",
            color: activeTab === "under review" ? "#111827" : "#6b7280",
            cursor: "pointer",
            "&:hover": {
              color: "#111827",
            },
          }}
          onClick={() => onTabChange("under review")}
        >
          <WarningAmberIcon sx={{ fontSize: 20, mr: 1, color: "#f59e0b" }} />
          <Typography>Under Review</Typography>
          <Box
            sx={{
              ml: 1,
              bgcolor: "#f59e0b",
              color: "white",
              borderRadius: 10,
              px: 1,
              fontSize: 12,
              minWidth: 24,
              textAlign: "center",
            }}
          >
            {violationCounts["under review"]}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderBottom: activeTab === "cleared" ? "2px solid #10b981" : "none",
            color: activeTab === "cleared" ? "#111827" : "#6b7280",
            cursor: "pointer",
            "&:hover": {
              color: "#111827",
            },
          }}
          onClick={() => onTabChange("cleared")}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 20, mr: 1, color: "#10b981" }} />
          <Typography>Cleared</Typography>
          <Box
            sx={{
              ml: 1,
              bgcolor: "#10b981",
              color: "white",
              borderRadius: 10,
              px: 1,
              fontSize: 12,
              minWidth: 24,
              textAlign: "center",
            }}
          >
            {violationCounts.cleared}
          </Box>
        </Box>
      </Box>

      {/* Violations Table */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      ) : violations.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#ffffff",
            borderRadius: 1,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
            No {activeTab} violations found
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            When violations are {activeTab}, they will appear here.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 1,
            border: "1px solid #e5e7eb",
            mb: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
                    User ID
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DirectionsCarIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
                    Plate Number
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
                    Date
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SpeedIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
                    Speed
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <VolumeUpIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
                    Decibel Level
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {violations.map((row) => {
                const isSpeedViolation = row.speed > 10
                const isNoiseViolation = row.decibel_level > 70
                const statusColor = getStatusColor(row.status)

                return (
                  <TableRow
                    key={row.id || row._id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                      "& td": {
                        borderBottom: "1px solid #e5e7eb",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          bgcolor: "#f3f4f6",
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        {row.custom_user_id || "GP0001"}
                      </Box>
                    </TableCell>
                    <TableCell>{row.plate_number || "LAB-3067"}</TableCell>
                    <TableCell>{new Date(row.detected_at || new Date()).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            color: isSpeedViolation ? "#ef4444" : "#10b981",
                            fontWeight: "bold",
                          }}
                        >
                          {row.speed || 14.08}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          km/h
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            color: isNoiseViolation ? "#ef4444" : "#10b981",
                            fontWeight: "bold",
                          }}
                        >
                          {row.decibel_level || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          dB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status?.toUpperCase() || "FLAGGED"}
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            sx={{
                              color: "#3b82f6",
                              "&:hover": {
                                bgcolor: "rgba(59, 130, 246, 0.1)",
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {row.status !== "cleared" && (
                          <Tooltip title="Appeal Violation">
                            <IconButton
                              size="small"
                              onClick={() => onAppeal(row.id || row._id)}
                              sx={{
                                color: "#f59e0b",
                                "&:hover": {
                                  bgcolor: "rgba(245, 158, 11, 0.1)",
                                },
                              }}
                            >
                              <UploadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Uploading PDF */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Appeal Violation
          </Typography>
          <Typography variant="body2" gutterBottom color="textSecondary">
            Please upload your apology letter in PDF format to appeal this violation.
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: ".pdf" }}
            onChange={handleFileChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ color: "#6b7280" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile}
              sx={{
                bgcolor: "#3b82f6",
                "&:hover": {
                  bgcolor: "#2563eb",
                },
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ViolationsTable
