import React from 'react'
import PropTypes from 'prop-types'
import { Box, AppBar, Toolbar, Container } from '@mui/material'
import { Sidebar } from './Sidebar'
import { UserProfile } from './UserProfile'
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
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50', width: '100vw' }}>
      <Sidebar
        logo={logo}
        items={sidebarItems}
        activePath={activePath}
        onNavigate={onNavigate}
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={1}
          sx={{ bgcolor: 'white' }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <UserProfile
              name={userName}
              role={userRole}
              avatarUrl={userAvatarUrl}
            />
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} sx={{ p: 4 }}>
          {children}
        </Container>
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
    })
  ).isRequired,
  activePath: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  userAvatarUrl: PropTypes.string,
}