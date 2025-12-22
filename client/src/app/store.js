import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import authReducer from '../features/auth/authSlice';
import feedReducer from '../features/feed/feedSlice';
import chatReducer from '../features/chat/chatSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    profile: profileReducer,
  },
  // Middleware configuration to prevent warnings about non-serializable data 
  // (useful if passing Dates or complex objects in actions)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});