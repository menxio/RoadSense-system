"use client";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import NotificationBell from "@/components/atoms/NotificationBell";
import AvatarNavDropdown from "@/components/molecules/AvatarNavDropdown";

const Header = ({ user, onToggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#0d1b2a",
        boxShadow: "0 1px 10px rgba(0,0,0,0.2)",
        // zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", height: 64 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onToggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationBell />
          <AvatarNavDropdown user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
