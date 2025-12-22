import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setCredentials } from '../authSlice';
import Spinner from '../../../components/ui/Spinner';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract data passed from Backend via URL query params
    const token = searchParams.get('token');
    const userString = searchParams.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        // 2. Save to Redux & LocalStorage
        dispatch(setCredentials({ token, user }));
        
        // 3. Redirect to Home
        navigate('/');
      } catch (err) {
        console.error("Failed to parse user data", err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 gap-4">
      <Spinner size="lg" />
      <p className="text-gray-600 font-medium">Finalizing secure login...</p>
    </div>
  );
};

export default AuthSuccess;