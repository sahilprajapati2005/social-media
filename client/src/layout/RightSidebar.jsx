import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineUserAdd } from 'react-icons/ai';

import api from '../utils/axios'; 
import { updateFollowing } from '../features/auth/authSlice'; 
import { useToast } from '../context/ToastContext'; 

import Avatar from '../components/ui/Avatar'; 
import Spinner from '../components/ui/Spinner';

const RightSidebar = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentUser?._id) return;

      try {
        setLoading(true);
        const { data } = await api.get('/users/suggestions');
        
        const notFollowed = (data || []).filter(u => 
          u._id !== currentUser._id && !currentUser.following?.includes(u._id)
        );
        
        setSuggestions(notFollowed.slice(0, 5));
      } catch (err) {
        console.error("Suggestion Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUser?._id, currentUser?.following?.length]); 

  const handleFollow = async (targetId) => {
    try {
      setFollowLoading(targetId);
      const response = await api.put(`/users/${targetId}/follow`);
      const { isFollowing } = response.data;

      dispatch(updateFollowing({ targetId, isFollowing }));
      setSuggestions((prev) => prev.filter((u) => u._id !== targetId));
      
      showToast("User followed", "success");
    } catch (err) {
      showToast("Failed to follow user", "error");
    } finally {
      setFollowLoading(null);
    }
  };

  if (!currentUser) return null;

  return (
    <aside className="hidden w-80 flex-col gap-4 p-4 lg:flex sticky top-16 h-fit">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm min-h-[200px]">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500">
          Who to follow
        </h3>
        
        <div className="flex flex-col gap-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner size="sm" />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div key={user._id} className="flex items-center justify-between group">
                <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                  <Avatar src={user.profilePicture} size="sm" />
                  <div className="flex flex-col overflow-hidden max-w-[120px]">
                    <span className="truncate text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user.username}
                    </span>
                  </div>
                </Link>
                
                <button 
                  onClick={() => handleFollow(user._id)}
                  disabled={followLoading === user._id}
                  className="flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {followLoading === user._id ? <Spinner size="xs" /> : <AiOutlineUserAdd />}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-gray-400 py-4">No new suggestions</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;