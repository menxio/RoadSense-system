import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Videocam as VideocamIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ open = true, onClose, collapsedProp, setCollapsedProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);

  const drawerWidth = collapsed ? 70 : 240;

  const toggleDrawer = () => {
    if (collapsedProp != undefined) {
      setCollapsedProp((prev) => !prev)
    }
    setCollapsed((prev) => !prev);
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Live Cam", icon: <VideocamIcon />, path: "/admin/live" },
    {
      text: "Manage Violations",
      icon: <WarningIcon />,
      path: "/admin/violations",
    },
    { text: "Manage Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          p: 2,
          minHeight: "64px", // Match the height of the AppBar
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold">
            <img
              src="/img/logo.png"
              alt=""
              style={{ height: "32px", width: "auto", marginRight: "8px" }}
            />
            RoadSense
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List sx={{ px: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem
            disablePadding
            key={item.text}
            sx={{ display: "block", mb: 1 }}
          >
            <Tooltip title={collapsed ? item.text : ""} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "initial",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: isActive(item.path)
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: 0,
                    mr: collapsed ? "auto" : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: collapsed ? 0 : 1,
                    "& .MuiTypography-root": {
                      fontWeight: isActive(item.path) ? "bold" : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor: "#0d1b2a",
              color: "white",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
              boxSizing: "border-box",
              backgroundColor: "#0d1b2a",
              color: "white",
              borderRight: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
