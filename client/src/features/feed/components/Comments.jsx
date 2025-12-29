// sahilprajapati2005/social-media/client/src/features/feed/components/Comments.jsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'; // Added parseISO and isValid
import api from '../../../utils/axios';
import Avatar from '../../../components/ui/Avatar';

const Comments = ({ postId }) => {
  const { user } = useSelector((state) => state.auth);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to safely format the date
  const getFormattedDate = (dateString) => {
    if (!dateString) return 'Just now';
    
    // Parse the date safely
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    
    // Check if the resulting date is valid to prevent RangeError
    if (!isValid(date)) return 'Just now';
    
    return formatDistanceToNow(date, { addSuffix: true });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`);
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        text: newComment,
        userId: user._id
      });
      
      // data should be the new comment object returned from the server
      setComments((prev) => [data, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      {/* Input Area */}
      <div className="flex gap-3 mb-6">
        <Avatar src={user.profilePicture} size="sm" />
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading || !newComment.trim()}
            className="text-sm font-semibold text-blue-600 disabled:text-gray-400"
          >
            Post
          </button>
        </form>
      </div>

      {/* List of Comments */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Link to={`/profile/${comment.user?._id}`}>
                <Avatar src={comment.user?.profilePicture} size="sm" />
              </Link>
              <div className="flex flex-col">
                <div className="rounded-2xl bg-gray-100 px-3 py-2">
                  <Link to={`/profile/${comment.user?._id}`} className="block text-xs font-bold text-gray-900 hover:underline">
                    {comment.user?.username}
                  </Link>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
                {/* Safe Date Formatting */}
                <span className="ml-2 mt-1 text-xs text-gray-500">
                  {getFormattedDate(comment.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;