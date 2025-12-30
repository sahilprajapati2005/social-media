import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';
import { AiOutlineWarning, AiOutlineLock, AiOutlineDelete } from 'react-icons/ai';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ FIX: Use showToast instead of addToast to match your Context API
  const { showToast } = useToast();

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return showToast("New passwords do not match", "error");
    }

    setLoading(true);
    try {
      // ✅ Matches the backend route /api/users/update-password
      await api.put('/users/update-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      
      showToast("Password updated successfully", "success");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;

    try {
      await api.delete(`/users/${user._id}`);
      dispatch(logout());
      navigate('/login');
      showToast("Account deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete account", "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Account Settings</h1>

      {/* Security Section */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <AiOutlineLock className="text-xl text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-700">Security</h2>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              value={passData.currentPassword}
              onChange={handlePassChange}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={passData.newPassword}
                onChange={handlePassChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={passData.confirmPassword}
                onChange={handlePassChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-100 bg-red-50 p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-red-200 pb-2">
          <AiOutlineWarning className="text-xl text-red-600" />
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
        >
          <AiOutlineDelete />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;