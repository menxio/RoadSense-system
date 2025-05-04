import api from '@/utils/api';

const getDrivers = async () => {
  try {
    const response = await api.get('/drivers');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};


const addVehicle = async (vehicleData) => {
  try {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

export { getDrivers, addVehicle };