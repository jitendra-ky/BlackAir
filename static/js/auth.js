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
        contentType: 'application/json',
        success: function(response) {
          appState.accessToken = response.access;
          appState.refreshToken = response.refresh;
          appState.isAuthenticated = true;
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
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
});
