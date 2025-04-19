import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ViolationsTable = ({ violations, onUpdateStatus, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState(''); // Filter by status

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
  };

  const filteredViolations = violations.filter((violation) =>
    statusFilter ? violation.status === statusFilter : true
  );

  return (
    <TableContainer component={Paper}>
      <FormControl sx={{ m: 2, minWidth: 120 }}>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Unpaid">Unpaid</MenuItem>
          <MenuItem value="Under Review">Under Review</MenuItem>
        </Select>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Fine Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredViolations.map((violation) => (
            <TableRow key={violation.id}>
              <TableCell>{violation.id}</TableCell>
              <TableCell>{violation.type}</TableCell>
              <TableCell>{violation.date}</TableCell>
              <TableCell>{violation.location}</TableCell>
              <TableCell>{violation.fine_amount}</TableCell>
              <TableCell>
                <Select
                  value={violation.status}
                  onChange={(e) =>
                    handleStatusChange(violation.id, e.target.value)
                  }
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => onDelete(violation.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViolationsTable;