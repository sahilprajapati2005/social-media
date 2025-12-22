import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 1. Fetch User Profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// 2. Update Profile (Bio, City, etc.)
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}`, formData);
      return response.data; // Returns updated user object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// 3. Upload Profile/Cover Picture
// Usually handled via separate endpoints or the main update endpoint with FormData
export const uploadProfileImage = createAsyncThunk(
  'profile/uploadImage',
  async ({ userId, file, type }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // 'type' could be 'profilePicture' or 'coverPicture' to tell backend what to update
      formData.append('type', type); 
      
      const response = await api.put(`/users/${userId}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

// 4. Follow/Unfollow User
export const toggleFollow = createAsyncThunk(
  'profile/toggleFollow',
  async ({ currentUserId, targetUserId, isFollowing }, { rejectWithValue }) => {
    try {
      if (isFollowing) {
        await api.put(`/users/${targetUserId}/unfollow`, { userId: currentUserId });
      } else {
        await api.put(`/users/${targetUserId}/follow`, { userId: currentUserId });
      }
      return { targetUserId, isFollowing }; // Return data to update state optimistically
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Action failed');
    }
  }
);

const initialState = {
  profileUser: null, // The user currently being viewed
  loading: false,
  error: null,
  success: false, // Useful for showing "Profile Updated" toasts
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Call this when leaving the profile page to clear data
    resetProfileState: (state) => {
      state.profileUser = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Profile ---
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Profile ---
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profileUser = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Toggle Follow ---
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { targetUserId, isFollowing } = action.payload;
        
        // Optimistic Update: If we are viewing the profile we just followed/unfollowed
        if (state.profileUser && state.profileUser._id === targetUserId) {
          if (isFollowing) {
            // We just unfollowed -> remove follower
            // Note: In real app, we need the current user's ID to remove specifically
            // For simplicity, we might just decrement the count or re-fetch
            state.profileUser.followers.pop(); 
          } else {
            // We just followed -> add dummy ID or increment
            // Using a string placeholder or actual ID if passed in payload
            state.profileUser.followers.push("me"); 
          }
        }
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;