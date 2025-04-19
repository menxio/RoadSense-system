import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import VehicleTable from './VehicleTable';
import VehicleModal from './VehicleModal';
import { getDrivers } from '@/services/vehicle.service';

const Vehicles = () => {
  const [drivers, setDrivers] = useState([]); // List of drivers
  const [vehicles, setVehicles] = useState([]); // List of vehicles
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [editMode, setEditMode] = useState(false); // Track if editing
  const [editVehicle, setEditVehicle] = useState(null); // Vehicle being edited
  const [message, setMessage] = useState(''); // Success/Error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverData = await getDrivers();
        setDrivers(driverData);

        // Mock vehicle data (replace with API call to fetch vehicles)
        setVehicles([
          {
            id: 1,
            plate_number: 'ABC123',
            owner_name: 'John Doe',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            color: 'White',
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setEditMode(false);
    setEditVehicle(null);
    setModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditMode(true);
    setEditVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    setMessage('Vehicle deleted successfully!');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Manage Vehicles
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ mb: 2 }}
          >
            Add Vehicle
          </Button>
          {message && (
            <Typography
              variant="body1"
              sx={{ mt: 2, color: message.includes('successfully') ? 'green' : 'red' }}
            >
              {message}
            </Typography>
          )}
          <VehicleTable
            vehicles={vehicles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Container>
      </Box>
      <VehicleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editMode={editMode}
        vehicle={editVehicle}
        drivers={drivers}
        setVehicles={setVehicles}
        setMessage={setMessage}
      />
    </Box>
  );
};

export default Vehicles;