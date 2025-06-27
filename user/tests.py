from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
import tempfile
import os
from PIL import Image
from .models import UserProfile  # Import the UserProfile model

# Create your tests here.

class RegisterViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('user')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }

    def test_register(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())
    
    def test_get_user_unauthenticated(self):
        """Test that unauthenticated users cannot retrieve user data"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_user_authenticated(self):
        """Test that authenticated users can retrieve their own data"""
        user = User.objects.create_user(
            username='authuser', 
            email='auth@example.com', 
            password='authpass123'
        )
        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'authuser')
        self.assertEqual(response.data['email'], 'auth@example.com')
        self.assertNotIn('password', response.data)
    
    def test_register_invalid_data(self):
        """Test registration with invalid data"""
        invalid_data = {
            'username': '',
            'email': 'invalid-email',
            'password': ''
        }
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        User.objects.create_user(
            username='testuser',
            email='existing@example.com',
            password='existpass123'
        )
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TokenObtainPairViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('token_obtain_pair')
        self.user = User.objects.create_user(
            username='existinguser', 
            email='exist@example.com', 
            password='existpass123'
        )

    def test_token_obtain_valid_credentials(self):
        """Test token obtain with valid credentials"""
        response = self.client.post(self.url, {
            'username': 'existinguser',
            'password': 'existpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_token_obtain_invalid_credentials(self):
        """Test token obtain with invalid credentials"""
        response = self.client.post(self.url, {
            'username': 'existinguser',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_token_obtain_missing_credentials(self):
        """Test token obtain with missing credentials"""
        response = self.client.post(self.url, {
            'username': 'existinguser'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshViewTest(APITestCase):
    def setUp(self):
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.user = User.objects.create_user(
            username='refreshuser',
            email='refresh@example.com',
            password='refreshpass123'
        )
    
    def test_token_refresh_valid(self):
        """Test token refresh with valid refresh token"""
        # First, get a token pair
        token_response = self.client.post(self.token_url, {
            'username': 'refreshuser',
            'password': 'refreshpass123'
        }, format='json')
        refresh_token = token_response.data['refresh']
        
        # Now test refresh
        response = self.client.post(self.refresh_url, {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_token_refresh_invalid(self):
        """Test token refresh with invalid refresh token"""
        response = self.client.post(self.refresh_url, {
            'refresh': 'invalid_token'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserProfileViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('user_profile')
        self.user = User.objects.create_user(
            username='profileuser',
            email='profile@example.com',
            password='profilepass123'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            city='Los Angeles',
            country='USA'
        )
        self.profile_data = {
            'city': 'New York',
            'country': 'USA'
        }

    def test_get_profile_unauthenticated(self):
        """Test that unauthenticated users cannot access profile"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile_authenticated(self):
        """Test that authenticated users can get their profile"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print("Response data:", response.data)
        self.assertEqual(response.data['user'], 'profileuser')
        # Verify profile was created in database
        self.assertTrue(UserProfile.objects.filter(user=self.user).exists())

    def test_update_profile_authenticated(self):
        """Test that authenticated users can update their profile"""
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url, self.profile_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['city'], 'New York')
        self.assertEqual(response.data['country'], 'USA')
        
        # Verify profile was updated in database
        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(profile.city, 'New York')
        self.assertEqual(profile.country, 'USA')

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_update_profile_with_picture_authenticated(self):
        """Test that authenticated users can update their profile with picture"""
        self.client.force_authenticate(user=self.user)
        
        # Create a test image
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        image.save(temp_file, format='JPEG')
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as img_file:
                uploaded_file = SimpleUploadedFile(
                    "test_profile.jpg", 
                    img_file.read(), 
                    content_type="image/jpeg"
                )
            
            # Update profile with picture and other data
            data = {
                'city': 'San Francisco',
                'country': 'USA',
                'profile_picture': uploaded_file
            }
            
            response = self.client.patch(self.url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['city'], 'San Francisco')
            self.assertEqual(response.data['country'], 'USA')
            self.assertIsNotNone(response.data['profile_picture'])
            self.assertIn('profile_pics/', response.data['profile_picture'])
            
            # Verify profile was updated in database
            profile = UserProfile.objects.get(user=self.user)
            self.assertEqual(profile.city, 'San Francisco')
            self.assertEqual(profile.country, 'USA')
            self.assertTrue(profile.profile_picture.name.startswith('profile_pics/'))
            
        finally:
            # Clean up
            os.unlink(temp_file.name)

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_update_profile_picture_only(self):
        """Test uploading only profile picture without other data"""
        self.client.force_authenticate(user=self.user)
        
        # Create a test image
        image = Image.new('RGB', (50, 50), color='blue')
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        image.save(temp_file, format='PNG')
        temp_file.close()
        
        try:
            with open(temp_file.name, 'rb') as img_file:
                uploaded_file = SimpleUploadedFile(
                    "test_avatar.png", 
                    img_file.read(), 
                    content_type="image/png"
                )
            
            # Update only profile picture
            data = {'profile_picture': uploaded_file}
            
            response = self.client.patch(self.url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            # Original data should remain unchanged
            self.assertEqual(response.data['city'], 'Los Angeles')
            self.assertEqual(response.data['country'], 'USA')
            # Profile picture should be updated
            self.assertIsNotNone(response.data['profile_picture'])
            self.assertIn('profile_pics/', response.data['profile_picture'])
            
        finally:
            # Clean up
            os.unlink(temp_file.name)

    def test_update_profile_invalid_file_type(self):
        """Test uploading invalid file type as profile picture"""
        self.client.force_authenticate(user=self.user)
        
        # Create a text file instead of image
        uploaded_file = SimpleUploadedFile(
            "test.txt", 
            b"This is not an image", 
            content_type="text/plain"
        )
        
        data = {'profile_picture': uploaded_file}
        response = self.client.patch(self.url, data, format='multipart')
        # Should return bad request due to invalid file type
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_profile_unauthenticated(self):
        """Test that unauthenticated users cannot update profile"""
        response = self.client.put(self.url, self.profile_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
