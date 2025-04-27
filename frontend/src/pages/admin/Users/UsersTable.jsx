import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Box,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import UserDetailsModal from "@/components/molecules/UserDetailsModal";

const UsersTable = ({ users, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const apiUrl = "http://backend.test";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(users);

  useEffect(() => {
    setUserData(users);
  }, [users]);

  const filteredUsers = userData
    ? userData.filter((user) =>
        `${user.name} ${user.plate_number} ${user.role} ${user.custom_id}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

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
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success"; // Green
      case "pending":
        return "warning"; // Yellow
      case "suspended":
        return "error"; // Red
      default:
        return "default";
    }
  };

  return (
    <>
      <TextField
        label="Search users"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registered At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.custom_id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.plate_number}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.toUpperCase()}
                        color={getStatusColor(user.status)}
                        sx={{
                          cursor: "pointer",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleOpenModal(user)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onEdit(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => onDelete(user._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      <UserDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        apiUrl={apiUrl}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
};

export default UsersTable;
