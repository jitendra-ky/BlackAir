import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { ProfilePicture } from '../ui';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Resume Builder
          </Link>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    <ProfilePicture 
                      src={user?.profile_pic} 
                      size="w-6 h-6"
                      className="ring-2 ring-white"
                    />
                    <span>{user?.username || 'User'}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              >
                <DropdownItem onClick={handleViewProfile}>
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4" />
                    View Profile
                  </div>
                </DropdownItem>
                <DropdownItem onClick={handleLogout} danger>
                  <div className="flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </div>
                </DropdownItem>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-1 rounded transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default Navbar;
