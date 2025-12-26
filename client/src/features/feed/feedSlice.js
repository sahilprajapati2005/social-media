import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  message: '',
};

// 1. Get Feed Action
export const getFeed = createAsyncThunk(
  'feed/getFeed',
  async (_, thunkAPI) => {
    try {
      // Using the centralized 'api' instance which handles base URL and token headers
      const response = await api.get('/posts/feed');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. Toggle Like Action
// Exported as a named export to fix the SyntaxError in PostCard.jsx
export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (postId, thunkAPI) => {
    try {
      // Backend route: PUT /api/posts/:id/like
      const response = await api.put(`/posts/${postId}/like`);
      
      // Return the postId and the updated likes array from the server
      return { postId, likes: response.data }; 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    // 3. Add Post Reducer
    // Added to fix the SyntaxError in CreatePostWidget.jsx
    addPost: (state, action) => {
      // Pushes the new post to the beginning of the array so it appears at the top
      state.posts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Get Feed Cases ---
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload; 
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- Toggle Like Case ---
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          // Update the likes array in the specific post object
          post.likes = likes; 
        }
      });
  },
});

// Export all actions
export const { resetFeed, addPost } = feedSlice.actions;
export default feedSlice.reducer;