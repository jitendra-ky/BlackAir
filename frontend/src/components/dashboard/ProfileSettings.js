import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ProfilePicture, ProfilePictureUpload } from "../ui";
import { UserIcon, CameraIcon } from "@heroicons/react/24/outline";

const ProfileSettings = ({ className = "" }) => {
  const { user, updateProfilePicture } = useAuth();
  const [showUpload, setShowUpload] = useState(false);

  const handleProfilePictureSuccess = () => {
    setShowUpload(false);
    // The AuthContext automatically reloads user data after successful upload
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Profile Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <ProfilePicture
              src={user.profile_pic}
              size="w-16 h-16"
              className="border-2 border-gray-200"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              <CameraIcon className="h-4 w-4" />
              {showUpload ? "Cancel" : "Change Photo"}
            </button>
          </div>

          {/* Upload Section */}
          {showUpload && (
            <div className="pl-20">
              <ProfilePictureUpload
                currentImage={user.profile_pic}
                onUploadSuccess={handleProfilePictureSuccess}
                className="border-t border-gray-100 pt-4"
              />
            </div>
          )}
        </div>

        {/* Basic Info Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {user.username}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {user.email}
            </p>
          </div>
          {user.first_name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {user.first_name}
              </p>
            </div>
          )}
          {user.last_name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {user.last_name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
