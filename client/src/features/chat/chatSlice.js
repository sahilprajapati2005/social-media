import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const response = await api.get('/chats');
  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    activeChat: null,
    messages: [], // Messages for the active chat
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });
  }
});

export const { setActiveChat, addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;