import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import ProfilePictureSection from "@/components/organisms/ProfilePicture";
import PersonalInformationForm from "@/components/organisms/PersonalInformation";
import { useProfileForm } from "../hooks/useProfileForm";

const ProfileEdit = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    user,
    profile,
    setProfile,
    avatarFile,
    setAvatarFile,
    loading,
    formErrors,
    fieldTouched,
    hasChanges,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    handleReset,
  } = useProfileForm();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    setProfile((prev) => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleShowSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFormSubmit = async (e) => {
    const result = await handleSubmit(e);
    handleShowSnackbar(result.message, result.success ? "success" : "error");
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  if (!user.name) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
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
          }}
        >
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            <Skeleton variant="text" width={300} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={500} height={24} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
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
        <Box sx={{ maxWidth: "900px", mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <PersonIcon fontSize="large" color="primary" />
              Profile Settings
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
            >
              Update your personal information and profile picture
            </Typography>
          </Box>

          {/* Profile Picture Section - Centered */}
          <ProfilePictureSection
            profile={profile}
            avatarFile={avatarFile}
            onAvatarChange={handleAvatarChange}
            onRemoveAvatar={handleRemoveAvatar}
            onShowSnackbar={handleShowSnackbar}
          />

          {/* Personal Information Form */}
          <PersonalInformationForm
            profile={profile}
            formErrors={formErrors}
            fieldTouched={fieldTouched}
            loading={loading}
            hasChanges={hasChanges}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
            onSubmit={handleFormSubmit}
            onReset={handleReset}
          />
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, boxShadow: theme.shadows[8] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileEdit;
