import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Navbar from "@/components/organisms/Navbar";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url(/img/main-entrance.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
        }}
      >
        <Navbar />
      </Box>

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          padding: 3,
          zIndex: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Road<span style={{ color: "#FF0000" }}>Sense</span>
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 4 }}>
          Monitor, Detect and Respond to Traffic Violations in Real Time
        </Typography>
        <Button
          variant="contained"
          onClick={handleGetStarted}
          sx={{
            backgroundColor: "#FF0000",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#cc0000" },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
