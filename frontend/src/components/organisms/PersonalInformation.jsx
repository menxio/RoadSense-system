import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  InputAdornment,
  useTheme,
  Box,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  DirectionsCar as CarIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const PersonalInformationForm = ({
  profile,
  formErrors,
  fieldTouched,
  loading,
  hasChanges,
  onInputChange,
  onFieldBlur,
  onSubmit,
  onReset,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && hasChanges) {
      // If canceling edit mode with changes, reset the form
      onReset();
    }
  };

  const handleFormSubmit = async (e) => {
    await onSubmit(e);
    setIsEditing(false); // Disable editing after successful save
  };

  const renderFormField = (props) => {
    const {
      name,
      label,
      type = "text",
      icon,
      required = true,
      readOnly = false,
      ...textFieldProps
    } = props;
    const hasError = !!formErrors[name];
    const isTouched = fieldTouched[name];
    const isValid = isTouched && !hasError && profile[name];
    const fieldReadOnly = readOnly || !isEditing;

    return (
      <TextField
        label={label}
        name={name}
        type={type}
        value={profile[name] || ""}
        onChange={onInputChange}
        onBlur={() => onFieldBlur(name)}
        fullWidth
        required={required && isEditing}
        error={hasError && isEditing}
        helperText={isEditing ? formErrors[name] : ""}
        InputProps={{
          readOnly: fieldReadOnly,
          startAdornment: icon && (
            <InputAdornment position="start">
              {React.cloneElement(icon, {
                color:
                  hasError && isEditing
                    ? "error"
                    : isValid && isEditing
                    ? "success"
                    : "primary",
              })}
            </InputAdornment>
          ),
          endAdornment: isValid && isEditing && !readOnly && (
            <InputAdornment position="end">
              <CheckCircleIcon color="success" fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            transition: "all 0.2s ease-in-out",
            backgroundColor: fieldReadOnly
              ? theme.palette.action.hover
              : "transparent",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: !isEditing
                  ? theme.palette.divider
                  : hasError
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: isEditing ? 2 : 1,
              },
            },
          },
        }}
        {...textFieldProps}
      />
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, borderRadius: 2, boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Personal Information
        </Typography>
        <Button
          variant={isEditing ? "outlined" : "contained"}
          color={isEditing ? "inherit" : "primary"}
          startIcon={<EditIcon />}
          onClick={handleEditToggle}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            minWidth: 100,
          }}
        >
          {isEditing ? "Cancel Edit" : "Edit"}
        </Button>
      </Box>

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderFormField({
              name: "name",
              label: "Full Name",
              icon: <PersonIcon />,
            })}
          </Grid>

          <Grid item xs={12}>
            {renderFormField({
              name: "email",
              label: "Email Address",
              type: "email",
              icon: <EmailIcon />,
            })}
          </Grid>

          <Grid item xs={12}>
            {renderFormField({
              name: "phone_number",
              label: "Phone Number",
              type: "tel",
              icon: <PhoneIcon />,
            })}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderFormField({
              name: "plate_number",
              label: "Plate Number",
              icon: <CarIcon />,
            })}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderFormField({ name: "vehicle_color", label: "Vehicle Color" })}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderFormField({ name: "vehicle_type", label: "Vehicle Type" })}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderFormField({
              name: "school_id",
              label: "School ID",
              icon: <SchoolIcon />,
              required: false,
              readOnly: true,
            })}
          </Grid>

          {isEditing && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      minWidth: 120,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={!hasChanges || loading}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      minWidth: 140,
                      boxShadow: theme.shadows[4],
                      "&:hover": { boxShadow: theme.shadows[8] },
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </form>

      {!isEditing && hasChanges && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: theme.palette.warning.light,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="warning.dark">
            You have unsaved changes. Click "Edit" to modify your information.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PersonalInformationForm;
