import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { getViolations } from "@/services/violation.service";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(""); // Default: no filter

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const data = await getViolations();
        setViolations(data);
        setFilteredViolations(data); // Default: show all violations
      } catch (error) {
        console.error("Error fetching violations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const handleFilterChange = (event) => {
    const selectedMonth = event.target.value;
    setFilterMonth(selectedMonth);

    if (selectedMonth === "") {
      setFilteredViolations(violations); // Show all violations if no filter
    } else {
      const filtered = violations.filter((violation) => {
        const violationDate = new Date(violation.detected_at);
        return violationDate.getMonth() + 1 === parseInt(selectedMonth, 10); // Match month
      });
      setFilteredViolations(filtered);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Traffic Violations Report", 14, 20);

    const tableData = filteredViolations.map((violation) => [
      violation.custom_user_id,
      violation.plate_number,
      violation.detected_at,
      violation.speed ?? "N/A",
      violation.decibel_level ?? "N/A",
      violation.status,
    ]);

    doc.autoTable({
      head: [
        [
          "User ID",
          "Plate Number",
          "Date",
          "Speed (km/h)",
          "Decibel Level (dB)",
          "Status",
        ],
      ],
      body: tableData,
      startY: 30,
    });

    doc.save("Traffic_Violations_Report.pdf");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Reports
      </Typography>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Month</InputLabel>
          <Select
            value={filterMonth}
            onChange={handleFilterChange}
            label="Filter by Month"
          >
            <MenuItem value="">All Months</MenuItem>
            <MenuItem value="1">January</MenuItem>
            <MenuItem value="2">February</MenuItem>
            <MenuItem value="3">March</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">May</MenuItem>
            <MenuItem value="6">June</MenuItem>
            <MenuItem value="7">July</MenuItem>
            <MenuItem value="8">August</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleExportPDF}
          disabled={filteredViolations.length === 0}
        >
          Export as PDF
        </Button>
      </Box>

      {/* Violations Table */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Plate Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Speed (km/h)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Decibel Level (dB)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredViolations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>{violation.custom_user_id}</TableCell>
                  <TableCell>{violation.plate_number}</TableCell>
                  <TableCell>{violation.detected_at}</TableCell>
                  <TableCell>{violation.speed ?? "N/A"}</TableCell>
                  <TableCell>{violation.decibel_level ?? "N/A"}</TableCell>
                  <TableCell>{violation.status}</TableCell>
                </TableRow>
              ))}
              {filteredViolations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No violations found for the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reports;
