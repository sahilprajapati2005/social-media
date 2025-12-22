import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../context/ToastContext';
import api from '../utils/axios';

// Components
import PostCard from '../features/feed/components/PostCard';
import FollowListModal from '../features/profile/components/FollowListModal';
import EditProfileModal from '../features/profile/components/EditProfileModal'; // Imported
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar'; 
import { AiFillCamera } from 'react-icons/ai';

const ProfilePage = () => {
  const { userId } = useParams(); 
  const { user: currentUser } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  
  // Local State
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Modal States
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  const [showEditModal, setShowEditModal] = useState(false); // Edit Modal State

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === 'me' || userId === currentUser?._id;
  const idToFetch = isOwnProfile ? currentUser?._id : userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        if (!idToFetch) return;

        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${idToFetch}`),
          api.get(`/posts/profile/${idToFetch}`)
        ]);

        setProfileUser(userRes.data);
        setPosts(postsRes.data);
        
        if (currentUser && userRes.data) {
          setIsFollowing(currentUser.following.includes(userRes.data._id));
        }

      } catch (error) {
        console.error("Profile load failed", error);
        addToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    // Refresh when userId changes or when user edits profile (detected via modal close logic if needed)
  }, [idToFetch, currentUser, addToast, showEditModal]); 

  const handleFollowToggle = async () => {
    if (isOwnProfile) return;

    // Optimistic Update
    setIsFollowing((prev) => !prev);
    setProfileUser((prev) => ({
      ...prev,
      followers: isFollowing 
        ? prev.followers.filter(id => id !== currentUser._id)
        : [...prev.followers, currentUser._id]
    }));

    try {
      if (isFollowing) {
        await api.put(`/users/${profileUser._id}/unfollow`);
      } else {
        await api.put(`/users/${profileUser._id}/follow`);
      }
    } catch (error) {
      setIsFollowing((prev) => !prev); // Revert
      addToast("Action failed", "error");
    }
  };

  const openFollowModal = (type) => {
    setFollowModalType(type);
    setShowFollowModal(true);
  };

  if (loading) return <div className="mt-10"><Spinner size="lg" /></div>;
  if (!profileUser) return <div className="p-10 text-center text-gray-500">User not found.</div>;

  return (
    <div className="w-full pb-10">
      {/* --- Cover & Profile Section --- */}
      <div className="relative mb-4 bg-white shadow-sm rounded-b-xl">
        
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 md:h-64 rounded-b-lg overflow-hidden relative">
          {profileUser.coverPicture && (
            <img 
              src={profileUser.coverPicture} 
              alt="Cover" 
              className="h-full w-full object-cover" 
            />
          )}
        </div>

        {/* Profile Info Wrapper */}
        <div className="px-4 pb-4 md:px-8">
          <div className="relative flex flex-col items-center md:flex-row md:items-end md:justify-between">
            
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-20">
              <Avatar 
                src={profileUser.profilePicture} 
                className="h-32 w-32 border-4 border-white shadow-md md:h-40 md:w-40" 
              />
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3 md:mb-4 md:mt-0">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditModal(true)} // Opens the modal
                  className="rounded-full border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    className={`min-w-[100px] rounded-full px-6 py-2 font-semibold transition ${
                      isFollowing 
                        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:text-red-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <Link 
                    to="/chat"
                    className="rounded-full border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Message
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div className="mt-4 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.username}</h1>
            <p className="text-sm text-gray-500">{profileUser.email}</p>
            {profileUser.desc && (
              <p className="mt-2 max-w-2xl text-gray-700 whitespace-pre-line">
                {profileUser.desc}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start">
              {profileUser.city && <span>📍 {profileUser.city}</span>}
              {profileUser.from && <span>🏠 From {profileUser.from}</span>}
              {profileUser.relationship && <span>❤️ {profileUser.relationship}</span>}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex justify-center gap-8 border-t border-gray-100 pt-4 md:justify-start">
            <button onClick={() => openFollowModal('following')} className="flex flex-col items-center hover:opacity-75">
              <span className="font-bold text-gray-900">{profileUser.following.length}</span>
              <span className="text-sm text-gray-500">Following</span>
            </button>
            <button onClick={() => openFollowModal('followers')} className="flex flex-col items-center hover:opacity-75">
              <span className="font-bold text-gray-900">{profileUser.followers.length}</span>
              <span className="text-sm text-gray-500">Followers</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-900">{posts.length}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- User Posts Section --- */}
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Posts</h2>
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      {showFollowModal && (
        <FollowListModal 
          userId={profileUser._id} 
          type={followModalType} 
          onClose={() => setShowFollowModal(false)} 
        />
      )}

      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default ProfilePage;