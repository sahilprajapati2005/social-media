import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 1. Fetch User Profile Metadata
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

// 2. Fetch User's Posts (For the Profile Media Grid)
// This action is critical for retrieving the images/videos and their mediaType
export const getUserProfilePosts = createAsyncThunk(
  'profile/getUserProfilePosts',
  async (userId, { rejectWithValue }) => {
    try {
      // Backend route: GET /api/posts/profile/:id
      const response = await api.get(`/posts/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

// 3. Update Profile (Bio, City, etc.)
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}`, formData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
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
      return { targetUserId, isFollowing, currentUserId }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Action failed');
    }
  }
);

const initialState = {
  profileUser: null, // User metadata
  userPosts: [],     // Array of post objects (includes image and mediaType)
  loading: false,
  postsLoading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profileUser = null;
      state.userPosts = [];
      state.loading = false;
      state.postsLoading = false;
      state.error = null;
      state.success = false;
    },
    // Useful for updating a specific post (like/comment) in the profile grid
    updateProfilePost: (state, action) => {
      const index = state.userPosts.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.userPosts[index] = action.payload;
      }
    }
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

      // --- Fetch User Posts (Media Grid) ---
      .addCase(getUserProfilePosts.pending, (state) => {
        state.postsLoading = true;
      })
      .addCase(getUserProfilePosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.userPosts = action.payload; // Contains posts with mediaType
      })
      .addCase(getUserProfilePosts.rejected, (state, action) => {
        state.postsLoading = false;
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
        const { targetUserId, isFollowing, currentUserId } = action.payload;
        if (state.profileUser && state.profileUser._id === targetUserId) {
          if (isFollowing) {
            state.profileUser.followers = state.profileUser.followers.filter(id => id !== currentUserId);
          } else {
            state.profileUser.followers.push(currentUserId);
          }
        }
      });
  },
});

export const { resetProfileState, updateProfilePost } = profileSlice.actions;
export default profileSlice.reducer;