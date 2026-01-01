import axios from 'axios';
import { logout } from '../features/auth/authSlice'; // Adjust path to your authSlice

// 1. Create an Axios instance (Use this throughout your app instead of default axios)
const axiosInstance = axios.create({
  baseURL: 'https://social-app-psi-beige.vercel.app/api', // Backend API URL
  withCredentials: true, // Add this line to send cookies to the server
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Setup Interceptors Function
export const setupInterceptors = (store) => {
  
  // Request Interceptor: Attach Token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token; // Access token from Redux
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Handle Errors (like 401 Unauthorized)
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If token is expired or invalid (401)
      if (error.response && error.response.status === 401) {
        store.dispatch(logout()); // Trigger Redux logout action
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;