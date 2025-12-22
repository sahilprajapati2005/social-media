import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// API & Utils
import api from '../utils/axios';
import { isValidEmail, isStrongPassword } from '../utils/validations';
import { useToast } from '../context/ToastContext';

// Components
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  // State for specific field errors (optional, but good for UX)
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- 1. Client-Side Validation ---
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!isStrongPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 chars with letters & numbers';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // --- 2. API Call ---
    setIsLoading(true);
    try {
      // Backend expects: { username, email, password }
      await api.post('/auth/register', formData);
      
      // Success Feedback
      addToast('Registration successful! Please check your email for OTP.', 'success');
      
      // Navigate to OTP page, passing email in state for convenience
      navigate('/auth/verify-otp', { state: { email: formData.email } });
      
    } catch (err) {
      const serverError = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast(serverError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community today
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Auth */}
        <GoogleLoginButton />

        {/* Footer Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;