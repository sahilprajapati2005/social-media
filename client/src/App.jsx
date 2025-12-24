import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Layouts & Guards ---
// Keep it like this
import MainLayout from './layout/MainLayout.jsx';
import ProtectedRoute from './components/guards/ProtectedRoute';

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
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* =========================================
          PUBLIC ROUTES (Accessible without login)
         ========================================= */}
      
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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/auth/success" element={<AuthSuccess />} />

      {/* =========================================
          PROTECTED ROUTES (Require Login)
         ========================================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          <Route path="/" element={<FeedPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          
          {/* Profile Routes */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile/me" element={<ProfilePage />} />
          
          {/* Chat Routes */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

        </Route>
      </Route>

      {/* =========================================
          FALLBACK ROUTE (404)
         ========================================= */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default App;