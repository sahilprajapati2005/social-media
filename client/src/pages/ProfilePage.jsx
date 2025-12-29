import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Added useDispatch
import { useToast } from '../context/ToastContext';
import api from '../utils/axios';
import { updateFollowing } from '../features/auth/authSlice'; // Action to sync Redux

// Components
import PostCard from '../features/feed/components/PostCard';
import FollowListModal from '../features/profile/components/FollowListModal';
import EditProfileModal from '../features/profile/components/EditProfileModal';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar'; 

const ProfilePage = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  
  // Local State
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Modal States
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  const [showEditModal, setShowEditModal] = useState(false);

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === 'me' || userId === currentUser?._id;
  const idToFetch = isOwnProfile ? currentUser?._id : userId;

  // ✅ Initialize follow status from Redux state whenever current user or profile changes
  useEffect(() => {
    if (currentUser && profileUser) {
      const alreadyFollowing = currentUser.following?.includes(profileUser._id);
      setIsFollowing(!!alreadyFollowing);
    }
  }, [currentUser, profileUser]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!idToFetch || idToFetch === 'undefined' || idToFetch === 'null') return;

      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${idToFetch}`),
          api.get(`/posts/profile/${idToFetch}`)
        ]);

        setProfileUser(userRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        if (error.response?.status !== 404) showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [idToFetch, showToast, showEditModal]);

  const handleFollowToggle = async () => {
    if (isOwnProfile || !profileUser) return;

    try {
      // Backend handles both follow/unfollow on this endpoint
      const response = await api.put(`/users/${profileUser._id}/follow`);
      const { isFollowing: serverStatus } = response.data;

      // 1. Update Global Redux state so it persists when searching/navigating
      dispatch(updateFollowing({ 
        targetId: profileUser._id, 
        isFollowing: serverStatus 
      }));

      // 2. Update local profile UI count
      setProfileUser((prev) => ({
        ...prev,
        followers: serverStatus 
          ? [...prev.followers, currentUser._id]
          : prev.followers.filter(id => id !== currentUser._id)
      }));

      showToast(serverStatus ? "Followed user" : "Unfollowed user", "success");
    } catch (error) {
      showToast("Action failed", "error");
    }
  };

  const handleStartChat = async () => {
    try {
      await api.post('/conversations', {
        senderId: currentUser._id,
        receiverId: profileUser._id
      });
      navigate('/chat');
    } catch (err) {
      showToast("Could not start conversation", "error");
    }
  };

  const openFollowModal = (type) => {
    setFollowModalType(type);
    setShowFollowModal(true);
  };

  if (loading) return <div className="mt-10 flex justify-center"><Spinner size="lg" /></div>;
  if (!profileUser) return <div className="p-10 text-center text-gray-500">User not found.</div>;

  return (
    <div className="w-full pb-10">
      <div className="relative mb-4 bg-white shadow-sm rounded-b-xl">
        <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 md:h-64 rounded-b-lg overflow-hidden relative">
          {profileUser.coverPicture ? (
            <img src={profileUser.coverPicture} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500"></div>
          )}
        </div>

        <div className="px-4 pb-4 md:px-8">
          <div className="relative flex flex-col items-center md:flex-row md:items-end md:justify-between">
            <div className="relative -mt-16 md:-mt-20">
              <Avatar src={profileUser.profilePicture} className="h-32 w-32 border-4 border-white shadow-md md:h-40 md:w-40" />
            </div>

            <div className="mt-4 flex gap-3 md:mb-4 md:mt-0">
              {isOwnProfile ? (
                <button onClick={() => setShowEditModal(true)} className="rounded-full border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition">
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
                  <button onClick={handleStartChat} className="rounded-full border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.username}</h1>
            <p className="text-sm text-gray-500">{profileUser.email}</p>
            {profileUser.bio && <p className="mt-2 max-w-2xl text-gray-700 whitespace-pre-line">{profileUser.bio}</p>}
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start">
              {profileUser.city && <span>📍 {profileUser.city}</span>}
              {profileUser.from && <span>🏠 From {profileUser.from}</span>}
              {profileUser.relationship && <span>❤️ {profileUser.relationship}</span>}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-8 border-t border-gray-100 pt-4 md:justify-start">
            <button onClick={() => openFollowModal('following')} className="flex flex-col items-center hover:opacity-75 transition">
              <span className="font-bold text-gray-900">{profileUser.following?.length || 0}</span>
              <span className="text-sm text-gray-500">Following</span>
            </button>
            <button onClick={() => openFollowModal('followers')} className="flex flex-col items-center hover:opacity-75 transition">
              <span className="font-bold text-gray-900">{profileUser.followers?.length || 0}</span>
              <span className="text-sm text-gray-500">Followers</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-900">{posts.length}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Posts</h2>
        <div className="flex flex-col gap-4">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {showFollowModal && <FollowListModal userId={profileUser._id} type={followModalType} onClose={() => setShowFollowModal(false)} />}
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default ProfilePage;