import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import RegisterForm from "@/components/molecules/RegisterForm"
import api from "utils/api"

const Register = () => {
  const navigate = useNavigate()

  const handleRegister = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData()
      formData.append("name", values.username)
      formData.append("email", values.email)
      formData.append("plate_number", values.plate_number)
      formData.append("password", values.password)
      formData.append("school_id", values.school_id)
      formData.append("license_id_image", values.license_id_image)

      const response = await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      resetForm()
      navigate("/login", { state: { success: "Registration successful! Please log in." } })
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors({
          apiError: Object.values(err.response.data.errors).join(", "),
        })
      } else {
        setErrors({
          apiError: err.response?.data?.message || "An error occurred during registration",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left side - Branding */}
      <Box
        sx={{
          flex: "0 0 50%",
          bgcolor: "#0d1b2a",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: "radial-gradient(circle at 50% 50%, #1a2c42 0%, #0d1b2a 100%)",
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Logo and content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 400,
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: "#1976d2",
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </Box>

          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Roadsense
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
            Traffic Monitoring System
          </Typography>

          <Typography variant="body1" sx={{ mb: 5, opacity: 0.7, px: 4 }}>
            Join our platform to monitor and manage your traffic violations efficiently. Create an account to get
            started.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "center",
              width: "100%",
            }}
          >
          </Box>
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          flex: "0 0 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
        }}
      >
        <RegisterForm onSubmit={handleRegister} />
      </Box>
    </Box>
  )
}

export default Register
