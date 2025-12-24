// src/pages/FeedPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed } from '../features/feed/feedSlice';
import PostCard from '../features/feed/components/PostCard';

const FeedPage = () => {
  const dispatch = useDispatch();
  
  // Get auth state
  const { user, token } = useSelector((state) => state.auth); // Check for token too
  const { posts, isLoading, isError, message } = useSelector((state) => state.feed);

  useEffect(() => {
    // ✅ FIX: Only fetch if we have BOTH a user and a token
    if (user && token) {
      dispatch(getFeed());
    }
  }, [dispatch, user, token]); 

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  // ... rest of your component
  return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Render posts */}
      </div>
  )
};

export default FeedPage;