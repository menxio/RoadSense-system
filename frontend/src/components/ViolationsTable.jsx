import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
export const ViolationsTable = ({ violations }) => {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: '#0a192f', fontWeight: 600, mb: 2 }}>
        Recent Violations
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Violation Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Penalty Level</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violations.length > 0 ? (
              violations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>{violation.date}</TableCell>
                  <TableCell>{violation.type}</TableCell>
                  <TableCell>{violation.location}</TableCell>
                  <TableCell>{violation.penaltyLevel}</TableCell>
                  <TableCell>{violation.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No violations found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
ViolationsTable.propTypes = {
  violations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      penaltyLevel: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
}