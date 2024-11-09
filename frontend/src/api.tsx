import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
// Update the axios instance configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Modify the request interceptor to skip auth for public routes
axiosInstance.interceptors.request.use((config) => {
  // List of public routes that don't need authentication
  const publicRoutes = ['/api/leaderboard'];
  
  // Only add auth header if the route is not public
  if (!publicRoutes.some(route => config.url?.includes(route))) {
    const token = localStorage.getItem('authToken');
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
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

export const getOpportunities = async () => {
  try {
    const response = await axiosInstance.get('/api/opportunities/');
    return response.data;
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    throw error;
  }
};

export const applyForOpportunity = async (opportunityId: number) => {
  try {
    const response = await axiosInstance.post(`/api/opportunities/${opportunityId}/apply/`);
    return response.data;
  } catch (error) {
    console.error("Error applying for opportunity:", error);
    throw error;
  }
};

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

// Add these types after the existing types
export interface CommunityPost {
  id: number;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  created_at: string;
  tags: string[];
}

// Add this type definition near your other types
export interface Comment {
  id: number;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
}

// Add these API functions before the final export
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    const response = await axiosInstance.get('/api/community/posts/');
    return response.data;
  } catch (error) {
    console.error("Error fetching community posts", error);
    throw error;
  }
};

export const createCommunityPost = async (postData: Partial<CommunityPost>): Promise<CommunityPost> => {
  try {
    const response = await axiosInstance.post('/api/community/posts/', postData);
    return response.data;
  } catch (error) {
    console.error("Error creating community post", error);
    throw error;
  }
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

export const updateProfile = async (data: Partial<Profile>) => {
  try {
    const response = await axiosInstance.patch('/api/profile/', data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log('Sending volunteer login data:', { email, password });
    const response = await axiosInstance.post('/api/login/', { 
      email,  // Changed from username to email
      password 
    });

    // Only set tokens if the response indicates it's a volunteer
    if (response.data.user_type !== 'volunteer') {
      throw new Error('This account is not registered as a volunteer');
    }

    localStorage.setItem('authToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', 'volunteer');
    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await axiosInstance.post('/api/logout/', { refresh: refreshToken });
    }
    // Clear all auth-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
  } catch (error) {
    console.error("Error logging out", error);
    // Still clear tokens even if API call fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
  }
};

export const getLeaderboard = async (): Promise<Volunteer[]> => {
  try {
    const response = await axiosInstance.get('/api/leaderboard/');
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard", error);
    throw error;
  }
};

export const likePost = async (postId: number): Promise<{ liked: boolean; likes_count: number }> => {
  try {
    const response = await axiosInstance.post(`/api/community/posts/${postId}/like/`);
    return response.data;
  } catch (error) {
    console.error("Error liking post", error);
    throw error;
  }
};

export const getPostComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await axiosInstance.get(`/api/community/posts/${postId}/comments/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments", error);
    throw error;
  }
};

export const createComment = async (postId: number, content: string): Promise<Comment> => {
  try {
    const response = await axiosInstance.post(`/api/community/posts/${postId}/comments/`, { content });
    return response.data;
  } catch (error) {
    console.error("Error creating comment", error);
    throw error;
  }
};

export interface OrganizationRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  name: string;           // Organization name
  description: string;
  location: string;
  website?: string;
  phone?: string;
  category: string;
}

export const registerOrganization = async (data: OrganizationRegisterData) => {
  try {
    // Create registration data with username set to email
    const registrationData = {
      ...data,
      username: data.email
    };
    
    console.log('Sending registration data:', registrationData);
    const response = await axiosInstance.post('/api/register/organization/', registrationData);
    
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', 'organization');
    
    return response.data;
  } catch (error: any) {
    console.error("Error registering organization:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const loginOrganization = async (email: string, password: string) => {
  try {
    console.log('Sending login data:', { email, password });
    const response = await axiosInstance.post('/api/login/organization/', { 
      email,
      password 
    });
    localStorage.setItem('authToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userType', 'organization');
    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const getOrganizationProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/organization/profile/');
    return response.data;
  } catch (error) {
    console.error("Error fetching organization profile", error);
    throw error;
  }
};

export const updateOrganizationProfile = async (data: Partial<OrganizationProfile>) => {
  try {
    const response = await axiosInstance.patch('/api/organization/profile/', data);
    return response.data;
  } catch (error) {
    console.error("Error updating organization profile", error);
    throw error;
  }
};

export const getRecommendedVolunteers = async () => {
  try {
    const response = await axiosInstance.get('/api/recommendations/volunteers/');
    return response.data.volunteers || [];
  } catch (error: any) {
    console.error("Error fetching recommended volunteers:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return [];
  }
};

export interface OpportunityFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  duration: number;
  skills_required: string[];
  volunteers_needed: number;
}

export const createOpportunity = async (data: OpportunityFormData) => {
  try {
    const response = await axiosInstance.post('/api/opportunities/', {
      ...data,
      volunteers_registered: 0,  // Set default value
      skills_required: Array.isArray(data.skills_required) ? data.skills_required : []
    });
    return response.data;
  } catch (error) {
    console.error("Error creating opportunity:", error);
    throw error;
  }
};

// Add this line to export the instance
export const api = axiosInstance;

export interface OrganizationProfile {
  name: string;
  description: string;
  location: string;
  website?: string;
  phone?: string;
  category: string;
  email: string;
}

// Add these interfaces
export interface Opportunity {
  id: number;
  title: string;
  description: string;
  organization: {
    id: number;
    name: string;
  };
  date: string;
  location: string;
  volunteers_needed: number;
  volunteers_registered: number;
  skills_required: string[];
  created_at: string;
}
