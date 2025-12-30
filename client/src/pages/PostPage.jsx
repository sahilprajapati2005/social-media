import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

// App Logic
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';

// Components
import PostCard from '../features/feed/components/PostCard';
import Spinner from '../components/ui/Spinner';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Updated to use showToast to match your ToastContext implementation
  const { showToast } = useToast(); 
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Fetches data using the getPostById controller method
        const { data } = await api.get(`/posts/${postId}`);
        setPost(data);
      } catch (error) {
        console.error("Post Fetch Error:", error);
        // Updated to use showToast
        showToast("Post not found or deleted", "error");
        navigate('/'); 
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Navigation Header */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600 transition-colors"
      >
        <AiOutlineArrowLeft />
        <span>Back to Feed</span>
      </button>

      {/* Post Rendering: 
          PostCard handles the conditional logic for rendering 
          <img> or <video> based on post.mediaType automatically.
      */}
      {post ? (
        <PostCard post={post} />
      ) : (
        <div className="rounded-xl border border-red-100 bg-red-50 p-12 text-center text-red-600 font-semibold">
          Post not available.
        </div>
      )}
    </div>
  );
};

export default PostPage;