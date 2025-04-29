import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import api from "@/utils/api";

const ProfileEdit = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    plate_number: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("plate_number", profile.plate_number);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await api.post("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "240px" },
          mt: "64px",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Header onToggleSidebar={handleDrawerToggle} />
        <Box
          sx={{
            py: 4,
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#0d1b2a", mb: 3 }}
          >
            Edit Profile
          </Typography>

          {message && (
            <Typography
              variant="body1"
              color={message.includes("successfully") ? "green" : "red"}
              sx={{ mb: 3 }}
            >
              {message}
            </Typography>
          )}

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Avatar Section */}
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Avatar
                    src={profile.avatarUrl}
                    alt={profile.name}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "#6C63FF",
                    }}
                  >
                    {!profile.avatarUrl && profile.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <label htmlFor="avatar-upload">
                    <input
                      accept="image/*"
                      id="avatar-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Grid>

                {/* Name Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Email Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Plate Number Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Plate Number"
                    name="plate_number"
                    value={profile.plate_number}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileEdit;
