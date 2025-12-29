import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/axios';
import { 
  AiOutlineMail, 
  AiOutlineLoading3Quarters, 
  AiOutlineArrowLeft, 
  AiOutlineLock,
  AiOutlineCheckCircle 
} from 'react-icons/ai';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return showToast("Please enter your email", "error");

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      showToast("OTP sent to your email!", "success");
      setStep(2); // Move to OTP entry screen
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return showToast("Enter a valid 6-digit OTP", "error");
    if (newPassword.length < 6) return showToast("Password must be at least 6 characters", "error");

    setIsLoading(true);
    try {
      // ✅ This hits your backend verify/reset endpoint
      await api.post('/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });

      showToast("Password reset successful!", "success");
      navigate('/login'); // Redirect to login after success
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid OTP or expired";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        
        {step === 1 ? (
          /* STEP 1: EMAIL INPUT */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <AiOutlineMail size={24} />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
              <p className="mt-2 text-sm text-gray-600">Enter your email to receive a 6-digit OTP.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          /* STEP 2: OTP & NEW PASSWORD INPUT */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <AiOutlineLock size={24} />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600">We sent a code to <span className="font-bold">{email}</span></p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  className="block w-full text-center text-2xl tracking-[1em] font-bold rounded-lg border border-gray-300 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700 disabled:bg-green-400"
              >
                {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "Update Password"}
              </button>
            </form>
            
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-center text-sm text-gray-500 hover:text-blue-600 mt-2"
            >
              Back to change email
            </button>
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600">
            <AiOutlineArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;