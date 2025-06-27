import React, { useState } from 'react';

const ProfilePicture = ({ 
  src, 
  alt = "Profile Picture", 
  size = "w-12 h-12", 
  className = "" 
}) => {
  const [imageError, setImageError] = useState(false);

  const defaultAvatar = (
    <div className={`${size} rounded-full bg-gray-300 flex items-center justify-center ${className}`}>
      <svg 
        className="w-6 h-6 text-gray-600" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  if (!src || imageError) {
    return defaultAvatar;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${size} rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default ProfilePicture;
