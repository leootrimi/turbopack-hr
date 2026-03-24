import axios, { AxiosRequestConfig } from 'axios';

// Create a custom axios instance
export const api = axios.create({
  baseURL: 'http://localhost:3000', // Update this if API runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic function to handle requests
export const makeRequest = async <T,>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api(config);
  return response.data;
};
