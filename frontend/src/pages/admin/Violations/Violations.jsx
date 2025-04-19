import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import ViolationsTable from './ViolationsTable';
import { getViolations } from '@/services/violation.service';

const Violations = () => {
  const [violations, setViolations] = useState([]); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const violationData = await getViolations();
        setViolations(violationData);
      } catch (error) {
        console.error('Error fetching violations:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setViolations((prev) =>
      prev.map((violation) =>
        violation.id === id ? { ...violation, status: newStatus } : violation
      )
    );
    setMessage('Violation status updated successfully!');
  };

  const handleDelete = (id) => {
    setViolations((prev) => prev.filter((violation) => violation.id !== id));
    setMessage('Violation deleted successfully!');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Manage Violations
          </Typography>
          {message && (
            <Typography
              variant="body1"
              sx={{ mt: 2, color: message.includes('successfully') ? 'green' : 'red' }}
            >
              {message}
            </Typography>
          )}
          <ViolationsTable
            violations={violations}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default Violations;