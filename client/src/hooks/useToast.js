import React, { createContext, useContext, useState, useCallback } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning, AiOutlineClose } from 'react-icons/ai';

const ToastContext = createContext();

// 1. Custom Hook to consume the context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 2. Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Helper to determine styles based on type
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-500 text-gray-800';
      case 'error':
        return 'bg-white border-l-4 border-red-500 text-gray-800';
      case 'info':
        return 'bg-white border-l-4 border-blue-500 text-gray-800';
      case 'warning':
        return 'bg-white border-l-4 border-yellow-500 text-gray-800';
      default:
        return 'bg-white border-l-4 border-gray-500 text-gray-800';
    }
  };

  // Helper to determine Icon based on type
  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <AiOutlineCheckCircle className="text-2xl text-green-500" />;
      case 'error':
        return <AiOutlineCloseCircle className="text-2xl text-red-500" />;
      case 'info':
        return <AiOutlineInfoCircle className="text-2xl text-blue-500" />;
      case 'warning':
        return <AiOutlineWarning className="text-2xl text-yellow-500" />;
      default:
        return <AiOutlineInfoCircle className="text-2xl text-gray-500" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container (Fixed to bottom-right) */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-[300px] max-w-sm items-center gap-3 rounded-lg p-4 shadow-lg transition-all duration-300 animate-fade-in ${getToastStyles(toast.type)}`}
            role="alert"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {getToastIcon(toast.type)}
            </div>

            {/* Message */}
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <AiOutlineClose className="text-lg" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;