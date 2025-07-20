import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Fade,
  Stack,
  Chip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";

const API_URL = `${import.meta.env.VITE_APP_URL}` || "";

const ProfilePicture = ({
  profile,
  avatarFile,
  onAvatarChange,
  onRemoveAvatar,
  onShowSnackbar,
}) => {
  const [avatarHover, setAvatarHover] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const getInitials = () => {
    if (profile.name) {
      const nameParts = profile.name.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      } else if (nameParts[0]) {
        return nameParts[0][0].toUpperCase();
      }
    }
    return "U";
  };

  const handleAvatarChange = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      onShowSnackbar("Image size should be less than 5MB", "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      onShowSnackbar("Please select a valid image file", "error");
      return;
    }
    onAvatarChange(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleAvatarChange(files[0]);
    }
  }, []);

  const getAvatarSrc = () => {
    if (profile?.avatarUrl) {
      if (profile.avatarUrl.startsWith("blob:")) {
        return profile.avatarUrl;
      }
      return `${API_URL}/storage/${profile.avatarUrl}`;
    }
    return "";
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        maxWidth: 400,
        mx: "auto",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          Profile Picture
        </Typography>

        <Box
          sx={{
            position: "relative",
            mb: 3,
            "&:hover .avatar-overlay": { opacity: 1 },
          }}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              borderRadius: "50%",
              border: isDragOver
                ? `3px dashed ${theme.palette.primary.main}`
                : "3px solid transparent",
              transition: "all 0.3s ease",
              p: isDragOver ? 1 : 0,
            }}
          >
            <Avatar
              src={getAvatarSrc()}
              alt={profile?.name || getInitials()}
              sx={{
                width: 120,
                height: 120,
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[8],
                transition: "all 0.3s ease",
                transform:
                  avatarHover || isDragOver ? "scale(1.05)" : "scale(1)",
                fontSize: "2.5rem",
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {!profile?.avatarUrl && getInitials()}
            </Avatar>

            <Fade in={avatarHover || isDragOver}>
              <Box
                className="avatar-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: alpha(theme.palette.common.black, 0.6),
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCameraIcon
                  sx={{ color: "white", fontSize: "1.5rem", mb: 1 }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {isDragOver ? "Drop here" : "Change Photo"}
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Box>

        <input
          accept="image/*"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) =>
            e.target.files?.[0] && handleAvatarChange(e.target.files[0])
          }
        />

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            fullWidth
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            Upload New Picture
          </Button>

          {avatarFile && (
            <Fade in={!!avatarFile}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onRemoveAvatar}
                fullWidth
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              >
                Remove Picture
              </Button>
            </Fade>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1.5, fontWeight: 500 }}
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
              height: 40,
              borderRadius: 2,
              "& .MuiChip-label": { fontWeight: 500 },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePicture;
