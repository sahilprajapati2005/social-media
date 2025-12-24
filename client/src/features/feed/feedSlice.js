import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  message: '',
};

// 1. Get Feed Action
// export const getFeed = createAsyncThunk(
//   'feed/getFeed',
//   async (_, thunkAPI) => {
//     try {
//       const response = await api.get('/posts/feed');
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
export const getFeed = createAsyncThunk('feed/getAll', async (_, thunkAPI) => {
  try {
    // 1. Get the token from the auth state (Redux)
    const token = thunkAPI.getState().auth.user.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Format must match what your backend expects
      },
    };

    const response = await axios.get('http://localhost:5000/api/posts/feed', config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// ✅ 2. NEW: Toggle Like Action
export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (postId, thunkAPI) => {
    try {
      // Assumes backend route is PUT /api/posts/:id/like
      const response = await api.put(`/posts/${postId}/like`);
      
      // Return the postId so we know which post to update in the state
      // Return the new likes array (or count) from the server
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
  },
  extraReducers: (builder) => {
    builder
      // --- Get Feed Cases ---
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload; // Assuming payload is the array of posts
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- ✅ NEW: Toggle Like Cases ---
      .addCase(toggleLike.fulfilled, (state, action) => {
        // Find the post that was liked and update its likes array
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes; // Update the likes immediately in the UI
        }
      });
  },
});

export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;