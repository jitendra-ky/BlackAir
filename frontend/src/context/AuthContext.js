import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('accessToken', action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem('refreshToken', action.payload.refresh);
      }
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.access,
        isLoading: false,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    try {
      // Get user data from /auth/user/
      const user = await authAPI.getProfile();
      
      // Try to get profile data from /profile/ (contains profile_picture, city, country)
      let profileData = {};
      try {
        profileData = await authAPI.getProfileData();
      } catch (profileError) {
        console.log('Profile data not available, using defaults');
        // If profile doesn't exist, it's okay - we'll use default values
      }
      
      // Combine user and profile data
      const combinedUser = {
        ...user,
        profile_pic: profileData.profile_picture || null,
        city: profileData.city || null,
        country: profileData.country || null
      };
      
      dispatch({ type: 'SET_USER', payload: combinedUser });
    } catch (error) {
      console.error('Failed to load user:', error);
      // If loading user fails, logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      loadUser();
    }
  }, [state.isAuthenticated, loadUser]);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      toast.success('Login successful!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const response = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      toast.success('Registration successful! Please log in.');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      await authAPI.updateProfile(profileData);
      // Reload user data to get the updated profile
      await loadUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      await authAPI.updateProfilePicture(file);
      // Reload user data to get the updated profile picture
      await loadUser();
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile picture';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updateProfilePicture,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
