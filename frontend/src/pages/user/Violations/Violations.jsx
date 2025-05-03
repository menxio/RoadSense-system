"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import ViolationsTable from "./ViolationsTable"
import { getViolationById, updateViolation } from "@/services/violation.service"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserProfile } from "../../../redux/slices/userSlice"

const Violations = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [violations, setViolations] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile())
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const violationsResponse = await getViolationById(user.custom_id)
        setViolations(violationsResponse.violations)
      } catch (error) {
        console.error("Error fetching violations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user.custom_id) {
      fetchData()
    }
  }, [dispatch, user.name, user.custom_id])

  const handleAppeal = async (id, data) => {
    try {
      await updateViolation(id, data);
      
      // Update the violations state to reflect the new status
      setViolations((prev) =>
        prev.map((violation) =>
          violation._id === id
            ? { ...violation, status: "under review" }
            : violation
        )
      )
    } catch (error) {
      console.error("Error submitting appeal:", error)
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role="user" />
      <Header onToggleSidebar={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: "64px", md: "64px" },
          p: { xs: 2, sm: 3, md: 4 },
          transition: "margin 0.2s, width 0.2s",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold", color: "#0d1b2a" }}>
            My Violations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage your traffic violations
          </Typography>
        </Box>

        {/* Pass updated `violations` state to ViolationsTable */}
        <ViolationsTable violations={violations} onAppeal={handleAppeal} isLoading={isLoading} />
      </Box>
    </Box>
  )
}

export default Violations
