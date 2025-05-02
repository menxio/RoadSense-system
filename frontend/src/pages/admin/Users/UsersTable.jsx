import { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  DirectionsCar as DirectionsCarIcon,
  VerifiedUser as VerifiedUserIcon,
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiUrl = "http://backend.test";

  useEffect(() => {
    setUserData(users);
  }, [users]);

  useEffect(() => {
    setPage(1);
  }, [tabValue, search]);

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

  const tableColumns = [
    <TableHeaderCell
      key="user-id"
      icon={<PersonIcon fontSize="small" color="action" />}
    >
      User ID
    </TableHeaderCell>,
    <TableHeaderCell
      key="name"
      icon={<PersonIcon fontSize="small" color="action" />}
    >
      Name
    </TableHeaderCell>,
    <TableHeaderCell
      key="plate-number"
      icon={<DirectionsCarIcon fontSize="small" color="action" />}
    >
      Plate Number
    </TableHeaderCell>,
    <TableHeaderCell
      key="role"
      icon={<VerifiedUserIcon fontSize="small" color="action" />}
    >
      Role
    </TableHeaderCell>,
    "Status",
    <TableHeaderCell
      key="registered-at"
      icon={<CalendarTodayIcon fontSize="small" color="action" />}
    >
      Registered At
    </TableHeaderCell>,
    "Actions",
  ];

  const renderUserRow = (user) => (
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
        <CustomBadge onClick={() => handleOpenModal(user)}>
          {user.custom_id}
        </CustomBadge>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {user.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.plate_number}</Typography>
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
        <StatusChip
          status={user.status}
          onClick={() => handleOpenModal(user)}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{formatDate(user.created_at)}</Typography>
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
  );

  const emptyStateConfig = {
    icon:
      tabValue === "active" ? (
        <CheckCircleIcon fontSize="large" color="success" />
      ) : tabValue === "pending" ? (
        <WarningIcon fontSize="large" color="warning" />
      ) : (
        <BlockIcon fontSize="large" color="error" />
      ),
    message: `No ${tabValue} users found`,
    subMessage: search ? "Try adjusting your search criteria" : null,
    onReset: () => setSearch(""),
    colSpan: 7,
  };

  const tabsConfig = [
    { value: "active", label: "Active", count: userCounts.active },
    { value: "pending", label: "Pending", count: userCounts.pending },
    { value: "suspended", label: "Suspended", count: userCounts.suspended },
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
        title="User Management"
        searchValue={search}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        searchPlaceholder="Search by name or ID"
      />

      {/* Status Cards */}
      <StatusCards
        counts={userCounts}
        activeTab={tabValue}
        onTabChange={(tab) => setTabValue(tab)}
      />

      {/* Tabs */}
      <StatusTabs
        value={tabValue}
        onChange={handleTabChange}
        tabsConfig={tabsConfig}
      />

      {/* Users Table with Pagination */}
      <DataTable
        columns={tableColumns}
        data={filteredUsers}
        loading={loading}
        emptyState={emptyStateConfig}
        renderRow={renderUserRow}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        paginationEnabled={true}
      />

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
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete user ${userToDelete?.name} with ID ${userToDelete?.custom_id}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        confirmText="Delete"
        confirmColor="error"
      />

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
