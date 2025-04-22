import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import UsersTable from "./UsersTable";
import { getUsers } from "@/services/user.service";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Manage Users
          </Typography>
          {message && (
            <Typography color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <UsersTable users={users} />
        </Container>
      </Box>
    </Box>
  );
};

export default Users;
