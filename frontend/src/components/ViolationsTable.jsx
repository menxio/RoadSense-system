import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Box } from '@mui/material';

export const ViolationsTable = ({ violations }) => {
  // Function to determine the violation type
  const getViolationType = (speed, decibelLevel) => {
    const isSpeedViolation = speed > 10; // Speed exceeds 10 kph
    const isNoiseViolation = decibelLevel > 70; // Noise exceeds 70 dB

    if (isSpeedViolation && isNoiseViolation) {
      return 'Speed & Noise';
    } else if (isSpeedViolation) {
      return 'Speed';
    } else if (isNoiseViolation) {
      return 'Noise';
    }
    return null; // No violation type if neither condition is met
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, backgroundColor: '#fff' }}>
      {/* Table Title */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50' }}>
        Recent Violations
      </Typography>

      <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Plate Number</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Speed</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Noise Level</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Violation Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {violations.length > 0 ? (
            violations.map((violation) => {
              const violationType = getViolationType(violation.speed, violation.decibel_level);

              return (
                <TableRow
                  key={violation.id}
                  sx={{
                    backgroundColor: '#f9f9f9',
                    '&:hover': { backgroundColor: '#f1f1f1' },
                    borderRadius: '10px',
                  }}
                >
                  <TableCell>{violation.plate_number}</TableCell>
                  <TableCell>{new Date(violation.detected_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: violation.speed > 10 ? 'red' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {violation.speed} / 10
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: violation.decibel_level > 70 ? 'red' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {violation.decibel_level} / 70
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={violationType}
                      sx={{
                        backgroundColor:
                          violationType === 'Speed & Noise'
                            ? '#f8d7da'
                            : violationType === 'Speed'
                            ? '#d1ecf1'
                            : '#fff3cd',
                        color:
                          violationType === 'Speed & Noise'
                            ? '#721c24'
                            : violationType === 'Speed'
                            ? '#0c5460'
                            : '#856404',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={violation.status}
                      sx={{
                        backgroundColor:
                          violation.status === 'flagged'
                            ? '#ffeeba'
                            : violation.status === 'pending'
                            ? '#d1ecf1'
                            : '#d4edda',
                        color:
                          violation.status === 'flagged'
                            ? '#856404'
                            : violation.status === 'pending'
                            ? '#0c5460'
                            : '#155724',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                No violations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};