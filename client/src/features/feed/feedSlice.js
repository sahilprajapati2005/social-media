import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    
    // 1. ADD THE REDUCER LOGIC HERE
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      
      if (post) {
        if (post.likes.includes(userId)) {
          // Unlike: Remove userId
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          // Like: Add userId
          post.likes.push(userId);
        }
      }
    },
  },
});

// 2. EXPORT IT HERE (This is what caused the error!)
export const { setPosts, toggleLike } = feedSlice.actions;

export default feedSlice.reducer;