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
  Phone as PhoneIcon,
} from "@mui/icons-material"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone_number: Yup.string()
    .matches(/^\+63[0-9]{10}$/, "Must be a valid Philippine mobile number (e.g., +639123456789)")
    .required("Required"),
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
    }
  }

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        phone_number: "",
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
              p: { xs: 1.5, sm: 2 },
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

            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5, mb: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="username" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                  Username
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                </InputLabel>
                <Field name="username">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="username"
                      placeholder="Username"
                      variant="outlined"
                      size="small"
                      error={meta.touched && Boolean(meta.error)}
                      helperText=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" sx={{ pl: 1 }} />
                          </InputAdornment>
                        ),
                        sx: { fontSize: "0.8rem", height: 36 },
                      }}
                      inputProps={{
                        style: { fontSize: "0.8rem" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.8rem",
                          height: 36,
                          minHeight: 36,
                          padding: 0,
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="email" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                  Email
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                </InputLabel>
                <Field name="email">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="email"
                      placeholder="Email"
                      variant="outlined"
                      size="small"
                      error={meta.touched && Boolean(meta.error)}
                      helperText=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" color="action" sx={{ pl: 1 }} />
                          </InputAdornment>
                        ),
                        sx: { fontSize: "0.8rem", height: 36 },
                      }}
                      inputProps={{
                        style: { fontSize: "0.8rem"},
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.8rem",
                          height: 36,
                          minHeight: 36,
                          padding: 0,
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="phone_number" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                  Phone Number
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                </InputLabel>
                <Field name="phone_number">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="phone_number"
                      placeholder="+639123456789"
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText=""
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" color="action" sx={{ pl: 0.5 }} />
                          </InputAdornment>
                        ),
                        sx: { fontSize: "0.8rem", height: 36 },
                      }}
                      inputProps={{
                        style: { fontSize: "0.8rem", padding: "6px 8px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.8rem",
                          height: 36,
                          minHeight: 36,
                          padding: 0,
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5, mb: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="plate_number" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                  Plate Number
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                </InputLabel>
                <Field name="plate_number">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="plate_number"
                      placeholder="Plate Number"
                      variant="outlined"
                      size="small"
                      error={meta.touched && Boolean(meta.error)}
                      helperText=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DirectionsCarIcon fontSize="small" color="action" sx={{ pl: 1 }} />
                          </InputAdornment>
                        ),
                        sx: { fontSize: "0.8rem", height: 36 },
                      }}
                      inputProps={{
                        style: { fontSize: "0.8rem" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.8rem",
                          height: 36,
                          minHeight: 36,
                          padding: 0,
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel htmlFor="school_id" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                  School ID
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                </InputLabel>
                <Field name="school_id">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="school_id"
                      placeholder="School ID"
                      variant="outlined"
                      size="small"
                      error={meta.touched && Boolean(meta.error)}
                      helperText=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon fontSize="small" color="action" sx={{ pl: 1 }} />
                          </InputAdornment>
                        ),
                        sx: { fontSize: "0.8rem", height: 36 },
                      }}
                      inputProps={{
                        style: { fontSize: "0.8rem" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.8rem",
                          height: 36,
                          minHeight: 36,
                          padding: 0,
                        },
                      }}
                    />
                  )}
                </Field>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel htmlFor="password" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                Password
                <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
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
                    size="small"
                    error={meta.touched && Boolean(meta.error)}
                    helperText=""
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" sx={{ pl: 1 }} />
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
                            {showPassword ? <VisibilityOff fontSize="small" sx={{ pr: 1 }} /> : <Visibility fontSize="small" sx={{ pr: 1 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { fontSize: "0.8rem", height: 36 },
                    }}
                    inputProps={{
                      style: { fontSize: "0.8rem" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.8rem",
                        height: 36,
                        minHeight: 36,
                        padding: 0,
                      },
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel htmlFor="confirmPassword" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                Confirm Password
                <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
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
                    size="small"
                    error={meta.touched && Boolean(meta.error)}
                    helperText=""
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" sx={{ pl: 1 }} />
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
                              <VisibilityOff fontSize="small" sx={{ pr: 1 }} />
                            ) : (
                              <Visibility fontSize="small" sx={{ pr: 1 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { fontSize: "0.8rem", height: 36 },
                    }}
                    inputProps={{
                      style: { fontSize: "0.8rem" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.8rem",
                        height: 36,
                        minHeight: 36,
                        padding: 0,
                      },
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputLabel htmlFor="license_id" sx={{ mb: 0.25, fontSize: "0.7rem", color: "text.secondary" }}>
                License ID Image
                <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
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
                {values.license_id_image && (
                  <Typography variant="caption" sx={{ mt: 1, mb: 2, display: "block", textAlign: "center" }}>
                    {values.license_id_image.name}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.25,
                    mb: 1,
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "0.7rem"
                  }}
                >
                  Filename format: <b>LASTNAME_FIRSTNAME_MI.jpg</b>
                </Typography>
                {touched.license_id_image && errors.license_id_image && (
                  <FormHelperText error>{errors.license_id_image}</FormHelperText>
                )}
              </Box>
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
