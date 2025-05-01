"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Box, useTheme, useMediaQuery } from "@mui/material"
import Sidebar from "./Sidebar"
import Header from "./organisms/Header"

export const DashboardLayout = ({
  children,
  logo,
  sidebarItems,
  activePath,
  onNavigate,
  userName,
  userRole,
  userAvatarUrl,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const user = {
    name: userName,
    role: userRole,
    avatarUrl: userAvatarUrl,
  }

  const drawerWidth = 240

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar
        logo={logo}
        items={sidebarItems}
        activePath={activePath}
        onNavigate={onNavigate}
        open={mobileOpen}
        onClose={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header user={user} onToggleSidebar={handleDrawerToggle} drawerWidth={drawerWidth} />

        <Box
          sx={{
            pt: 10, // Increased padding top to account for fixed header
            pb: 4,
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  logo: PropTypes.string.isRequired,
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activePath: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  userAvatarUrl: PropTypes.string,
}

export default DashboardLayout
