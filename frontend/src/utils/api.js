import axios from 'axios';

// Get the base URL from environment variable or use default
const baseURL = (import.meta.env.VITE_API_URL || 'https://judgex.onrender.com') + '/api';

console.log('API Base URL:', baseURL); // Debug log

// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug log for requests
    console.log('Making API request to:', config.url, 'with headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Debug log for successful responses
    console.log('API response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    // Debug log for errors
    console.error('API error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 