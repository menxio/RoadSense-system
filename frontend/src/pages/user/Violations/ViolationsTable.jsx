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
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import CustomBadge from "@/components/atoms/CustomBadge";
import StatusChip from "@/components/atoms/StatusChip";
import TableHeaderCell from "@/components/atoms/TableHeaderCell";
import AlertMessage from "@/components/molecules/AlertMessage";
import TableHeader from "@/components/molecules/TableHeader";
import StatusCards from "@/components/molecules/StatusCards";
import StatusTabs from "@/components/molecules/StatusTabs";
import DataTable from "@/components/organisms/DataTable";
import {
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  DirectionsCar as DirectionsCarIcon,
} from "@mui/icons-material";

const ViolationsTable = ({ violations = [], onAppeal, isLoading = false }) => {
  const [tabValue, setTabValue] = useState("flagged");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [tabValue, searchQuery]);

  useEffect(() => {
    if (!isLoading && violations.length > 0) {
      setNotifMessage("Violations loaded successfully!");
      setAlertSeverity("success");
      setShowNotif(true);
    }
  }, [violations, isLoading]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenAppealDialog = (violation) => {
    setSelectedViolation(violation);
    setSelectedFile(null);
    setIsAppealDialogOpen(true);
  };

  const handleCloseAppealDialog = () => {
    setSelectedViolation(null);
    setIsAppealDialogOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmitAppeal = async () => {
    try {
      if (selectedViolation && onAppeal) {

        const formData = new FormData();

        if (selectedFile) {
          formData.append("letter", selectedFile);
        }
        formData.append("status", "under review");

        await onAppeal(selectedViolation.id || selectedViolation._id, formData);
        setAlertMessage("Appeal submitted successfully!");
        setAlertSeverity("success");
        setShowAlert(true);
        setIsAppealDialogOpen(false);
      }
    } catch (error) {
      console.error("Error submitting appeal:", error);
      setAlertMessage("Failed to submit appeal.");
      setAlertSeverity("error");
      setShowAlert(true);
    }
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
        (violation.custom_user_id &&
          violation.custom_user_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (violation.plate_number &&
          violation.plate_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase())))
  );

  const violationCounts = {
    flagged: violations.filter((v) => v.status === "flagged").length,
    "under review": violations.filter((v) => v.status === "under review").length,
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
      key={violation.id || violation._id}
      hover
      sx={{
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <TableCell>
        <CustomBadge>
          {violation.custom_user_id || "GP0001"}
        </CustomBadge>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {violation.plate_number || "LAB-3067"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {formatDate(violation.detected_at || new Date())}
        </Typography>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            fontWeight={(violation.speed || 0) > 30 ? "bold" : "regular"}
            color={(violation.speed || 0) > 30 ? "error.main" : "text.primary"}
          >
            {violation.speed || "14.08"}
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
            fontWeight={(violation.decibel_level || 0) > 85 ? "bold" : "regular"}
            color={(violation.decibel_level || 0) > 85 ? "error.main" : "text.primary"}
          >
            {violation.decibel_level || "0"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            dB
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <StatusChip status={violation.status || "flagged"} />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {violation.status === "flagged" && (
            <Tooltip title="Appeal Violation">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleOpenAppealDialog(violation)}
              >
                <CloudUploadIcon fontSize="small" />
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
        open={showAlert || showNotif}
        message={alertMessage || notifMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false) || setShowNotif(false)}
      />

      {/* Header Section */}
      <TableHeader
        title="Traffic Violations"
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onRefresh={() => {}}
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
        loading={isLoading}
        emptyState={emptyStateConfig}
        renderRow={renderViolationRow}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        paginationEnabled={true}
      />

      {/* Appeal Dialog */}
      <Dialog
        open={isAppealDialogOpen}
        onClose={handleCloseAppealDialog}
        maxWidth="sm"
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
          <CloudUploadIcon color="warning" />
          Appeal Violation
        </DialogTitle>
        <DialogContent sx={{ p: 3, minWidth: { sm: "500px" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Submit Appeal for Violation #{selectedViolation?.id || selectedViolation?._id}
            </Typography>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              Upload a letter explaining why this violation should be reviewed.
            </Typography>
            <Box
              sx={{
                p: 3,
                border: "1px dashed rgba(0,0,0,0.2)",
                borderRadius: 1,
                bgcolor: "rgba(0,0,0,0.02)",
                textAlign: "center",
              }}
            >
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                id="appeal-file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="appeal-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Select File
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary">
                {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button
            onClick={handleCloseAppealDialog}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAppeal}
            variant="contained"
            color="primary"
            disabled={!selectedFile}
          >
            Submit Appeal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViolationsTable;
