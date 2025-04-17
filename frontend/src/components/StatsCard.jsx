import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
export const StatsCard = ({
  icon,
  title,
  value,
  actionText,
  iconBgColor,
  actionTextColor,
  onAction,
}) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: iconBgColor,
              color: 'white',
              mr: 1.5,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onAction}
          sx={{
            color: actionTextColor,
            p: 0,
            '&:hover': {
              background: 'none',
              textDecoration: 'underline',
            },
          }}
        >
          {actionText}
        </Button>
      </CardContent>
    </Card>
  )
}
StatsCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  actionText: PropTypes.string.isRequired,
  iconBgColor: PropTypes.string.isRequired,
  actionTextColor: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
}