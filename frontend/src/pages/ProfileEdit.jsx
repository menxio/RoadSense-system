import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Zoom,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  DirectionsCar as CarIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import api from "@/utils/api";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    plate_number: "",
    school_id: "",
    custom_id: "",
    avatarUrl: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetchingProfile(true);
      try {
        const response = await api.get("/user");
        setProfile(response.data);
        setOriginalProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setSnackbar({
          open: true,
          message: "Failed to load profile data. Please try again.",
          severity: "error",
        });
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const checkChanges = () => {
      if (avatarFile) return true;

      return (
        profile.name !== originalProfile.name ||
        profile.email !== originalProfile.email ||
        profile.plate_number !== originalProfile.plate_number
      );
    };

    setHasChanges(checkChanges());
  }, [profile, originalProfile, avatarFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      setAvatarFile(file);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setProfile((prev) => ({
      ...prev,
      avatarUrl: originalProfile.avatarUrl || "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!profile.name.trim()) {
      errors.name = "Name is required";
    }

    if (!profile.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      errors.email = "Email is invalid";
    }

    if (!profile.plate_number.trim()) {
      errors.plate_number = "Plate number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

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

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      setOriginalProfile({ ...profile });
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile({ ...originalProfile });
    setAvatarFile(null);
    setFormErrors({});

    if (profile.avatarUrl !== originalProfile.avatarUrl) {
      URL.revokeObjectURL(profile.avatarUrl);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        role={user.role}
      />
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
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#0d1b2a",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonIcon fontSize="large" /> Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Update your personal information and profile picture
          </Typography>

          {fetchingProfile ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Left Column - Avatar */}
              <Grid item xs={12} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                      Profile Picture
                    </Typography>

                    <Box
                      sx={{
                        position: "relative",
                        mb: 3,
                        "&:hover .avatar-overlay": {
                          opacity: 1,
                        },
                      }}
                      onMouseEnter={() => setAvatarHover(true)}
                      onMouseLeave={() => setAvatarHover(false)}
                    >
                      <Avatar
                        src={profile.avatarUrl}
                        alt={profile.name}
                        sx={{
                          width: 150,
                          height: 150,
                          border: "4px solid white",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          transition: "transform 0.3s ease",
                          transform: avatarHover ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        {!profile.avatarUrl &&
                          profile.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Fade in={avatarHover}>
                        <Box
                          className="avatar-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          <Tooltip title="Change profile picture">
                            <IconButton
                              color="primary"
                              onClick={() => fileInputRef.current.click()}
                              sx={{
                                backgroundColor: "white",
                                "&:hover": {
                                  backgroundColor: "white",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Fade>
                    </Box>

                    <input
                      accept="image/*"
                      id="avatar-upload"
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />

                    <Box sx={{ width: "100%", mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => fileInputRef.current.click()}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Upload New Picture
                      </Button>

                      {avatarFile && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleRemoveAvatar}
                          fullWidth
                        >
                          Remove
                        </Button>
                      )}
                    </Box>

                    <Box sx={{ width: "100%", mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        User ID
                      </Typography>
                      <Chip
                        icon={<BadgeIcon />}
                        label={profile.custom_id || "Not available"}
                        color="primary"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          justifyContent: "flex-start",
                          height: 36,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column - Form */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                    Personal Information
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* Name Field */}
                      <Grid item xs={12}>
                        <TextField
                          label="Full Name"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Email Field */}
                      <Grid item xs={12}>
                        <TextField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Plate Number Field */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Plate Number"
                          name="plate_number"
                          value={profile.plate_number}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          error={!!formErrors.plate_number}
                          helperText={formErrors.plate_number}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CarIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* School ID Field (Read-only) */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="School ID"
                          name="school_id"
                          value={profile.school_id || "Not available"}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SchoolIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      {/* Action Buttons */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<CancelIcon />}
                            onClick={handleReset}
                            disabled={!hasChanges || loading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={
                              loading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            disabled={!hasChanges || loading}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>

                {/* Additional Information Card */}
                <Card
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    border: "1px dashed rgba(0,0,0,0.12)",
                    bgcolor: "rgba(25, 118, 210, 0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      color="primary"
                      sx={{ mb: 1 }}
                    >
                      Profile Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your profile information is used across the system.
                      Keeping it up-to-date ensures you receive important
                      notifications and communications.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Zoom}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileEdit;
