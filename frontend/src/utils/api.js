import axios from 'axios';

// Get the base URL from environment variable or use default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 