// src/utils/auth.js

export const checkAuth = () => {
  // 1. Get the token from local storage
  const token = localStorage.getItem('token');
  
  // 2. Return true if token exists, false if it doesn't
  // The '!!' converts a string (or null) into a boolean (true/false)
  return !!token; 
};