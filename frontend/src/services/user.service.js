import api from '@/utils/api';

export const getUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data; 
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; 
  }
};