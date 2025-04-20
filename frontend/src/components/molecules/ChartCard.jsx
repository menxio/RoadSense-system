import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChartCard = ({ title, children }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" color="primary" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children || (
          <Typography color="text.secondary">
            Chart data will be displayed here
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChartCard;