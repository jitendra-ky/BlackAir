import { appState } from './state.js';

// Ensure jQuery is loaded
$(function() {
  // Signup
  const $signupForm = $('#signup-form');
  if ($signupForm.length) {
    $signupForm.on('submit', function(e) {
      e.preventDefault();
      const data = {
        username: $signupForm.find('[name="username"]').val(),
        email: $signupForm.find('[name="email"]').val(),
        password: $signupForm.find('[name="password"]').val(),
      };
      
      $.ajax({
        url: '/api/auth/user/',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          window.location.href = '/login/';
        },
        error: function(xhr) {
          let errorMsg = 'Signup failed';
          try {
            const errorResponse = xhr.responseJSON;
            errorMsg = errorResponse && (errorResponse.detail || JSON.stringify(errorResponse));
          } catch (e) {}
          $('#signup-error').text(errorMsg);
        }
      });
    });
  }
  // Login
  const $loginForm = $('#login-form');
  if ($loginForm.length) {
    $loginForm.on('submit', function(e) {
      e.preventDefault();
      const data = {
        username: $loginForm.find('[name="username"]').val(),
        password: $loginForm.find('[name="password"]').val(),
      };
      
      $.ajax({
        url: '/api/auth/token/',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',        success: function(response) {
          appState.accessToken = response.access;
          appState.refreshToken = response.refresh;
          appState.isAuthenticated = true;
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
          
          // Load and display username
          loadUserProfile();
          
          // Update navigation UI
          document.getElementById('nav-login').style.display = 'none';
          document.getElementById('nav-signup').style.display = 'none';
          document.getElementById('user-profile-nav').style.display = 'block';
          
          window.location.href = '/';
        },
        error: function(xhr) {
          let errorMsg = 'Login failed';
          try {
            const errorResponse = xhr.responseJSON;
            errorMsg = errorResponse && (errorResponse.detail || JSON.stringify(errorResponse));
          } catch (e) {}
          $('#login-error').text(errorMsg);
        }
      });
    });
  }

  // Load user profile information for navigation display
  function loadUserProfile() {
    $.ajax({
      url: '/api/auth/user/',
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      success: function(userData) {
        // Update username in navigation
        $('#username-display').text(userData.username);
      },
      error: function(xhr, status, error) {
        console.error('Error loading user profile:', error);
        // If we can't load user info, maybe token is invalid
        if (xhr.status === 401) {
          localStorage.clear();
          appState.isAuthenticated = false;
          window.location.href = '/login/';
        }
      }
    });
  }
});
