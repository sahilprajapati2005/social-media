import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ImageLightbox = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose} // Close when clicking anywhere on background
    >
      <button 
        onClick={onClose} 
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <AiOutlineClose className="text-3xl" />
      </button>

      <img 
        src={src} 
        alt="Full screen" 
        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
};

export default ImageLightbox;