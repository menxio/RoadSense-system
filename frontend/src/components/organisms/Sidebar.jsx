import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Videocam as VideocamIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  DirectionsCar as DirectionsCarIcon, // Import vehicle icon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import navigation hook

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    // Clear user session (e.g., token) and redirect to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0d1b2a',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          RoadSense
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/violation-types')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Violation Types" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/live-cam')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="Live Cam" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/violations')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Violations" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/manage-users')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/reports')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin/vehicles')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Vehicles" />
          </ListItemButton>
        </ListItem>
        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;