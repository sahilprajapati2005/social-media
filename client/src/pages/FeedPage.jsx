import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed } from '../features/feed/feedSlice';
import PostCard from '../features/feed/components/PostCard';

const FeedPage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (loading && posts.length === 0) {
    return <div className="p-8 text-center">Loading feed...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading feed</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Create Post Input Placeholder */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <input 
            type="text" 
            placeholder="What's on your mind?" 
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;