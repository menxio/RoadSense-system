"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material"
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserProfile } from "../../../redux/slices/userSlice"
import { getViolationById, updateViolation } from "../../../services/violation.service"
import DashboardLayout from "../../../components/DashboardLayout"
import ViolationsTable from "./ViolationsTable"

const Violations = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [selectedFile, setSelectedFile] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentViolationId, setCurrentViolationId] = useState(null)
  const [violations, setViolations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("flagged")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAlert, setShowAlert] = useState(true)
  const [formData, setFormData] = useState({
    plate_number: "",
    detected_at: "",
    speed: 0,
    decibel_level: 0,
    status: "",
  })

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile())
    }

    const fetchUserViolations = async () => {
      try {
        setIsLoading(true)
        const violationsResponse = await getViolationById(user.custom_id)
        setViolations(violationsResponse.violations)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user.custom_id) {
      fetchUserViolations()
    }
  }, [dispatch, user.name, user.custom_id])

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleAppeal = (id) => {
    const selectedViolation = violations.find((violation) => violation.id === id)
    setCurrentViolationId(id)
    setSelectedFile(null)
    setFormData({
      plate_number: selectedViolation.plate_number,
      detected_at: selectedViolation.detected_at,
      speed: selectedViolation.speed,
      decibel_level: selectedViolation.decibel_level,
      status: selectedViolation.status,
    })
    setIsModalOpen(true)
  }

  const handleUpload = async () => {
    if (selectedFile && currentViolationId) {
      const uploadData = new FormData()
      uploadData.append("letter", selectedFile)
      uploadData.append("plate_number", formData.plate_number)
      uploadData.append("status", formData.status)
      const detectedAtISO = new Date(formData.detected_at).toISOString()
      uploadData.append("detected_at", detectedAtISO)
      uploadData.append("speed", formData.speed.toString())
      uploadData.append("decibel_level", formData.decibel_level.toString())

      try {
        const response = await updateViolation(currentViolationId, uploadData)
        console.log("Violation updated successfully:", response)
        setIsModalOpen(false)
        setSelectedFile(null)
        const violationsResponse = await getViolationById(user.custom_id)
        setViolations(violationsResponse.violations)
      } catch (error) {
        console.error("Error updating violation:", error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      const violationsResponse = await getViolationById(user.custom_id)
      setViolations(violationsResponse.violations)
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const violationCounts = {
    flagged: violations.filter((v) => v.status === "flagged").length,
    "under review": violations.filter((v) => v.status === "under review").length,
    cleared: violations.filter((v) => v.status === "cleared").length,
  }

  const filteredViolations = violations.filter(
    (violation) =>
      violation.status === activeTab &&
      (searchQuery === "" ||
        (violation.plate_number &&
          violation.plate_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (violation.custom_user_id &&
          violation.custom_user_id.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <DashboardLayout
        logo="/path/to/logo.png"
        sidebarItems={[
          { icon: <span>🏠</span>, label: "Home", path: "/home" },
          { icon: <span>📄</span>, label: "Violations", path: "/violations" },
        ]}
        activePath="/violations"
        onNavigate={(path) => console.log(`Navigate to ${path}`)}
        userName={user.name}
        userRole={user.role}
        userAvatarUrl="/path/to/avatar.jpg"
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 3 },
            transition: "margin 0.2s, width 0.2s",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#0f172a", mb: 1 }}
            >
              Traffic Violations
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Review and appeal your recorded traffic violations
            </Typography>

            {showAlert && (
              <Alert
                icon={<span style={{ color: "#166534", marginRight: "8px" }}>✓</span>}
                severity="success"
                sx={{
                  mb: 3,
                  alignItems: "center",
                  backgroundColor: "rgba(220, 252, 231, 0.8)",
                  color: "#166534",
                  border: "1px solid rgba(134, 239, 172, 0.5)",
                  borderRadius: "4px",
                  "& .MuiAlert-message": {
                    padding: "8px 0",
                  },
                }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setShowAlert(false)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Violations loaded successfully
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <TextField
                placeholder="Search by ID or plate"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "#ffffff",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e5e7eb",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleRefresh}
                sx={{
                  color: "#6b7280",
                  bgcolor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  "&:hover": {
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <ViolationsTable
            violations={filteredViolations}
            violationCounts={violationCounts}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAppeal={handleAppeal}
            isLoading={isLoading}
            isModalOpen={isModalOpen}
            selectedFile={selectedFile}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            handleCloseModal={handleCloseModal}
          />
        </Box>
      </DashboardLayout>
    </Box>
  )
}

export default Violations
