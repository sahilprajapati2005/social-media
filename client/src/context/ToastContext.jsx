import React, { createContext, useContext, useState, useCallback } from "react";

// 1. Create the Context
const ToastContext = createContext();

// 2. Create a Custom Hook for easy usage
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// 3. The Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now(); // Unique ID based on timestamp
    
    // Add toast to state
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  // Function to remove a specific toast
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container - Rendered globally */}
      <div style={styles.toastContainer}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            style={{...styles.toast, ...styles[toast.type]}}
            className="toast-animation"
          >
            <span style={styles.icon}>{getIcon(toast.type)}</span>
            <span style={styles.message}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={styles.closeBtn}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Helper: Icons based on type ---
const getIcon = (type) => {
  switch (type) {
    case "success": return "✅";
    case "error": return "❌";
    case "warning": return "⚠️";
    default: return "ℹ️";
  }
};

// --- Helper: Basic Inline Styles (You can replace this with CSS/Tailwind) ---
const styles = {
  toastContainer: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  toast: {
    minWidth: "250px",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
    fontSize: "14px",
    animation: "slideIn 0.3s ease-in-out",
    transition: "all 0.3s ease",
  },
  // Color variants
  success: { backgroundColor: "#2ecc71" }, // Green
  error:   { backgroundColor: "#e74c3c" }, // Red
  info:    { backgroundColor: "#3498db" }, // Blue
  warning: { backgroundColor: "#f1c40f", color: "#333" }, // Yellow
  
  icon: { marginRight: "10px" },
  message: { flex: 1, marginRight: "10px" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
};