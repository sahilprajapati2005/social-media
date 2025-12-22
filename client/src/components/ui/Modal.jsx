import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import useClickOutside from '../../hooks/useClickOutside';

const Modal = ({ isOpen, onClose, title, children, className = "max-w-md" }) => {
  if (!isOpen) return null;

  // Use the hook to close when clicking outside
  const modalRef = useClickOutside(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        ref={modalRef}
        className={`w-full bg-white rounded-xl shadow-2xl overflow-hidden ${className}`}
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;