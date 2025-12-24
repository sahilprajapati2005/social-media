import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// --- HELPER: Safely parse JSON from Local Storage ---
// This prevents the "undefined" SyntaxError crash
const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing ${key} from storage:`, error);
    return defaultValue;
  }
};

const initialState = {
  chats: [],
  // Use the helper to safely load 'activeChat' if you were persisting it
  activeChat: getFromStorage('activeChat', null), 
  notifications: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Async Thunk: Fetch User Chats
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/chat');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk: Create or Access Chat
export const accessChat = createAsyncThunk(
  'chat/accessChat',
  async (userId, thunkAPI) => {
    try {
      const response = await api.post('/chat', { userId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      // Optional: Save to storage to persist selection on refresh
      localStorage.setItem('activeChat', JSON.stringify(action.payload));
    },
    clearActiveChat: (state) => {
      state.activeChat = null;
      localStorage.removeItem('activeChat');
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Access Chat
      .addCase(accessChat.fulfilled, (state, action) => {
        // If chat exists, update it; otherwise add to list
        if (!state.chats.find((c) => c._id === action.payload._id)) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
      });
  },
});

export const { setActiveChat, clearActiveChat, setNotifications } = chatSlice.actions;
export default chatSlice.reducer;