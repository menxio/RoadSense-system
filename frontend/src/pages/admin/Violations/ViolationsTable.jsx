import { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import CustomBadge from "@/components/atoms/CustomBadge";
import StatusChip from "@/components/atoms/StatusChip";
import TableHeaderCell from "@/components/atoms/TableHeaderCell";
import AlertMessage from "@/components/molecules/AlertMessage";
import TableHeader from "@/components/molecules/TableHeader";
import StatusCards from "@/components/molecules/StatusCards";
import StatusTabs from "@/components/molecules/StatusTabs";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import UserDetailsModal from "@/components/molecules/UserDetailsModal";
import DataTable from "@/components/organisms/DataTable";
import { getViolations, updateViolation } from "@/services/violation.service";
import { showUser } from "@/services/user.service";
import {
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  DirectionsCar as DirectionsCarIcon,
} from "@mui/icons-material";

const ViolationsTable = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("flagged");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClearConfirmationOpen, setIsClearConfirmationOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiUrl = "http://backend.test";

  useEffect(() => {
    fetchViolations();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tabValue, searchQuery]);

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

  const handleOpenClearConfirmation = (violation) => {
    setSelectedViolation(violation);
    setIsClearConfirmationOpen(true);
  };

  const handleCloseClearConfirmation = () => {
    setIsClearConfirmationOpen(false);
  };

  const handleClearViolation = async (violation) => {
    try {
      await updateViolation(violation.id, { status: "cleared" });
      setViolations((prev) =>
        prev.map((v) =>
          v.id === violation.id ? { ...v, status: "cleared" } : v
        )
      );
      setAlertMessage("Violation marked as cleared successfully!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error clearing violation:", error);
      setAlertMessage("Failed to clear the violation.");
      setAlertSeverity("error");
    } finally {
      setIsClearConfirmationOpen(false);
      setShowAlert(true);
    }
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
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

  const tableColumns = [
    <TableHeaderCell
      key="user-id"
      icon={<PersonIcon fontSize="small" color="action" />}
    >
      User ID
    </TableHeaderCell>,
    <TableHeaderCell
      key="plate-number"
      icon={<DirectionsCarIcon fontSize="small" color="action" />}
    >
      Plate Number
    </TableHeaderCell>,
    <TableHeaderCell
      key="date"
      icon={<CalendarTodayIcon fontSize="small" color="action" />}
    >
      Date
    </TableHeaderCell>,
    <TableHeaderCell
      key="speed"
      icon={<SpeedIcon fontSize="small" color="action" />}
    >
      Speed
    </TableHeaderCell>,
    <TableHeaderCell
      key="decibel"
      icon={<VolumeUpIcon fontSize="small" color="action" />}
    >
      Decibel Level
    </TableHeaderCell>,
    "Status",
    "Actions",
  ];

  const renderViolationRow = (violation) => (
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
        <CustomBadge
          onClick={() => handleOpenUserModal(violation.custom_user_id)}
        >
          {violation.custom_user_id}
        </CustomBadge>
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
            color={violation.speed > 30 ? "error.main" : "text.primary"}
          >
            {violation.speed ?? "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            km/h
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            fontWeight={violation.decibel_level > 85 ? "bold" : "regular"}
            color={violation.decibel_level > 85 ? "error.main" : "text.primary"}
          >
            {violation.decibel_level ?? "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            dB
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <StatusChip
          status={violation.status}
          onClick={
            violation.status === "under review"
              ? () => handleOpenDialog(violation)
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
  );

  const emptyStateConfig = {
    icon:
      tabValue === "flagged" ? (
        <WarningIcon fontSize="large" color="error" />
      ) : tabValue === "under review" ? (
        <WarningAmberIcon fontSize="large" color="warning" />
      ) : (
        <CheckCircleIcon fontSize="large" color="success" />
      ),
    message: `No ${tabValue} violations found`,
    subMessage: searchQuery ? "Try adjusting your search criteria" : null,
    onReset: () => setSearchQuery(""),
    colSpan: 7,
  };

  const tabsConfig = [
    { value: "flagged", label: "Flagged", count: violationCounts.flagged },
    {
      value: "under review",
      label: "Under Review",
      count: violationCounts["under review"],
    },
    { value: "cleared", label: "Cleared", count: violationCounts.cleared },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Alert Message */}
      <AlertMessage
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />

      {/* Header Section */}
      <TableHeader
        title="Traffic Violations"
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onRefresh={fetchViolations}
        searchPlaceholder="Search by ID or plate"
      />

      {/* Status Cards */}
      <StatusCards
        counts={violationCounts}
        activeTab={tabValue}
        onTabChange={(tab) => setTabValue(tab)}
      />

      {/* Tabs */}
      <StatusTabs
        value={tabValue}
        onChange={handleTabChange}
        tabsConfig={tabsConfig}
      />

      {/* Violations Table with Pagination */}
      <DataTable
        columns={tableColumns}
        data={filteredViolations}
        loading={loading}
        emptyState={emptyStateConfig}
        renderRow={renderViolationRow}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        paginationEnabled={true}
      />

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
            variant="contained"
            color="success"
            size="small"
            sx={{ ml: 2 }}
            onClick={() => handleOpenClearConfirmation(selectedViolation)}
          >
            Clear Violation
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        open={isClearConfirmationOpen}
        title="Confirm Action"
        message="Are you sure you want to mark this violation as cleared?"
        onConfirm={() => handleClearViolation(selectedViolation)}
        onCancel={handleCloseClearConfirmation}
        confirmText="Confirm"
        confirmColor="success"
      />

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
