import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const StatCard = ({ title, value, icon, buttonColor = 'primary' }) => {
  const colorMap = {
    primary: '#1976d2',
    success: '#4caf50',
    warning: '#ff9800',
  };
  const color = colorMap[buttonColor] || colorMap.primary;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100%',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography color="text.secondary" variant="body1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color }}>
          {icon}
        </Box>
      </Box>
      <Button 
        variant="text" 
        sx={{ 
          mt: 'auto', 
          color, 
          p: 0,
          '&:hover': {
            backgroundColor: 'transparent',
          }
        }}
      >
        VIEW
      </Button>
    </Paper>
  );
};

export default StatCard;