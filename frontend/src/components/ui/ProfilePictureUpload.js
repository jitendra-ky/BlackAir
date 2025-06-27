import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ProfilePicture from './ProfilePicture';

const ProfilePictureUpload = ({ currentImage, onUploadSuccess, className = "" }) => {
  const { updateProfilePicture } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = ''; // Reset input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle upload
  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      await updateProfilePicture(file);
      setPreview(null);
      fileInputRef.current.value = ''; // Reset input
      
      // Call callback to indicate success
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Error is already handled in AuthContext with toast
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel preview
  const handleCancel = () => {
    setPreview(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current/Preview Image */}
      <div className="flex items-center space-x-4">
        <ProfilePicture 
          src={preview || currentImage} 
          size="w-20 h-20" 
          className="border-2 border-gray-200"
        />
        <div>
          <p className="text-sm text-gray-600">
            {preview ? 'Preview' : 'Current profile picture'}
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>

      {/* File Input */}
      <div className="space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {/* Action Buttons */}
        {preview && (
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span>Uploading your profile picture...</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
