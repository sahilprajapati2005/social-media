import React, { createContext, useContext, useState, useCallback } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from 'react-icons/ai';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-[300px] items-center justify-between rounded-lg p-4 shadow-lg transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <AiOutlineCheckCircle className="text-xl" />
              ) : (
                <AiOutlineCloseCircle className="text-xl" />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-gray-700">
              <AiOutlineClose />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
