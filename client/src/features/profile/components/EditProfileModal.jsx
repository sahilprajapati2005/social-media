import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../auth/authSlice';
import { useToast } from '../../../context/ToastContext';
import api from '../../../utils/axios';
import { AiOutlineClose, AiFillCamera } from 'react-icons/ai';

const EditProfileModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    // CHANGED: Use 'bio' instead of 'desc' to match the database
    bio: user?.bio || '', 
    city: user?.city || '',
    from: user?.from || '',
    relationship: user?.relationship || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') setProfileImage(file);
      if (type === 'cover') setCoverImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('userId', user._id);
    data.append('username', formData.username);
    
    // CHANGED: Send 'bio' to the backend
    data.append('bio', formData.bio);
    
    data.append('city', formData.city);
    data.append('from', formData.from);
    data.append('relationship', formData.relationship);

    if (profileImage) data.append('profilePicture', profileImage);
    if (coverImage) data.append('coverPicture', coverImage);

    try {
      const res = await api.put(`/users/profile`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update Redux Store with new user data
      const token = localStorage.getItem('token'); 
      dispatch(setCredentials({ user: res.data, token }));

      addToast('Profile updated successfully!', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 transition">
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Uploads */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <img 
                    src={profileImage ? URL.createObjectURL(profileImage) : (user.profilePicture || "https://via.placeholder.com/150")} 
                    alt="profile prev" 
                    className="h-16 w-16 rounded-full object-cover border border-gray-200"
                  />
                  <label className="cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    Change
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Cover Image</label>
                <div className="relative h-24 w-full rounded-lg bg-gray-100 overflow-hidden border border-gray-200 group">
                  <img 
                    src={coverImage ? URL.createObjectURL(coverImage) : (user.coverPicture || "https://via.placeholder.com/800x200")} 
                    alt="cover prev" 
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200">
                    <AiFillCamera className="text-3xl text-white drop-shadow-md" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                  </label>
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio" // Changed from bio to desc in older versions, now confirmed 'bio'
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Describe yourself..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Relationship Status</label>
               <select 
                 name="relationship" 
                 value={formData.relationship}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
               >
                 <option value="">Select...</option>
                 <option value="Single">Single</option>
                 <option value="In a Relationship">In a Relationship</option>
                 <option value="Married">Married</option>
               </select>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button 
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition"
            type="button"
          >
            Cancel
          </button>
          <button 
            form="edit-profile-form"
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;