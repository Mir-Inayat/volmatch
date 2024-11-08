import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
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

// API functions
export const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/api/register/', data);
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

    const response = await api.get('/api/profile/');
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
    const response = await api.patch('/api/profile/', profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/login/', { 
      username: email,  // Keep username in the request for Django compatibility
      password 
    });
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
      await api.post('/api/logout/', { refresh: refreshToken });
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
