import { useState } from "react";
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
  Avatar,
  Tooltip,
  Badge,
  Stack,
  Alert,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  DirectionsCar as CarIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";
import { updateUser } from "@/services/user.service";

const UserDetailsModal = ({ open, onClose, user, apiUrl, onUpdateStatus }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon />;
      case "pending":
        return <WarningIcon />;
      case "suspended":
        return <BlockIcon />;
      default:
        return null;
    }
  };

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      // Toggle between active and suspended
      const newStatus =
        user.status?.toLowerCase() === "active" ? "suspended" : "active";

      await updateUser(user.custom_id, { status: newStatus });

      if (onUpdateStatus) {
        onUpdateStatus(user.custom_id, newStatus);
      }

      setAlertMessage(`User status updated to ${newStatus} successfully`);
      setAlertSeverity("success");
      setShowAlert(true);

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating user status:", error);
      setAlertMessage("Failed to update user status.");
      setAlertSeverity("error");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleOpenConfirmDialog = (action) => {
    setConfirmAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const userFields = [
    {
      label: "User ID",
      value: user.custom_id,
      icon: <BadgeIcon color="primary" />,
    },
    {
      label: "School ID",
      value: user.school_id,
      icon: <SchoolIcon color="primary" />,
    },
    { label: "Name", value: user.name, icon: <PersonIcon color="primary" /> },
    { label: "Email", value: user.email, icon: <EmailIcon color="primary" /> },
    {
      label: "Plate Number",
      value: user.plate_number,
      icon: <CarIcon color="primary" />,
    },
    {
      label: "Role",
      value: user.role,
      icon: <VerifiedUserIcon color="primary" />,
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
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
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonIcon /> User Details
          </DialogTitle>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Alert Message */}
        <Fade in={showAlert}>
          <Alert
            severity={alertSeverity}
            sx={{ borderRadius: 0 }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        </Fade>

        {/* Modal Content */}
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            {/* License ID Image Section */}
            <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: "250px" } }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  License ID
                </Typography>

                {user.license_id_image ? (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Tooltip title={`Status: ${user.status}`}>
                        <Avatar
                          sx={{
                            bgcolor:
                              theme.palette[getStatusColor(user.status)].main,
                            width: 22,
                            height: 22,
                            border: "2px solid white",
                          }}
                        >
                          {getStatusIcon(user.status)}
                        </Avatar>
                      </Tooltip>
                    }
                  >
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
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Badge>
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
                      position: "relative",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{ fontSize: 80, color: "grey.400" }}
                    />
                    <Chip
                      label={user.status?.toUpperCase() || "UNKNOWN"}
                      color={getStatusColor(user.status)}
                      icon={getStatusIcon(user.status)}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ mt: 3, width: "100%" }}>
                  <Stack spacing={1} width="100%">
                    <Chip
                      label={user.status?.toUpperCase() || "UNKNOWN"}
                      color={getStatusColor(user.status)}
                      icon={getStatusIcon(user.status)}
                      sx={{
                        width: "100%",
                        fontWeight: "bold",
                        py: 0.5,
                      }}
                    />

                    {user.status?.toLowerCase() === "active" ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<BlockIcon />}
                        onClick={() => handleOpenConfirmDialog("suspend")}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Suspend User
                      </Button>
                    ) : user.status?.toLowerCase() === "suspended" ? (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenConfirmDialog("activate")}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Activate User
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenConfirmDialog("approve")}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Approve User
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Paper>
            </Box>

            {/* User Details Section */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon /> Personal Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {userFields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "background.default",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ mt: 0.5 }}>{field.icon}</Box>
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
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {user.created_at && (
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px dashed rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Registered on:{" "}
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "background.default" }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor:
              confirmAction === "suspend" ? "error.light" : "primary.light",
            color:
              confirmAction === "suspend"
                ? "error.contrastText"
                : "primary.contrastText",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {confirmAction === "suspend" ? (
            <>
              <BlockIcon /> Suspend User
            </>
          ) : confirmAction === "activate" ? (
            <>
              <CheckCircleIcon /> Activate User
            </>
          ) : (
            <>
              <CheckCircleIcon /> Approve User
            </>
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, mt: 2 }}>
          <DialogContentText>
            {confirmAction === "suspend" ? (
              <>
                Are you sure you want to <strong>suspend</strong> this user?
                They will no longer be able to access the system until
                reactivated.
              </>
            ) : confirmAction === "activate" ? (
              <>
                Are you sure you want to <strong>activate</strong> this user?
                This will restore their access to the system.
              </>
            ) : (
              <>
                Are you sure you want to <strong>approve</strong> this user? If
                the user has 3 or more uncleared violations, their status will
                be set to Suspended.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            color={confirmAction === "suspend" ? "error" : "primary"}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetailsModal;
