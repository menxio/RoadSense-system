import { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Skeleton,
  Alert,
  Collapse,
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  InsertDriveFile as CsvIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import { getViolations } from "@/services/violation.service";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const data = await getViolations();
      setViolations(data);
      setFilteredViolations(data);
      setShowAlert(true);
      setAlertMessage("Reports data loaded successfully");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error fetching violations:", error);
      setShowAlert(true);
      setAlertMessage("Failed to load reports data");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  useEffect(() => {
    let result = violations;

    if (filterMonth !== "") {
      result = result.filter((violation) => {
        const violationDate = new Date(violation.detected_at);
        return (
          violationDate.getMonth() + 1 === Number.parseInt(filterMonth, 10)
        );
      });
    }

    if (searchQuery) {
      result = result.filter(
        (violation) =>
          violation.custom_user_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          violation.plate_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredViolations(result);
  }, [filterMonth, searchQuery, violations]);

  const handleFilterChange = (event) => {
    setFilterMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("RoadSense Violations Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    if (filterMonth) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      doc.text(
        `Filtered by month: ${
          monthNames[Number.parseInt(filterMonth, 10) - 1]
        }`,
        14,
        34
      );
    }

    const tableData = filteredViolations.map((violation) => [
      violation.custom_user_id,
      violation.plate_number,
      new Date(violation.detected_at).toLocaleString(),
      violation.speed ?? "N/A",
      violation.decibel_level ?? "N/A",
      violation.status.toUpperCase(),
    ]);

    autoTable(doc, {
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
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [13, 27, 42], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save("Traffic_Violations_Report.pdf");
    handleExportClose();

    setShowAlert(true);
    setAlertMessage("PDF report generated successfully");
    setAlertSeverity("success");
  };

  const handleExportCSV = () => {
    const headers = [
      "User ID",
      "Plate Number",
      "Date",
      "Speed (km/h)",
      "Decibel Level (dB)",
      "Status",
    ];

    const csvData = filteredViolations.map((violation) => [
      violation.custom_user_id,
      violation.plate_number,
      new Date(violation.detected_at).toLocaleString(),
      violation.speed ?? "N/A",
      violation.decibel_level ?? "N/A",
      violation.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Traffic_Violations_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleExportClose();

    setShowAlert(true);
    setAlertMessage("CSV report generated successfully");
    setAlertSeverity("success");
  };

  const handlePrint = () => {
    window.print();
    handleExportClose();
  };

  const totalViolations = filteredViolations.length;
  const speedViolations = filteredViolations.filter(
    (v) => v.speed && v.speed > 30
  ).length;
  const noiseViolations = filteredViolations.filter(
    (v) => v.decibel_level && v.decibel_level > 85
  ).length;
  const flaggedViolations = filteredViolations.filter(
    (v) => v.status === "flagged"
  ).length;
  const reviewedViolations = filteredViolations.filter(
    (v) => v.status === "under review"
  ).length;
  const clearedViolations = filteredViolations.filter(
    (v) => v.status === "cleared"
  ).length;

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "flagged":
        return (
          <Chip
            size="small"
            icon={<WarningIcon fontSize="small" />}
            label="FLAGGED"
            color="error"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "under review":
        return (
          <Chip
            size="small"
            icon={<WarningAmberIcon fontSize="small" />}
            label="UNDER REVIEW"
            color="warning"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "cleared":
        return (
          <Chip
            size="small"
            icon={<CheckCircleIcon fontSize="small" />}
            label="CLEARED"
            color="success"
            sx={{ fontWeight: "bold" }}
          />
        );
      default:
        return <Chip size="small" label={status.toUpperCase()} />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role='admin' />
      <Header onToggleSidebar={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - 240px)` },
          mt: { xs: "64px", md: "64px" },
          p: { xs: 2, sm: 3, md: 4 },
          transition: "margin 0.2s, width 0.2s",
        }}
      >
        {/* Alert Message */}
        <Collapse in={showAlert}>
          <Alert
            severity={alertSeverity}
            onClose={() => setShowAlert(false)}
            sx={{ mb: 3 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 1, fontWeight: "bold", color: "#0d1b2a" }}
          >
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and export traffic violation reports and analytics
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Violations
                  </Typography>
                  <WarningIcon color="primary" />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  {loading ? <Skeleton width={80} /> : totalViolations}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<SpeedIcon fontSize="small" />}
                    label={`${speedViolations} Speed`}
                    color="error"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<VolumeUpIcon fontSize="small" />}
                    label={`${noiseViolations} Noise`}
                    color="info"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Status Breakdown
                  </Typography>
                  <PieChartIcon color="primary" />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  {loading ? <Skeleton width={80} /> : `${totalViolations}`}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    size="small"
                    icon={<WarningIcon fontSize="small" />}
                    label={`${flaggedViolations} Flagged`}
                    color="error"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<WarningAmberIcon fontSize="small" />}
                    label={`${reviewedViolations} Under Review`}
                    color="warning"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<CheckCircleIcon fontSize="small" />}
                    label={`${clearedViolations} Cleared`}
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Monthly Average
                  </Typography>
                  <BarChartIcon color="primary" />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  {loading ? (
                    <Skeleton width={80} />
                  ) : (
                    Math.round(totalViolations / (filterMonth ? 1 : 12))
                  )}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<CalendarIcon fontSize="small" />}
                    label={filterMonth ? "Filtered Month" : "All Months"}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter and Export Section */}
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
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Month</InputLabel>
              <Select
                value={filterMonth}
                onChange={handleFilterChange}
                label="Filter by Month"
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" />
                  </InputAdornment>
                }
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

            <TextField
              placeholder="Search by ID or plate"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: "250px" } }}
            />

            <Tooltip title="Refresh data">
              <IconButton
                onClick={fetchViolations}
                color="primary"
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Tabs
              value={viewMode}
              onChange={handleViewModeChange}
              sx={{ minHeight: 40 }}
            >
              <Tab
                value="table"
                icon={<TableChartIcon fontSize="small" />}
                label="Table"
                sx={{ minHeight: 40, textTransform: "none" }}
              />
              <Tab
                value="chart"
                icon={<BarChartIcon fontSize="small" />}
                label="Charts"
                sx={{ minHeight: 40, textTransform: "none" }}
              />
            </Tabs>

            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportClick}
              disabled={filteredViolations.length === 0}
            >
              Export
            </Button>
            <Menu
              anchorEl={exportAnchorEl}
              open={Boolean(exportAnchorEl)}
              onClose={handleExportClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleExportPDF}>
                <ListItemIcon>
                  <PdfIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export as PDF</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleExportCSV}>
                <ListItemIcon>
                  <CsvIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export as CSV</ListItemText>
              </MenuItem>
              <MenuItem onClick={handlePrint}>
                <ListItemIcon>
                  <PrintIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Print Report</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Content based on view mode */}
        {viewMode === "table" ? (
          <>
            {/* Violations Table */}
            {loading ? (
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "#f5f7fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Plate Number
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Speed (km/h)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Decibel Level (dB)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={120} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={150} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={32} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "#f5f7fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon fontSize="small" color="action" />
                          User ID
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CarIcon fontSize="small" color="action" />
                          Plate Number
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarIcon fontSize="small" color="action" />
                          Date
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SpeedIcon fontSize="small" color="action" />
                          Speed (km/h)
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <VolumeUpIcon fontSize="small" color="action" />
                          Decibel Level (dB)
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredViolations.map((violation) => (
                      <TableRow key={violation.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: "#e3f2fd",
                              color: "#1565c0",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              display: "inline-block",
                              fontWeight: "medium",
                              fontSize: "0.875rem",
                            }}
                          >
                            {violation.custom_user_id}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {violation.plate_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(violation.detected_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              fontWeight={
                                violation.speed > 30 ? "bold" : "regular"
                              }
                              color={
                                violation.speed > 30
                                  ? "error.main"
                                  : "text.primary"
                              }
                            >
                              {violation.speed ?? "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              fontWeight={
                                violation.decibel_level > 85
                                  ? "bold"
                                  : "regular"
                              }
                              color={
                                violation.decibel_level > 85
                                  ? "error.main"
                                  : "text.primary"
                              }
                            >
                              {violation.decibel_level ?? "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(violation.status)}</TableCell>
                      </TableRow>
                    ))}
                    {filteredViolations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FilterIcon fontSize="large" color="action" />
                            <Typography variant="h6" color="text.secondary">
                              No violations found for the selected filter.
                            </Typography>
                            {(filterMonth || searchQuery) && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                  setFilterMonth("");
                                  setSearchQuery("");
                                }}
                                sx={{ mt: 1 }}
                              >
                                Clear Filters
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          // Charts....nice to have
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                      Charts??? Under Development. Now if you may, please go
                      back to the table. Thank you ^^
                    </Typography>
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        px: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Wala pa bitaw ang charts ehehehehe... We just wanted
                          to try something out, plus, it's a nice to have
                          feature so maybe puhon. In God's perfect time. Awyeah.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Footer with summary */}
        <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredViolations.length} of {violations.length} total
            violations
            {filterMonth && (
              <>
                {" "}
                filtered by{" "}
                {new Date(
                  2023,
                  Number.parseInt(filterMonth, 10) - 1
                ).toLocaleString("default", {
                  month: "long",
                })}
              </>
            )}
            {searchQuery && <> with search term "{searchQuery}"</>}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
