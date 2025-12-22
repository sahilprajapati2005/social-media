import { createSlice } from '@reduxjs/toolkit';

// Helper to read from local storage safely
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;