import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Skeleton,
  Card,
  CardContent,
  Divider,
  Badge,
  Stack,
  Alert,
  Collapse,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
} from "@mui/icons-material";
import UserDetailsModal from "@/components/molecules/UserDetailsModal";
import { getViolations } from "@/services/violation.service";
import { showUser } from "@/services/user.service";

const ViolationsTable = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("flagged");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const apiUrl = "http://backend.test";

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const allViolations = await getViolations();
      setViolations(allViolations);
      setShowAlert(true);
      setAlertMessage("Violations loaded successfully");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error fetching violations:", error);
      setShowAlert(true);
      setAlertMessage("Failed to load violations");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (violation) => {
    setSelectedViolation(violation);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedViolation(null);
    setIsDialogOpen(false);
  };

  const handleOpenUserModal = async (userId) => {
    try {
      const userData = await showUser(userId);
      setSelectedUser(userData);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "flagged":
        return <WarningIcon fontSize="small" />;
      case "under review":
        return <WarningAmberIcon fontSize="small" />;
      case "cleared":
        return <CheckCircleIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "flagged":
        return "error";
      case "under review":
        return "warning";
      case "cleared":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredViolations = violations.filter(
    (violation) =>
      violation.status === tabValue &&
      (searchQuery === "" ||
        violation.custom_user_id
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        violation.plate_number
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const violationCounts = {
    flagged: violations.filter((v) => v.status === "flagged").length,
    "under review": violations.filter((v) => v.status === "under review")
      .length,
    cleared: violations.filter((v) => v.status === "cleared").length,
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Alert Message */}
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0d1b2a" }}>
          Traffic Violations
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search by ID or plate"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: "250px" } }}
          />

          <Tooltip title="Refresh data">
            <IconButton onClick={fetchViolations} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Status Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "200px" },
            cursor: "pointer",
            borderLeft: "4px solid #f44336",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
            bgcolor:
              tabValue === "flagged"
                ? "rgba(244, 67, 54, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("flagged")}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Flagged
              </Typography>
              <Badge badgeContent={violationCounts.flagged} color="error">
                <WarningIcon color="error" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#f44336" }}
            >
              {violationCounts.flagged}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "200px" },
            cursor: "pointer",
            borderLeft: "4px solid #ff9800",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
            bgcolor:
              tabValue === "under review"
                ? "rgba(255, 152, 0, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("under review")}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Under Review
              </Typography>
              <Badge
                badgeContent={violationCounts["under review"]}
                color="warning"
              >
                <WarningAmberIcon color="warning" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#ff9800" }}
            >
              {violationCounts["under review"]}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "200px" },
            cursor: "pointer",
            borderLeft: "4px solid #4caf50",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
            bgcolor:
              tabValue === "cleared"
                ? "rgba(76, 175, 80, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("cleared")}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Cleared
              </Typography>
              <Badge badgeContent={violationCounts.cleared} color="success">
                <CheckCircleIcon color="success" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#4caf50" }}
            >
              {violationCounts.cleared}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: "48px",
          },
        }}
      >
        <Tab
          value="flagged"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WarningIcon fontSize="small" />
              <span>Flagged</span>
              <Chip
                label={violationCounts.flagged}
                size="small"
                color="error"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
        <Tab
          value="under review"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WarningAmberIcon fontSize="small" />
              <span>Under Review</span>
              <Chip
                label={violationCounts["under review"]}
                size="small"
                color="warning"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
        <Tab
          value="cleared"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon fontSize="small" />
              <span>Cleared</span>
              <Chip
                label={violationCounts.cleared}
                size="small"
                color="success"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
      </Tabs>

      {/* Violations Table */}
      {loading ? (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Plate Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Speed</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Decibel Level</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={32} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    User ID
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DirectionsCarIcon fontSize="small" color="action" />
                    Plate Number
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    Date
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SpeedIcon fontSize="small" color="action" />
                    Speed
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VolumeUpIcon fontSize="small" color="action" />
                    Decibel Level
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredViolations.map((violation) => (
                <TableRow
                  key={violation.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1565c0",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        display: "inline-block",
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                          color: "#fff",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        handleOpenUserModal(violation.custom_user_id)
                      }
                    >
                      {violation.custom_user_id}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {violation.plate_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(violation.detected_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        fontWeight={violation.speed > 30 ? "bold" : "regular"}
                        color={
                          violation.speed > 30 ? "error.main" : "text.primary"
                        }
                      >
                        {violation.speed ?? "N/A"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        km/h
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        fontWeight={
                          violation.decibel_level > 85 ? "bold" : "regular"
                        }
                        color={
                          violation.decibel_level > 85
                            ? "error.main"
                            : "text.primary"
                        }
                      >
                        {violation.decibel_level ?? "N/A"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        dB
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(violation.status)}
                      label={violation.status.toUpperCase()}
                      color={getStatusColor(violation.status)}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor:
                          violation.status === "under review"
                            ? "pointer"
                            : "default",
                        "&:hover": {
                          opacity:
                            violation.status === "under review" ? 0.9 : 1,
                          transform:
                            violation.status === "under review"
                              ? "translateY(-1px)"
                              : "none",
                        },
                      }}
                      onClick={() =>
                        violation.status === "under review"
                          ? handleOpenDialog(violation)
                          : null
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {violation.letter_path && (
                        <Tooltip title="View Letter">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenDialog(violation)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredViolations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {tabValue === "flagged" && (
                        <WarningIcon fontSize="large" color="error" />
                      )}
                      {tabValue === "under review" && (
                        <WarningAmberIcon fontSize="large" color="warning" />
                      )}
                      {tabValue === "cleared" && (
                        <CheckCircleIcon fontSize="large" color="success" />
                      )}
                      <Typography variant="h6" color="text.secondary">
                        No {tabValue} violations found
                      </Typography>
                      {searchQuery && (
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search criteria
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => setSearchQuery("")}
                        sx={{ mt: 1 }}
                        startIcon={<RefreshIcon />}
                      >
                        Reset Search
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Viewing Uploaded Letter */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
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
            bgcolor: "#f5f7fa",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DownloadIcon color="primary" />
          Uploaded Letter
        </DialogTitle>
        <DialogContent sx={{ p: 3, minWidth: { sm: "500px" } }}>
          {selectedViolation?.letter_path ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Letter for Violation #{selectedViolation.id}
              </Typography>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed rgba(0,0,0,0.2)",
                  borderRadius: 1,
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  The letter has been uploaded and is available for review.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={`http://backend.test/storage/${selectedViolation.letter_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Letter
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                No letter has been uploaded for this violation.
              </Typography>
              <Button variant="outlined" color="primary" disabled>
                Upload Letter
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Modal */}
      <UserDetailsModal
        open={isUserModalOpen}
        onClose={handleCloseUserModal}
        user={selectedUser}
        apiUrl={apiUrl}
      />
    </Box>
  );
};

export default ViolationsTable;
