import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import UsersTable from "./UsersTable";
import { getUsers, deleteUser, updateUser } from "@/services/user.service";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const filtered = data.filter((u) => u.role === "user"); // show only users
        setUsers(filtered);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.custom_id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      setMessage("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleEditSubmit = async () => {
    try {
      const updated = await updateUser(selectedUser.custom_id, {
        name: selectedUser.name,
        plate_number: selectedUser.plate_number,
        role: selectedUser.role,
      });

      setUsers((prev) =>
        prev.map((u) => (u.custom_id === updated.custom_id ? updated : u))
      );

      setOpenEdit(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update user");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role= 'admin' />
      <Header onToggleSidebar={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - 240px)` },
          mt: { xs: "64px", md: "64px" },
          p: { xs: 2, sm: 3, md: 4 },
          transition: "margin 0.2s, width 0.2s",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 1, fontWeight: "bold", color: "#0d1b2a" }}
          >
            Manage Users
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage all users in the system
          </Typography>
        </Box>

        {message && (
          <Typography color="error" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}

        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Plate Number"
            value={selectedUser?.plate_number || ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                plate_number: e.target.value,
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
