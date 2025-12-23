import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedApi from './feedApi';

// --- Async Thunks ---

// 1. Fetch Feed
export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await feedApi.getFeed();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// 2. Toggle Like (This was missing)
export const toggleLike = createAsyncThunk('feed/toggleLike', async (postId, { rejectWithValue }) => {
  try {
    const response = await feedApi.toggleLike(postId);
    return response.data; // Expecting the backend to return the updated post
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --- Slice Definition ---

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Optional: Synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch feed';
      })

      // Handle Toggle Like (Update the specific post in the list)
      .addCase(toggleLike.fulfilled, (state, action) => {
        // Assuming the backend returns the *updated post object* in action.payload
        const updatedPost = action.payload;
        const index = state.posts.findIndex((post) => post._id === updatedPost._id);
        
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      });
  },
});

export default feedSlice.reducer;