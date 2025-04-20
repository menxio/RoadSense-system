import React, { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ViolationsTable = ({ violations, onUpdateStatus, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status

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
          <MenuItem value="flagged">Flagged</MenuItem>
          <MenuItem value="reviewed">Reviewed</MenuItem>
          <MenuItem value="cleared">Cleared</MenuItem>
        </Select>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Plate Number</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Speed</TableCell>
            <TableCell>Decibel Level</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredViolations.map((violation) => (
            <TableRow key={violation._id}>
              <TableCell>{violation.custom_user_id}</TableCell>
              <TableCell>{violation.plate_number}</TableCell>
              <TableCell>
                {new Date(violation.detected_at).toLocaleString()}
              </TableCell>
              <TableCell>{violation.speed ?? "N/A"} km/h</TableCell>
              <TableCell>{violation.decibel_level ?? "N/A"} dB</TableCell>
              <TableCell>
                <Select
                  value={violation.status}
                  onChange={(e) =>
                    handleStatusChange(violation._id, e.target.value)
                  }
                >
                  <MenuItem value="flagged">Flagged</MenuItem>
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                  <MenuItem value="cleared">Cleared</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => onDelete(violation._id)}
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
