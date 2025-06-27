import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ProfilePicture, ProfilePictureUpload } from '../ui';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    city: user?.city || '',
    country: user?.country || '',
  });
  const [loading, setLoading] = useState(false);
  const [showPictureUpload, setShowPictureUpload] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePictureUploadSuccess = () => {
    setShowPictureUpload(false);
  };

  React.useEffect(() => {
    if (user) {
      setFormData({
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile" size="md">
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="text-center space-y-4">
          <ProfilePicture 
            src={user?.profile_pic} 
            size="w-24 h-24" 
            className="mx-auto border-4 border-gray-200"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username}
            </h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPictureUpload(!showPictureUpload)}
            className="text-sm"
          >
            {showPictureUpload ? 'Cancel' : 'Change Profile Picture'}
          </Button>
          
          {showPictureUpload && (
            <div className="mt-4">
              <ProfilePictureUpload
                currentImage={user?.profile_pic}
                onUploadSuccess={handlePictureUploadSuccess}
              />
            </div>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
          <Input
            label="Username"
            value={user?.username || ''}
            disabled
            className="bg-gray-50"
          />
          
          <Input
            label="Email"
            value={user?.email || ''}
            disabled
            className="bg-gray-50"
          />
          
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
          
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileModal;
