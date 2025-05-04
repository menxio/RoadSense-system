import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../atoms/NotificationBell";

export const UserProfile = ({ name, role, avatarUrl }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/admin/profile");
    handleClose();
  };

  const handleSettings = () => {
    navigate("/admin/settings");
    handleClose();
  };

  const getInitials = () => {
    if (!name) return "U";

    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts[0]) {
      return nameParts[0][0].toUpperCase();
    }
    return "U";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <NotificationBell />

      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          p: 1,
          borderRadius: 1,
          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
        }}
      >
        <Box textAlign="right" sx={{ mr: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {role || "User"}
          </Typography>
        </Box>
        <Avatar
          src={avatarUrl}
          sx={{
            bgcolor: avatarUrl ? "transparent" : "#6C63FF",
            color: "white",
            width: 40,
            height: 40,
          }}
        >
          {!avatarUrl && getInitials()}
        </Avatar>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            width: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {role || "User"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
