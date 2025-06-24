
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Resume


class ResumeViewSetTest(APITestCase):
    """Test for ResumeViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.list_url = reverse('resume-list')
        self.detail_url = reverse('resume-detail', kwargs={'pk': self.resume.pk})
    
    def authenticate(self, user=None):
        """Helper method to authenticate user"""
        if user is None:
            user = self.user
        token = RefreshToken.for_user(user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access resumes"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_resume(self):
        """Test creating a resume"""
        self.authenticate()
        data = {'title': 'New Resume'}
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resume.objects.count(), 3)
        self.assertEqual(response.data['title'], 'New Resume')
    
    def test_list_user_resumes(self):
        """Test listing user's resumes only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Resume')
    
    def test_retrieve_resume(self):
        """Test retrieving a specific resume"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Resume')
    
    def test_update_resume(self):
        """Test updating a resume"""
        self.authenticate()
        data = {'title': 'Updated Resume'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.resume.refresh_from_db()
        self.assertEqual(self.resume.title, 'Updated Resume')
    
    def test_delete_resume(self):
        """Test deleting a resume"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Resume.objects.filter(pk=self.resume.pk).exists())
