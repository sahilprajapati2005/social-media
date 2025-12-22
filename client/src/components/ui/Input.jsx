import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`block w-full rounded-lg border px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100 bg-white'
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;