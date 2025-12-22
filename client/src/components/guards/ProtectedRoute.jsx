import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If not authenticated, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;