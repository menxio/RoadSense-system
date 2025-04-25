import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserDetailsModal = ({ open, onClose, user, apiUrl }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Modal Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          User Details
        </DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Modal Content */}
      <DialogContent>
        <Box sx={{ mt: 2, p: 2 }}>
          {/* License ID Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            {user.license_id_image && (
              <Avatar
                src={`${apiUrl}/${user.license_id_image}`}
                alt="License ID"
                sx={{
                  width: 150,
                  height: 150,
                  border: "2px solid #ddd",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </Box>

          {/* User Details in Two Columns */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                User ID:
              </Typography>
              <Typography variant="body2">{user.custom_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Name:
              </Typography>
              <Typography variant="body2">{user.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Email:
              </Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Plate Number:
              </Typography>
              <Typography variant="body2">{user.plate_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Role:
              </Typography>
              <Typography variant="body2">{user.role}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Status:
              </Typography>
              <Typography variant="body2">{user.status}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
