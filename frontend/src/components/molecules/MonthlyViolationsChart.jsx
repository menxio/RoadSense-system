"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const MonthlyViolationsChart = ({ violations = [] }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    // Process violations data to get monthly counts
    const monthlyData = processViolationsData(violations)

    setChartData({
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Speed Violations",
          data: monthlyData.speedData,
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
        },
        {
          label: "Noise Violations",
          data: monthlyData.noiseData,
          backgroundColor: "rgba(245, 158, 11, 0.7)",
          borderColor: "rgba(245, 158, 11, 1)",
          borderWidth: 1,
        },
      ],
    })
  }, [violations])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return (
    <Card sx={{ height: "100%", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Monthly Violations
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <Bar options={options} data={chartData} />
        </Box>
      </CardContent>
    </Card>
  )
}

// Helper function to process violations data for the chart
const processViolationsData = (violations) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentYear = new Date().getFullYear()

  // Initialize data arrays
  const speedData = Array(12).fill(0)
  const noiseData = Array(12).fill(0)

  // Count violations by month and type
  violations.forEach((violation) => {
    const date = new Date(violation.detected_at)
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth()

      // Determine violation type (simplified logic - adjust as needed)
      if (violation.speed > 30) {
        speedData[month]++
      }
      if (violation.decibel_level > 70) {
        noiseData[month]++
      }
    }
  })

  return {
    labels: months,
    speedData,
    noiseData,
  }
}

export default MonthlyViolationsChart
