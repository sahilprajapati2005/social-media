// sahilprajapati2005/social-media/client/src/features/auth/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

/**
 * Safely retrieves and parses the user object from LocalStorage.
 * Ensures that 'following' and 'followers' arrays always exist to avoid UI crashes.
 */
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === "undefined" || user === "null") return null;
    
    const parsedUser = JSON.parse(user);
    
    // ✅ Ensure arrays exist to prevent "cannot read property includes of undefined"
    if (parsedUser) {
      parsedUser.following = parsedUser.following || [];
      parsedUser.followers = parsedUser.followers || [];
    }
    
    return parsedUser;
  } catch (error) {
    console.error("Auth Storage Error:", error);
    return null;
  }
};

const token = localStorage.getItem('token');
const user = getUserFromStorage();
const isValidToken = token && token !== "undefined" && token !== "null";

const initialState = {
  user: user,
  token: isValidToken ? token : null,
  isAuthenticated: !!isValidToken,
  isLoading: false,
  isError: false,
  message: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called during successful login or registration.
     * Persists the user data and JWT token to LocalStorage.
     */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      
      // ✅ Sanitize data before saving
      const sanitizedUser = {
        ...user,
        following: user.following || [],
        followers: user.followers || []
      };

      state.user = sanitizedUser;
      state.token = token;
      state.isAuthenticated = true;
      
      localStorage.setItem('user', JSON.stringify(sanitizedUser));
      localStorage.setItem('token', token);
    },

    /**
     * Clears all session data and redirects the app state to unauthenticated.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    /**
     * ✅ SYNC FOLLOW/UNFOLLOW
     * Keeps the 'following' list of the logged-in user updated across the app.
     * This ensures the "Unfollow" button shows up correctly on all profile pages.
     */
    updateFollowing: (state, action) => {
      const { targetId, isFollowing } = action.payload;
      
      if (state.user) {
        // Ensure the array exists before operating on it
        if (!state.user.following) state.user.following = [];

        if (isFollowing) {
          // Add to following list ONLY if it doesn't already exist
          if (!state.user.following.includes(targetId)) {
            state.user.following.push(targetId);
          }
        } else {
          // Remove from following list
          state.user.following = state.user.following.filter(id => id !== targetId);
        }
        
        // ✅ CRITICAL: Sync with LocalStorage so the state persists after a refresh
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateFollowing } = authSlice.actions;
export default authSlice.reducer;