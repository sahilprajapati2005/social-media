import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Layouts & Guards ---
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from "./components/guards/ProtectedRoute";

// --- Auth Pages ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthSuccess from './features/auth/components/AuthSuccess';

// --- Feature Pages ---
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import PostPage from './pages/PostPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  // Get auth state from Redux to handle redirects
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* =========================================
          PUBLIC ROUTES (Accessible without login)
         ========================================= */}
      
      {/* If user is already logged in, redirect Login/Register to Home */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/auth/verify-otp" 
        element={!isAuthenticated ? <OtpVerificationPage /> : <Navigate to="/" replace />} 
      />
      
      {/* Password Recovery Flow */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      {/* Google OAuth Callback (Handled by AuthSuccess component) */}
      <Route path="/auth/success" element={<AuthSuccess />} />


      {/* =========================================
          PROTECTED ROUTES (Require Login)
         ========================================= */}
      {/* ProtectedRoute checks if user is logged in. 
          If yes, renders child routes. If no, redirects to /login.
      */}
      <Route element={<ProtectedRoute />}>
        {/* MainLayout provides the Sidebar, Navbar, and RightSidebar */}
        <Route element={<MainLayout />}>
          
          {/* Feed (Home) */}
          <Route path="/" element={<FeedPage />} />
          
          {/* Single Post View (Deep Link) */}
          <Route path="/post/:postId" element={<PostPage />} />
          
          {/* Profile: :userId can be a specific ID or 'me' */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
          {/* Chat / Messaging */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          
          {/* Discovery & Search */}
          <Route path="/search" element={<SearchPage />} />
          
          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />
          
          {/* Account Settings */}
          <Route path="/settings" element={<SettingsPage />} />

        </Route>
      </Route>


      {/* =========================================
          FALLBACK ROUTE (404)
         ========================================= */}
      {/* Catches any URL that doesn't match above */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default App;