// sahilprajapati2005/social-media/.../client/src/pages/FeedPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed } from '../features/feed/feedSlice';
import PostCard from '../features/feed/components/PostCard';
import CreatePostWidget from '../features/feed/components/CreatePostWidget'; // 1. Import the widget

const FeedPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    if (user && token) {
      dispatch(getFeed());
    }
  }, [dispatch, user, token]); 

  if (isLoading) return <div className="p-4 text-center">Loading feed...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* 2. Add the Widget here so it is visible */}
      <CreatePostWidget />

      {/* 3. Render the list of posts */}
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts to show. Start by creating one!</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;