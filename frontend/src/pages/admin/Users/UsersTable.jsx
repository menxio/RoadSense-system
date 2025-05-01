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
  DialogContentText,
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  CalendarToday as CalendarTodayIcon,
  DirectionsCar as DirectionsCarIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";
import UserDetailsModal from "@/components/molecules/UserDetailsModal";

const UsersTable = ({ users, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState("active");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(users);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const apiUrl = "http://backend.test";

  useEffect(() => {
    setUserData(users);
  }, [users]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (customId, newStatus) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.custom_id === customId ? { ...user, status: newStatus } : user
      )
    );

    setShowAlert(true);
    setAlertMessage(`User status updated to ${newStatus}`);
    setAlertSeverity("success");

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowAlert(true);
      setAlertMessage("User data refreshed successfully");
      setAlertSeverity("success");

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }, 1000);
  };

  const handleOpenActionMenu = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setActionUser(user);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setActionUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete._id);

      setShowAlert(true);
      setAlertMessage("User deleted successfully");
      setAlertSeverity("success");

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    handleCloseDeleteDialog();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "pending":
        return <WarningIcon fontSize="small" />;
      case "suspended":
        return <BlockIcon fontSize="small" />;
      default:
        return null;
    }
  };

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

  const filteredUsers = userData
    ? userData.filter((user) => {
        const matchesSearch =
          `${user.name} ${user.plate_number} ${user.role} ${user.custom_id}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesTab = user.status?.toLowerCase() === tabValue;
        return matchesSearch && matchesTab;
      })
    : [];

  const userCounts = {
    active:
      userData?.filter((user) => user.status?.toLowerCase() === "active")
        .length || 0,
    pending:
      userData?.filter((user) => user.status?.toLowerCase() === "pending")
        .length || 0,
    suspended:
      userData?.filter((user) => user.status?.toLowerCase() === "suspended")
        .length || 0,
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
          User Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search by name or ID"
            size="small"
            value={search}
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
            <IconButton onClick={handleRefresh} color="primary">
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
            borderLeft: "4px solid #4caf50",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
            bgcolor:
              tabValue === "active"
                ? "rgba(76, 175, 80, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("active")}
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
                Active Users
              </Typography>
              <Badge badgeContent={userCounts.active} color="success">
                <CheckCircleIcon color="success" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#4caf50" }}
            >
              {userCounts.active}
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
              tabValue === "pending"
                ? "rgba(255, 152, 0, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("pending")}
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
                Pending Users
              </Typography>
              <Badge badgeContent={userCounts.pending} color="warning">
                <WarningIcon color="warning" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#ff9800" }}
            >
              {userCounts.pending}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "200px" },
            cursor: "pointer",
            borderLeft: "4px solid #f44336",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
            bgcolor:
              tabValue === "suspended"
                ? "rgba(244, 67, 54, 0.08)"
                : "background.paper",
          }}
          onClick={() => setTabValue("suspended")}
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
                Suspended Users
              </Typography>
              <Badge badgeContent={userCounts.suspended} color="error">
                <BlockIcon color="error" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: "bold", color: "#f44336" }}
            >
              {userCounts.suspended}
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
          value="active"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon fontSize="small" />
              <span>Active</span>
              <Chip
                label={userCounts.active}
                size="small"
                color="success"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
        <Tab
          value="pending"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WarningIcon fontSize="small" />
              <span>Pending</span>
              <Chip
                label={userCounts.pending}
                size="small"
                color="warning"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
        <Tab
          value="suspended"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BlockIcon fontSize="small" />
              <span>Suspended</span>
              <Chip
                label={userCounts.suspended}
                size="small"
                color="error"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            </Box>
          }
        />
      </Tabs>

      {/* Users Table */}
      {loading ? (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Plate Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Registered At</TableCell>
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
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={32} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} />
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
                    <PersonIcon fontSize="small" color="action" />
                    Name
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
                    <VerifiedUserIcon fontSize="small" color="action" />
                    Role
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    Registered At
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
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
                        onClick={() => handleOpenModal(user)}
                      >
                        {user.custom_id}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.plate_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === "admin" ? "primary" : "default"}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(user.status)}
                        label={user.status.toUpperCase()}
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 0.9,
                            transform: "translateY(-1px)",
                          },
                        }}
                        onClick={() => handleOpenModal(user)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={(e) => handleOpenActionMenu(e, user)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
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
                      {tabValue === "active" && (
                        <CheckCircleIcon fontSize="large" color="success" />
                      )}
                      {tabValue === "pending" && (
                        <WarningIcon fontSize="large" color="warning" />
                      )}
                      {tabValue === "suspended" && (
                        <BlockIcon fontSize="large" color="error" />
                      )}
                      <Typography variant="h6" color="text.secondary">
                        No {tabValue} users found
                      </Typography>
                      {search && (
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search criteria
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => setSearch("")}
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

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem
          onClick={() => {
            onEdit(actionUser);
            handleCloseActionMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenModal(actionUser)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Message</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleOpenDeleteDialog(actionUser)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete User</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user{" "}
            <strong>{userToDelete?.name}</strong> with ID{" "}
            <strong>{userToDelete?.custom_id}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Modal */}
      <UserDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        apiUrl={apiUrl}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
};

export default UsersTable;
