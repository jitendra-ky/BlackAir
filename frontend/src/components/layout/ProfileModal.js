import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    city: user?.city || '',
    country: user?.country || '',
  });
  const [loading, setLoading] = useState(false);

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
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </Modal>
  );
};

export default ProfileModal;
