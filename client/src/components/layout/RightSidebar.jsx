import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineUserAdd } from 'react-icons/ai';
import api from '../../utils/axios';
import Avatar from '../ui/Avatar';

const RightSidebar = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Backend: Endpoint that returns random users or users with mutual friends
        const { data } = await api.get('/users/suggestions');
        // Filter out users already followed (double check)
        const notFollowed = data.filter(u => 
          u._id !== currentUser._id && !currentUser.following.includes(u._id)
        );
        setSuggestions(notFollowed.slice(0, 5)); // Limit to 5
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser) fetchSuggestions();
  }, [currentUser]);

  if (suggestions.length === 0) return null;

  return (
    <div className="hidden w-72 flex-col gap-4 p-4 lg:flex">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-bold text-gray-500">Who to follow</h3>
        
        <div className="flex flex-col gap-4">
          {suggestions.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <Link to={`/profile/${user._id}`} className="flex items-center gap-2 hover:opacity-80">
                <Avatar src={user.profilePicture} size="sm" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{user.username}</span>
                  {/* Optional: Show mutual friends count if available */}
                </div>
              </Link>
              
              <Link 
                to={`/profile/${user._id}`}
                className="flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition"
                title="View Profile"
              >
                <AiOutlineUserAdd />
              </Link>
            </div>
          ))}
        </div>
        
        <Link to="/search" className="mt-4 block text-xs text-blue-500 hover:underline">
          View more
        </Link>
      </div>

      {/* Footer / Copyright */}
      <div className="px-2 text-xs text-gray-400">
        <p>© 2024 Social Media App.</p>
        <p>Built with MERN Stack.</p>
      </div>
    </div>
  );
};

export default RightSidebar;