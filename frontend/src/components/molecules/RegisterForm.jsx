import { useState } from "react"
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  Alert,
} from "@mui/material"
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  DriveEta as DriveEtaIcon,
  DirectionsCar as CarIcon,
  Palette as PaletteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material"

const steps = [
  "Personal Info",
  "License Upload",
  "Vehicle Info",
]

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  position: "",
  license: null,
  vehicleType: "",
  plateNumber: "",
  vehicleColor: "",
}

const RegisterForm = ({ onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [licenseName, setLicenseName] = useState("")
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "license") {
      setForm({ ...form, license: files[0] })
      setLicenseName(files[0]?.name || "")
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const validateStep = () => {
    let stepErrors = {}
    if (activeStep === 0) {
      if (!form.firstName) stepErrors.firstName = "Required"
      if (!form.lastName) stepErrors.lastName = "Required"
      if (!form.email) stepErrors.email = "Required"
      if (!form.password) stepErrors.password = "Required"
      if (!form.confirmPassword) stepErrors.confirmPassword = "Required"
      else if (form.password !== form.confirmPassword) stepErrors.confirmPassword = "Passwords do not match"
      if (!form.phone) stepErrors.phone = "Required"
      if (!form.position) stepErrors.position = "Required"
    }
    if (activeStep === 1) {
      if (!form.license) stepErrors.license = "Required"
    }
    if (activeStep === 2) {
      if (!form.vehicleType) stepErrors.vehicleType = "Required"
      if (!form.plateNumber) stepErrors.plateNumber = "Required"
      if (!form.vehicleColor) stepErrors.vehicleColor = "Required"
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => setActiveStep((prev) => prev - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return
    setSubmitting(true)
    setApiError("")
    try {
      // Compose values for API
      const values = {
        username: form.firstName + " " + form.lastName,
        email: form.email,
        phone_number: form.phone,
        plate_number: form.plateNumber,
        password: form.password,
        school_id: form.schoolId,
        position: form.position,
        license_id_image: form.license,
        vehicle_type: form.vehicleType,
        vehicle_color: form.vehicleColor,
      }
      await onSubmit(values, {
        setSubmitting,
        setErrors: (errs) => setApiError(errs.apiError),
        resetForm: () => {
          setForm(initialForm)
          setActiveStep(0)
          setLicenseName("")
        },
      })
    } catch (err) {
      setApiError("An error occurred during registration")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 500, // reduced from 600
        mx: "auto",
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, #1976d2, #64b5f6)",
        },
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="#1976d2" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Register to access the Roadsense Traffic Monitoring System
        </Typography>
      </Box>
      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
        <Box sx={{ flex: 1, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              {/* First Name | Last Name */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  error={!!errors.firstName}
                  // helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  // helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
              </Box>
              {/* Email Address */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  // helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
              </Box>
              {/* Password | Confirm Password */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  error={!!errors.password}
                  // helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword || ''}
                  onChange={handleChange}
                  required
                  error={!!errors.confirmPassword}
                  // helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
              </Box>
              {/* Phone Number */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  error={!!errors.phone}
                  // helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ height: 40 }}
                />
              </Box>
              {/* School ID */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="School ID"
                  name="schoolId"
                  value={form.schoolId || ''}
                  onChange={handleChange}
                  required
                  error={!!errors.schoolId}
                  // helperText={errors.schoolId}
                  size="small"
                  sx={{ height: 40 }}
                />
              </Box>
              {/* Position Dropdown */}
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth required error={!!errors.position} size="small" sx={{ height: 40 }}>
                  <InputLabel>Position</InputLabel>
                  <Select
                    name="position"
                    value={form.position}
                    label="Position"
                    onChange={handleChange}
                  >
                    <MenuItem value="Faculty">Faculty</MenuItem>
                    <MenuItem value="Student">Student</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                License Upload
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ py: 2, fontSize: 12, borderStyle: "dashed" }}
                color={errors.license ? "error" : "primary"}
              >
                Upload License ID Image
                <input
                  type="file"
                  name="license"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={handleChange}
                />
              </Button>
              {/* Helper text for sample format */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 2 }}>
                Please upload a clear image of your license ID.<br />
                <b>File name format:</b> <i>firstname_lastname_license.jpg</i> (e.g., <i>juan_dela_cruz_license.jpg</i>)<br />
                <span style={{ color: '#888' }}>PNG, JPG up to 10MB. All details must be readable for admin verification.</span>
              </Typography>
              {/* Emphasized Image Preview with fixed height */}
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 140,
                  justifyContent: 'center',
                }}
              >
                {form.license ? (
                  <>
                    <img
                      src={URL.createObjectURL(form.license)}
                      alt="License Preview"
                      style={{
                        width: 150,
                        height: 'auto',
                        borderRadius: 10,
                        border: '2px solid #1976d2',
                        boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                        objectFit: 'cover',
                        maxHeight: 150,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem', wordBreak: 'break-all', textAlign: 'center' }}>
                      {licenseName}
                    </Typography>
                  </>
                ) : null}
              </Box>
              {errors.license && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.license}
                </Typography>
              )}
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Vehicle Information
              </Typography>
              {/* Vehicle Type | Vehicle Color side by side */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl fullWidth required error={!!errors.vehicleType} size="small" sx={{ width: '50%', height: 40 }}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    name="vehicleType"
                    value={form.vehicleType}
                    label="Vehicle Type"
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <DriveEtaIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                    <MenuItem value="Vehicle">Vehicle</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Vehicle Color"
                  name="vehicleColor"
                  value={form.vehicleColor}
                  onChange={handleChange}
                  required
                  error={!!errors.vehicleColor}
                  helperText={errors.vehicleColor}
                  size="small"
                  sx={{ width: '50%', height: 40 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaletteIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* Plate Number (full width) */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Plate Number"
                  name="plateNumber"
                  value={form.plateNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      plateNumber: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  error={!!errors.plateNumber}
                  helperText={errors.plateNumber}
                  size="small"
                  sx={{ height: 40 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CarIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", }}>
          <Button
            disabled={activeStep === 0 || submitting}
            onClick={handleBack}
            variant="outlined"
          >
            Previous
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Creating..." : "Create Account"}
            </Button>
          )}
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button href="/login" variant="text">
            Sign in here
          </Button>
        </Typography>
      </Box>
    </Paper>
  )
}

export default RegisterForm
