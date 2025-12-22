import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import api from '../../../utils/axios';

const FollowListModal = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        // Endpoint example: /users/123/followers
        const { data } = await api.get(`/users/${userId}/${type}`);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch list");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold capitalize">{type}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No users found.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <Link 
                    to={`/profile/${user._id}`} 
                    onClick={onClose}
                    className="flex items-center gap-3 hover:opacity-80"
                  >
                    <img
                      src={user.profilePicture || 'https://via.placeholder.com/40'}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-800">{user.username}</span>
                  </Link>
                  {/* Optional: Add Follow/Unfollow button here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;