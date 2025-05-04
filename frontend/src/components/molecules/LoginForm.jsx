import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  InputLabel,
} from "@mui/material"
import { Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("")
    try {
      await onSubmit(values)
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Sign in to access your account
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(211, 47, 47, 0.15)", color: "#ff6b6b" }}>
              {loginError}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <InputLabel htmlFor="email" sx={{ mb: 0.5, fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
              Email
            </InputLabel>
            <Field name="email">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: "all 0.2s",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#ff6b6b",
                    },
                  }}
                />
              )}
            </Field>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <InputLabel htmlFor="password" sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
                Password
              </InputLabel>
              <Typography
                variant="caption"
                component={Link}
                to="/forgot-password"
                sx={{
                  color: "#64b5f6",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Typography>
            </Box>
            <Field name="password">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  variant="outlined"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: "all 0.2s",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#ff6b6b",
                    },
                  }}
                />
              )}
            </Field>
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
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              background: "linear-gradient(90deg, #1976d2, #64b5f6)",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.12)",
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#64b5f6", textDecoration: "none", fontWeight: 500 }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
