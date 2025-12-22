import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  
  // Style Configurations
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;