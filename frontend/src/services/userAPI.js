import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get('/api/users/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};