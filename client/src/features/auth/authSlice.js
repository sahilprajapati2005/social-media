import { createSlice } from '@reduxjs/toolkit';

// --- Helper to Safely Parse User from LocalStorage ---
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === "undefined" || user === "null") {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Initialize State
const token = localStorage.getItem('token');
const user = getUserFromStorage();

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token, // True if token exists
  isLoading: false,
  isError: false,
  message: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Save to Local Storage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;