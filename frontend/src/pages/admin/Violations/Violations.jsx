import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Snackbar, Alert } from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import ViolationsTable from "./ViolationsTable";
import { getViolations, updateViolation } from "@/services/violation.service";

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const violationData = await getViolations();
        console.log("Fetched Violations:", violationData); // Debugging
        setViolations(violationData);
      } catch (error) {
        console.error("Error fetching violations:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateViolation(id, { status });
      setViolations((prev) =>
        prev.map((violation) =>
          violation._id === id ? { ...violation, status } : violation
        )
      );
      setMessage("Violation status updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating violation status:", error);
      setMessage("Failed to update violation status.");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = (id) => {
    setViolations((prev) => prev.filter((violation) => violation._id !== id));
    setMessage("Violation deleted successfully!");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 1 }}>
          <Typography variant="h4" sx={{ mb: 1, color: "#5a6a7a" }}>
            Manage Violations
          </Typography>
          <ViolationsTable
            violations={violations}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        </Container>
      </Box>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={message.includes("successfully") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Violations;
