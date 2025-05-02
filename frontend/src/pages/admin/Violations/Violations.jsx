import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import ViolationsTable from "./ViolationsTable";
import { getViolations, updateViolation } from "@/services/violation.service";
import { fetchUserProfile } from "@/redux/slices/userSlice";

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const violationData = await getViolations();
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role='admin'/>
      <Header onToggleSidebar={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
            Manage Violations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage all traffic violations in the system
          </Typography>
        </Box>

        <ViolationsTable
          violations={violations}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
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
