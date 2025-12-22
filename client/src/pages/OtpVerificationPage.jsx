import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useToast } from '../context/ToastContext';
import api from '../utils/axios';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit array
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const email = location.state?.email;

  // Redirect if accessed without an email in state
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Update state
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle Backspace to focus previous
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      return addToast('Please enter the full 6-digit code', 'error');
    }

    setLoading(true);
    try {
      // Backend expects { email, otp }
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpCode });
      
      // On success, backend usually returns the user & token
      dispatch(setCredentials({ user: data.user, token: data.token }));
      
      addToast('Account verified successfully!', 'success');
      navigate('/'); // Go to Home Feed
    } catch (error) {
      addToast(error.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      addToast('OTP resent to your email.', 'success');
      setOtp(['', '', '', '', '', '']); // Reset fields
    } catch (error) {
      addToast('Failed to resend OTP', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="mb-6 text-sm text-gray-600">
          We sent a 6-digit code to <strong>{email}</strong>.<br />
          Enter it below to confirm your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend}
            className="font-medium text-blue-600 hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerificationPage;