import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Capture token from URL
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return addToast("Passwords don't match", 'error');
    }
    if (password.length < 6) {
      return addToast("Password must be at least 6 characters", 'error');
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      addToast('Password reset successful! Please login.', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.response?.data?.message || 'Link expired or invalid', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800">Reset Password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Resetting...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;