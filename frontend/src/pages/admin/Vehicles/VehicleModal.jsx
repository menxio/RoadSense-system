import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

const VehicleModal = ({
  open,
  onClose,
  editMode,
  vehicle,
  drivers,
  setVehicles,
  setMessage,
}) => {
  const [formData, setFormData] = useState({
    plate_number: '',
    owner_id: '',
    make: '',
    model: '',
    year: '',
    color: '',
  });

  useEffect(() => {
    if (editMode && vehicle) {
      setFormData(vehicle);
    } else {
      setFormData({
        plate_number: '',
        owner_id: '',
        make: '',
        model: '',
        year: '',
        color: '',
      });
    }
  }, [editMode, vehicle]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, ...formData } : v))
      );
      setMessage('Vehicle updated successfully!');
    } else {
      const newVehicle = { ...formData, id: Date.now() }; // Mock ID
      setVehicles((prev) => [...prev, newVehicle]);
      setMessage('Vehicle added successfully!');
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editMode ? 'Edit Vehicle' : 'Add Vehicle'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plate Number"
                name="plate_number"
                value={formData.plate_number}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Owner (Driver)"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="">Select a Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} (License: {driver.license_number})
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={formData.make}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editMode ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default VehicleModal;