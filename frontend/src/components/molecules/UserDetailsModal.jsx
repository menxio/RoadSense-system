import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
  Button,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { updateUser } from "@/services/user.service";

const UserDetailsModal = ({ open, onClose, user, apiUrl, onUpdateStatus }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (!user) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  const handleApprove = async () => {
    try {
      const newStatus = "active";

      await updateUser(user.custom_id, { status: newStatus });

      if (onUpdateStatus) {
        onUpdateStatus(user.custom_id, newStatus);
      }

      setIsConfirmDialogOpen(false);
      onClose();
    } catch (error) {
      console.error("Error approving user:", error);
      setMessage("Failed to approve user.");
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const userFields = [
    { label: "User ID", value: user.custom_id },
    { label: "School ID", value: user.school_id },
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Plate Number", value: user.plate_number },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              p: 0,
              color: "inherit",
            }}
          >
            User Details
          </DialogTitle>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            {/* License ID Image Section */}
            <Box sx={{ flex: "0 0 auto", width: "250px" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  License ID
                </Typography>

                {user.license_id_image ? (
                  <Box
                    component="img"
                    src={`${apiUrl}/storage/${user.license_id_image}`}
                    alt="License ID"
                    sx={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 1,
                      border: "1px solid #eee",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  >
                    <AccountCircleIcon
                      sx={{ fontSize: 80, color: "grey.400" }}
                    />
                  </Box>
                )}

                <Box sx={{ mt: 2, width: "100%" }}>
                  <Chip
                    label={user.status?.toUpperCase() || "UNKNOWN"}
                    color={getStatusColor(user.status)}
                    sx={{
                      width: "100%",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={handleOpenConfirmDialog}
                  />
                </Box>
              </Paper>
            </Box>

            {/* User Details Section */}
            <Box sx={{ flex: 1 }}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  Personal Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {userFields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.secondary", mb: 0.5 }}
                        >
                          {field.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          {field.value || "—"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Approve User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this user? If the user has 3 or
            more uncleared violations, their status will be set to Suspended.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleApprove} color="primary" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetailsModal;
