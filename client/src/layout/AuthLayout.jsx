import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth'; // <--- IMPORT IT HERE

const AuthLayout = () => {
  
  // CALL THE FUNCTION
  const isAuthenticated = checkAuth(); 

  // If user is already logged in, redirect to Dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Your UI code ... */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;