import api from '../../utils/axios';

// Fetch Posts
export const getFeed = () => api.get('/posts/feed');
export const getUserPosts = (userId) => api.get(`/posts/profile/${userId}`);
export const getSinglePost = (postId) => api.get(`/posts/${postId}`);

// Create & Delete
export const createPost = (formData) => api.post('/posts', formData, {
  headers: {
    'Content-Type': 'multipart/form-data', 
  },
});
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

// Interactions
export const toggleLike = (postId) => api.put(`/posts/${postId}/like`);

// Comments
export const getComments = (postId) => api.get(`/posts/${postId}/comments`);
export const addComment = (postId, text) => api.post(`/posts/${postId}/comments`, { text });
export const deleteComment = (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`);

const feedApi = {
  getFeed,
  getUserPosts,
  getSinglePost,
  createPost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
  deleteComment
};

export default feedApi;