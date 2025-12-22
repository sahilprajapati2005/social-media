import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${id}/read`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      // Used for real-time socket events
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(n => n._id === action.payload);
        if (index !== -1) {
          state.items[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addNotification, clearUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;