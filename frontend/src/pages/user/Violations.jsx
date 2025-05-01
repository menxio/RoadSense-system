import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { getViolationById, updateViolation } from "../../services/violation.service";
import DashboardLayout from "../../components/DashboardLayout";

const UserViolations = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentViolationId, setCurrentViolationId] = useState(null);
  const [violations, setViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Flagged");
  const [formData, setFormData] = useState({
    plate_number: "",
    detected_at: "",
    speed: 0,
    decibel_level: 0,
  });

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile());
    }

    const fetchUserViolations = async () => {
      try {
        setIsLoading(true);
        const violationsResponse = await getViolationById(user.custom_id);
        setViolations(violationsResponse.violations);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.custom_id) {
      fetchUserViolations();
    }
  }, [dispatch, user.name, user.custom_id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAppeal = (id) => {
    const selectedViolation = violations.find((violation) => violation.id === id);
    setCurrentViolationId(id);
    setSelectedFile(null); // Reset the file input
    setFormData({
      plate_number: selectedViolation.plate_number,
      detected_at: selectedViolation.detected_at,
      speed: selectedViolation.speed,
      decibel_level: selectedViolation.decibel_level,
    });
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (selectedFile && currentViolationId) {
      const uploadData = new FormData();
      uploadData.append("letter", selectedFile);
      uploadData.append("plate_number", formData.plate_number);
  
      const detectedAtISO = new Date(formData.detected_at).toISOString();
      uploadData.append("detected_at", detectedAtISO);
      uploadData.append("speed", formData.speed.toString());
      uploadData.append("decibel_level", formData.decibel_level.toString());
      try {
        const response = await updateViolation(currentViolationId, uploadData);
        console.log("Violation updated successfully:", response);
        setIsModalOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error updating violation:", error);
      }
    }
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredViolations = violations.filter((violation) => {
    if (activeTab === "Flagged") return violation.status === "flagged";
    if (activeTab === "Under Review") return violation.status === "under review";
    if (activeTab === "Cleared") return violation.status === "cleared";
    return true;
  });

  return (
    <DashboardLayout
      logo="/path/to/logo.png"
      sidebarItems={[
        { icon: <span>🏠</span>, label: "Home", path: "/home" },
        { icon: <span>📄</span>, label: "Violations", path: "/violations" },
      ]}
      activePath="/violations"
      onNavigate={(path) => console.log(`Navigate to ${path}`)}
      userName={user.name}
      userRole={user.role}
      userAvatarUrl="/path/to/avatar.jpg"
    >
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom color="black">
          User Current Violations
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
          <Tab label="Flagged" value="Flagged" />
          <Tab label="Under Review" value="Under Review" />
          <Tab label="Cleared" value="Cleared" />
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Plate Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Speed</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Noise Level</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Violation Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredViolations.map((row) => {
                  const isSpeedViolation = row.speed > 10;
                  const isNoiseViolation = row.decibel_level > 70;
                  const violationType =
                    isSpeedViolation && isNoiseViolation
                      ? "Speed & Noise"
                      : isSpeedViolation
                      ? "Speed"
                      : isNoiseViolation
                      ? "Noise"
                      : "None";

                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.plate_number}</TableCell>
                      <TableCell>{new Date(row.detected_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: isSpeedViolation ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {row.speed} / 10
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: isNoiseViolation ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {row.decibel_level} / 70
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={violationType}
                          sx={{
                            backgroundColor: isSpeedViolation || isNoiseViolation ? "#f8d7da" : "#d4edda",
                            color: isSpeedViolation || isNoiseViolation ? "#721c24" : "#155724",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAppeal(row.id)}
                        >
                          Appeal
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modal for Uploading PDF */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upload PDF for Violation ID: {currentViolationId}
            </Typography>
            <Typography variant="body2" gutterBottom color="textSecondary">
              Please upload your apology letter in PDF format to appeal this violation.
            </Typography>
            <TextField
              type="file"
              inputProps={{ accept: ".pdf" }}
              onChange={handleFileChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </Box>
        </Modal>
      </Box>
    </DashboardLayout>
  );
};

export default UserViolations;