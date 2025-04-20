import api from '@/utils/api';

export const getViolations = async () => {
  try {
    const response = await api.get('/violations');
    return response.data;
  } catch (error) {
    console.error('Error fetching violations:', error);
    throw error;
  }
};

// Fetch a specific violation by ID
export const getViolationById = async (id) => {
  try {
    const response = await api.get(`/violations/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching violation with ID ${id}:`, error);
    throw error;
  }
};