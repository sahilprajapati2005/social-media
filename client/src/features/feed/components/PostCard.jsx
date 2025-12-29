import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';

// Actions & Utils
import { toggleLike } from '../feedSlice';

// Components
import Avatar from '../../../components/ui/Avatar';
import Comments from './Comments';
import ShareModal from './ShareModal';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Local UI State
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false); // For simple animation effect

  // Derived State - Check if user is in the likes array
  const isLiked = post.likes.includes(user?._id);
  const likeCount = post.likes.length;

  const handleLike = () => {
    dispatch(toggleLike(post._id));
    
    // Trigger animation
    if (!isLiked) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 300);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* --- Header: User Info & Date --- */}
      {/* Changed post.userId to post.user._id to match populated data */}
      <div className="mb-3 flex items-center justify-between">
        <Link to={`/profile/${post.user?._id}`} className="flex items-center gap-3">
          <Avatar 
            src={post.user?.profilePicture} 
            alt={post.user?.username} 
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 hover:underline">
              {post.user?.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </Link>
      </div>

      {/* --- Content: Text --- */}
      {/* Changed post.desc to post.caption to match Post model */}
      {post.caption && (
        <p className="mb-3 whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.caption}
        </p>
      )}
      
      {/* --- Content: Image/Media --- */}
      {/* Changed post.img to post.image to match Post model */}
      {post.image && (
        <div className="mb-3 overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full object-cover max-h-[600px]"
            loading="lazy"
          />
        </div>
      )}

      {/* --- Action Bar: Like, Comment, Share --- */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex gap-6">
          
          {/* Like Button */}
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            {isLiked ? (
              <AiFillHeart className={`text-xl ${likeAnim ? 'scale-125 transition-transform' : ''}`} />
            ) : (
              <AiOutlineHeart className="text-xl" />
            )}
            <span className="text-sm font-medium">{likeCount > 0 ? likeCount : 'Like'}</span>
          </button>
          
          {/* Comment Button */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition ${
              showComments ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <AiOutlineComment className="text-xl" />
            <span className="text-sm font-medium">Comment</span>
          </button>
        </div>

        {/* Share Button */}
        <button 
          onClick={() => setShowShare(true)}
          className="flex items-center gap-1.5 text-gray-500 transition hover:text-green-600"
        >
          <AiOutlineShareAlt className="text-xl" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* --- Expandable Sections --- */}
      
      {/* Comments Section */}
      {showComments && (
        <Comments postId={post._id} />
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal 
          post={post} 
          onClose={() => setShowShare(false)} 
        />
      )}
    </div>
  );
};

export default PostCard;