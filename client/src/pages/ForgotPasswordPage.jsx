import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      addToast('Reset link sent to your email', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error sending email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800">Forgot Password?</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="mt-8 rounded-lg bg-green-50 p-4 text-center text-green-800">
            <p className="font-medium">Check your email!</p>
            <p className="text-sm">We have sent a password reset link to <strong>{email}</strong>.</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;