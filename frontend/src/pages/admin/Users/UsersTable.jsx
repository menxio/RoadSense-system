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
  TextField,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UsersTable = ({ users, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.plate_number} ${user.role} ${user.custom_id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
              <TableCell>Registered At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.custom_id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.plate_number}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleString()}
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
              ))}
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
    </>
  );
};

export default UsersTable;
