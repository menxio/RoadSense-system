import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  CalendarMonth as CalendarIcon,
  Speed as SpeedIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";
import CustomBadge from "@/components/atoms/CustomBadge";
import StatusChip from "@/components/atoms/StatusChip";
import TableHeaderCell from "@/components/atoms/TableHeaderCell";
import AlertMessage from "@/components/molecules/AlertMessage";
import FilterToolbar from "@/components/molecules/FilterToolbar";
import ExportMenu from "@/components/molecules/ExportMenu";
import ViewModeTabs from "@/components/molecules/ViewModeTabs";
import SummaryFooter from "@/components/molecules/SummaryFooter";
import SummaryCards from "@/components/organisms/SummaryCards";
import DataTable from "@/components/organisms/DataTable";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { getViolations } from "@/services/violation.service";
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    setPage(1);
  }, [filterMonth, searchQuery]);

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
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

    setShowAlert(true);
    setAlertMessage("CSV report generated successfully");
    setAlertSeverity("success");
  };

  const handlePrint = () => {
    window.print();
  };

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
  const monthlyAverage = Math.round(totalViolations / (filterMonth ? 1 : 12));

  const tableColumns = [
    <TableHeaderCell
      key="user-id"
      icon={<PersonIcon fontSize="small" color="action" />}
    >
      User ID
    </TableHeaderCell>,
    <TableHeaderCell
      key="plate-number"
      icon={<CarIcon fontSize="small" color="action" />}
    >
      Plate Number
    </TableHeaderCell>,
    <TableHeaderCell
      key="date"
      icon={<CalendarIcon fontSize="small" color="action" />}
    >
      Date
    </TableHeaderCell>,
    <TableHeaderCell
      key="speed"
      icon={<SpeedIcon fontSize="small" color="action" />}
    >
      Speed (km/h)
    </TableHeaderCell>,
    <TableHeaderCell
      key="decibel"
      icon={<VolumeUpIcon fontSize="small" color="action" />}
    >
      Decibel Level (dB)
    </TableHeaderCell>,
    "Status",
  ];

  const renderViolationRow = (violation) => (
    <TableRow key={violation.id} hover>
      <TableCell>
        <CustomBadge>{violation.custom_user_id}</CustomBadge>
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
            fontWeight={violation.speed > 30 ? "bold" : "regular"}
            color={violation.speed > 30 ? "error.main" : "text.primary"}
          >
            {violation.speed ?? "N/A"}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            fontWeight={violation.decibel_level > 85 ? "bold" : "regular"}
            color={violation.decibel_level > 85 ? "error.main" : "text.primary"}
          >
            {violation.decibel_level ?? "N/A"}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <StatusChip status={violation.status} />
      </TableCell>
    </TableRow>
  );

  const emptyStateConfig = {
    icon: <FilterIcon fontSize="large" color="action" />,
    message: "No violations found for the selected filter.",
    subMessage:
      filterMonth || searchQuery ? "Try adjusting your filter criteria" : null,
    onReset: () => {
      setFilterMonth("");
      setSearchQuery("");
    },
    colSpan: 6,
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
        <AlertMessage
          open={showAlert}
          message={alertMessage}
          severity={alertSeverity}
          onClose={() => setShowAlert(false)}
        />

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
        <SummaryCards
          loading={loading}
          totalViolations={totalViolations}
          speedViolations={speedViolations}
          noiseViolations={noiseViolations}
          flaggedViolations={flaggedViolations}
          reviewedViolations={reviewedViolations}
          clearedViolations={clearedViolations}
          monthlyAverage={monthlyAverage}
          isFiltered={!!filterMonth}
        />

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
          <FilterToolbar
            filterMonth={filterMonth}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onRefresh={fetchViolations}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <ViewModeTabs value={viewMode} onChange={handleViewModeChange} />

            <ExportMenu
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
              onPrint={handlePrint}
              disabled={filteredViolations.length === 0}
            />
          </Box>
        </Box>

        {/* Content based on view mode */}
        {viewMode === "table" ? (
          <DataTable
            columns={tableColumns}
            data={filteredViolations}
            loading={loading}
            emptyState={emptyStateConfig}
            renderRow={renderViolationRow}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            paginationEnabled={true}
          />
        ) : (
          // Charts view (placeholder)
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
                      Charts
                    </Typography>
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <BarChartIcon
                          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          Charts???... Under Development ^^
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Bakit nga ba... you tell me.
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
        <SummaryFooter
          filteredCount={filteredViolations.length}
          totalCount={violations.length}
          filterMonth={filterMonth}
          searchQuery={searchQuery}
        />
      </Box>
    </Box>
  );
};

export default Reports;
