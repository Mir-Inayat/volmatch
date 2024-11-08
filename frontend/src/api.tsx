import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
// Update the axios instance configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Modify the request interceptor to skip auth for public routes
axiosInstance.interceptors.request.use((config) => {
  // List of public routes that don't need authentication
  const publicRoutes = ['/leaderboard'];
  
  // Only add auth header if the route is not public
  if (!publicRoutes.some(route => config.url?.includes(route))) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Add error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Types
export type Profile = {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  location: string;
  join_date: string;
  total_hours: number;
  skills: string[];
  badges: string[];
  activities: {
    id: number;
    title: string;
    date: string;
    hours: number;
  }[];
};

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  location: string;
  skills: string[];
  bio: string;
  interests: string[];
  availability: string[];
  experience?: string;
  profile_image?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// Add the Volunteer type if not already defined
export type Volunteer = {
  id: number;
  name: string;
  hours: number;
  rank?: number;
  tasks: number;
  rating: number;
  // Add any other fields that your leaderboard returns
};

// API functions
export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post('/api/register/', data);
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', 'volunteer');
    return response.data;
  } catch (error) {
    console.error("Error registering", error);
    throw error;
  }
};

export const fetchProfile = async (): Promise<Profile> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get('/api/profile/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please log in to view your profile');
      }
    }
    console.error("Error fetching profile", error);
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<Profile>) => {
  try {
    const response = await axiosInstance.patch('/api/profile/', profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/login/', { 
      username: email,
      password 
    });
    localStorage.setItem('authToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', 'volunteer');
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await axiosInstance.post('/api/logout/', { refresh: refreshToken });
    }
    // Clear tokens regardless of API call success
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error("Error logging out", error);
    // Still clear tokens even if API call fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

export const getLeaderboard = async (): Promise<Volunteer[]> => {
  try {
    const response = await axiosInstance.get('/leaderboard/');
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard", error);
    throw error;
  }
};

// Add this line to export the instance
export const api = axiosInstance;
