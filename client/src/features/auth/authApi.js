import api from '../../utils/axios';

// Login & Registration
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const logoutUser = () => api.post('/auth/logout');

// OTP Logic
export const verifyOtp = (data) => api.post('/auth/verify-otp', data);
export const resendOtp = (data) => api.post('/auth/resend-otp', data);

// Password Recovery
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password });
export const updatePassword = (data) => api.put('/users/update-password', data);

// Account Management
export const deleteAccount = (userId) => api.delete(`/users/${userId}`);

const authApi = {
  loginUser,
  registerUser,
  logoutUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteAccount
};

export default authApi;