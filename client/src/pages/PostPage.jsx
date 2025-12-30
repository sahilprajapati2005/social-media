import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import PostCard from '../features/feed/components/PostCard';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../context/ToastContext';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast(); // Using addToast as requested
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // This endpoint requires router.get('/:id', ...) in postRoutes.js
        const { data } = await api.get(`/posts/${postId}`);
        setPost(data);
      } catch (error) {
        console.error("Post Fetch Error:", error);
        addToast("Post not found or deleted", "error");
        navigate('/'); 
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate, addToast]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600 transition-colors"
      >
        <AiOutlineArrowLeft />
        Back
      </button>

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