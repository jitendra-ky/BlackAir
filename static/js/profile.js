import { appState } from './state.js';

$(function() {
    // Profile modal elements
    const $profileModal = $('#profile-modal');
    const $profileForm = $('#profile-form');
    const $viewProfileBtn = $('#view-profile');
    const $closeModalBtn = $('#close-profile-modal');
    const $cancelBtn = $('#cancel-profile');
    const $errorDiv = $('#profile-error');
    const $successDiv = $('#profile-success');

    // Open profile modal
    $viewProfileBtn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openProfileModal();
    });

    // Close modal handlers
    $closeModalBtn.on('click', closeProfileModal);
    $cancelBtn.on('click', closeProfileModal);
    
    // Close modal when clicking outside
    $profileModal.on('click', function(e) {
        if (e.target === this) {
            closeProfileModal();
        }
    });

    // Handle profile form submission
    $profileForm.on('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });

    // Open profile modal and load data
    async function openProfileModal() {
        try {
            // Hide dropdown
            $('#profile-dropdown').hide();
            
            // Show modal
            $profileModal.show();
            
            // Clear previous messages
            $errorDiv.hide();
            $successDiv.hide();
            
            // Load user data and profile data
            await Promise.all([loadUserInfo(), loadProfileInfo()]);
            
        } catch (error) {
            showError('Failed to load profile data: ' + error.message);
        }
    }

    // Close profile modal
    function closeProfileModal() {
        $profileModal.hide();
        $errorDiv.hide();
        $successDiv.hide();
    }    // Load user information (username, email)
    async function loadUserInfo() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/auth/user/',
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                success: function(userData) {
                    $('#profile-username').val(userData.username);
                    $('#profile-email').val(userData.email);
                    resolve(userData);
                },
                error: function(xhr, status, error) {
                    console.error('Error loading user info:', error);
                    reject(new Error('Failed to load user information'));
                }
            });
        });
    }    // Load profile information (city, country)
    async function loadProfileInfo() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/profile/',
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                success: function(profileData) {
                    $('#profile-city').val(profileData.city || '');
                    $('#profile-country').val(profileData.country || '');
                    resolve(profileData);
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 404) {
                        // Profile doesn't exist yet, that's okay
                        $('#profile-city').val('');
                        $('#profile-country').val('');
                        resolve({});
                    } else {
                        console.error('Error loading profile info:', error);
                        // Don't reject here, profile might not exist yet
                        resolve({});
                    }
                }
            });
        });
    }    // Update profile
    async function updateProfile() {
        const profileData = {
            city: $('#profile-city').val().trim(),
            country: $('#profile-country').val().trim()
        };

        $.ajax({
            url: '/api/profile/',
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            success: function(response) {
                showSuccess('Profile updated successfully!');
                setTimeout(() => {
                    closeProfileModal();
                }, 1500);
            },
            error: function(xhr, status, error) {
                console.error('Error updating profile:', error);
                let errorMessage = 'Failed to update profile';
                
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    errorMessage += ': ' + xhr.responseJSON.detail;
                } else if (xhr.responseText) {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        if (errorData.detail) {
                            errorMessage += ': ' + errorData.detail;
                        }
                    } catch (e) {
                        errorMessage += ': ' + error;
                    }
                } else {
                    errorMessage += ': ' + error;
                }
                
                showError(errorMessage);
            }
        });
    }

    // Show error message
    function showError(message) {
        $errorDiv.text(message).show();
        $successDiv.hide();
    }

    // Show success message
    function showSuccess(message) {
        $successDiv.text(message).show();
        $errorDiv.hide();
    }    // Handle token refresh if needed
    async function refreshToken() {
        return new Promise((resolve, reject) => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                reject(new Error('No refresh token available'));
                return;
            }

            $.ajax({
                url: '/api/auth/token/refresh/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ refresh: refreshToken }),
                success: function(data) {
                    localStorage.setItem('accessToken', data.access);
                    appState.accessToken = data.access;
                    resolve(data.access);
                },
                error: function(xhr, status, error) {
                    console.error('Token refresh failed:', error);
                    // Redirect to login
                    localStorage.clear();
                    window.location.href = '/login/';
                    reject(new Error('Failed to refresh token'));
                }
            });
        });
    }
});
