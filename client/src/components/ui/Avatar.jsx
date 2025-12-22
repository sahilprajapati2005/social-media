import React from 'react';

const Avatar = ({ src, alt = "user", size = "md", className = "" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-20 w-20",
    xl: "h-32 w-32"
  };

  return (
    <img
      src={src || "https://via.placeholder.com/150"}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border border-gray-100 ${className}`}
    />
  );
};

export default Avatar;