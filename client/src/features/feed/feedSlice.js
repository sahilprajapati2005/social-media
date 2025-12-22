import { createAsyncThunk } from '@reduxjs/toolkit';
import feedApi from './feedApi'; // Import the service

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await feedApi.getFeed(); // Use the service function
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});