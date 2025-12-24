import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Optional: Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;