import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import UserDetailsModal from "@/components/molecules/UserDetailsModal";
import dayjs from "dayjs";
import { showUser } from "@/services/user.service";

const ViolationsTable = ({ violations, onUpdateStatus, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiUrl = "http://backend.test";

  const handleOpenDialog = (violation) => {
    setSelectedViolation(violation);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedViolation(null);
    setNewStatus("");
    setIsDialogOpen(false);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedViolation && newStatus) {
      await onUpdateStatus(selectedViolation.id, newStatus);

      selectedViolation.status = newStatus;
    }
    handleCloseDialog();
  };

  const handleOpenUserModal = async (userId) => {
    try {
      const userData = await showUser(userId); // Fetch user details
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "flagged":
        return { backgroundColor: "#f44336", color: "#fff" }; // Red
      case "reviewed":
        return { backgroundColor: "#ff9800", color: "#fff" }; // Orange
      case "cleared":
        return { backgroundColor: "#4caf50", color: "#fff" }; // Green
      default:
        return { backgroundColor: "#9e9e9e", color: "#fff" }; // Gray
    }
  };

  const filteredViolations = violations.filter(
    (violation) =>
      violation.custom_user_id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      violation.plate_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Traffic Violations
        </Typography>
        <TextField
          label="Search by User ID or Plate Number"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
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
            {filteredViolations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1565c0",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                      onClick={() =>
                        handleOpenUserModal(violation.custom_user_id)
                      }
                    >
                      {violation.custom_user_id}
                    </Box>
                  </TableCell>
                  <TableCell>{violation.plate_number}</TableCell>
                  <TableCell>
                    {dayjs(violation.detected_at).format("MM/DD/YYYY, h:mm A")}
                  </TableCell>
                  <TableCell>{violation.speed ?? "N/A"} km/h</TableCell>
                  <TableCell>{violation.decibel_level ?? "N/A"} dB</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        ...getStatusStyle(violation.status),
                        borderRadius: "16px",
                        padding: "4px 12px",
                        cursor: "pointer",
                        textAlign: "center",
                        display: "inline-block",
                        textTransform: "uppercase",
                      }}
                      onClick={() => handleOpenDialog(violation)}
                    >
                      {violation.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Tooltip title="Delete Violation">
                        <IconButton
                          color="error"
                          onClick={() => onDelete(violation.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      {violation.status === "cleared" && (
                        <Tooltip title="Violation Cleared">
                          <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                      {violation.status === "reviewed" && (
                        <Tooltip title="Violation Reviewed">
                          <WarningAmberIcon color="warning" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                      {violation.status === "flagged" && (
                        <Tooltip title="Violation Flagged">
                          <WarningIcon color="warning" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredViolations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Change Violation Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of this violation?
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={() => setNewStatus("flagged")}
            >
              Flagged
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
              onClick={() => setNewStatus("reviewed")}
            >
              Reviewed
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setNewStatus("cleared")}
            >
              Cleared
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmStatusChange}
            color="primary"
            disabled={!newStatus}
          >
            Confirm
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
