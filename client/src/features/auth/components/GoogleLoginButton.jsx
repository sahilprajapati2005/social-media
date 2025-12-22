import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirects the browser to the Backend Google Auth Route
    // Ensure your .env file has VITE_API_URL defined, or default to localhost
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // This initiates the OAuth flow handled by Passport.js on the backend
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
    >
      <FcGoogle className="text-xl" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;