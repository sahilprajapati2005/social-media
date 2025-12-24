import React from 'react';

const Avatar = ({ src, alt = "avatar", size = "md", className = "" }) => {
  // Size mapping
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-24 w-24"
  };

  // ✅ FIX: Use a reliable fallback image service (ui-avatars.com) instead of via.placeholder
  const imageSrc = src && src !== "undefined" 
    ? src 
    : "https://ui-avatars.com/api/?name=User&background=random&color=fff";

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`rounded-full object-cover border border-gray-200 ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Avatar;