import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Updated to remove trailing slash

// Function to log in using username and password
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login/`, { username, password }); // Updated to include password
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

// Example function to get data
export const getData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/data-endpoint`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};
