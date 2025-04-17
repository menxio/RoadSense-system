import React from 'react'
import PropTypes from 'prop-types'
import { Box, Avatar, Typography } from '@mui/material'
export const UserProfile = ({ name, role, avatarUrl }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          mr: 1.5,
        }}
      >
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {role}
        </Typography>
      </Box>
      <Avatar
        src={avatarUrl}
        sx={{
          bgcolor: avatarUrl ? 'transparent' : '#0a192f',
          width: 40,
          height: 40,
        }}
      >
        {!avatarUrl && initials}
      </Avatar>
    </Box>
  )
}
UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
}