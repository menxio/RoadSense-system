import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  FormHelperText,
  CircularProgress,
  InputLabel,
  Fade,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  DirectionsCar as DirectionsCarIcon,
  Badge as BadgeIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  plate_number: Yup.string().required("Required"),
  school_id: Yup.string().required("Required"),
  password: Yup.string().min(8, "Min 8 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  license_id_image: Yup.mixed().required("Required"),
})

const RegisterForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0]
    if (file) {
      setFieldValue("license_id_image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        plate_number: "",
        school_id: "",
        password: "",
        confirmPassword: "",
        license_id_image: null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 500,
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

            {errors.apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.apiError}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="username" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                  Username
                </InputLabel>
                <Field name="username">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="username"
                      placeholder="Username"
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="email" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                  Email
                </InputLabel>
                <Field name="email">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="email"
                      placeholder="Email"
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="plate_number" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                  Plate Number
                </InputLabel>
                <Field name="plate_number">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="plate_number"
                      placeholder="Plate Number"
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DirectionsCarIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="school_id" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                  School ID
                </InputLabel>
                <Field name="school_id">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="school_id"
                      placeholder="School ID"
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel htmlFor="password" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                Password
              </InputLabel>
              <Field name="password">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    variant="outlined"
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                        },
                      },
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel htmlFor="confirmPassword" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                Confirm Password
              </InputLabel>
              <Field name="confirmPassword">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    variant="outlined"
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                        },
                      },
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputLabel htmlFor="license_id" sx={{ mb: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                License ID Image
              </InputLabel>
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="license-id-upload"
                  type="file"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                />
                <label htmlFor="license-id-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    size="medium"
                    color={touched.license_id_image && errors.license_id_image ? "error" : "primary"}
                    sx={{
                      textTransform: "none",
                      py: 0.75,
                      border: "1px dashed",
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Upload License ID
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
                  Upload a clear image of your license ID
                </Typography>
                {touched.license_id_image && errors.license_id_image && (
                  <FormHelperText error>{errors.license_id_image}</FormHelperText>
                )}
              </Box>

              {previewImage && (
                <Fade in={Boolean(previewImage)}>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="License ID Preview"
                      style={{ maxWidth: "100%", maxHeight: "70px", objectFit: "contain" }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
                      {values.license_id_image?.name || "License ID image"}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{
                py: 1.2,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 1,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.2)",
                },
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
