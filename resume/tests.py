from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date
from .models import Resume, Education, Experience, Project, Skill, Certification, Achievement


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


class EducationViewSetTest(APITestCase):
    """Test for EducationViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.education = Education.objects.create(
            resume=self.resume,
            school='Test University',
            degree='Bachelor of Science',
            field_of_study='Computer Science',
            start_date=date(2020, 9, 1),
            end_date=date(2024, 6, 1)
        )
        self.list_url = reverse('education-list')
        self.detail_url = reverse('education-detail', kwargs={'pk': self.education.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access education"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_education(self):
        """Test creating education entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'school': 'New University',
            'degree': 'Master of Science',
            'field_of_study': 'Data Science',
            'start_date': '2024-09-01',
            'end_date': '2026-06-01'
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Education.objects.count(), 2)
        self.assertEqual(response.data['school'], 'New University')
    
    def test_list_user_education(self):
        """Test listing user's education only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['school'], 'Test University')
    
    def test_retrieve_education(self):
        """Test retrieving specific education"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['school'], 'Test University')
    
    def test_update_education(self):
        """Test updating education"""
        self.authenticate()
        data = {'school': 'Updated University'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.education.refresh_from_db()
        self.assertEqual(self.education.school, 'Updated University')
    
    def test_delete_education(self):
        """Test deleting education"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Education.objects.filter(pk=self.education.pk).exists())


class ExperienceViewSetTest(APITestCase):
    """Test for ExperienceViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.experience = Experience.objects.create(
            resume=self.resume,
            company='Test Company',
            position='Software Developer',
            location='Remote',
            start_date=date(2023, 1, 1),
            end_date=date(2024, 1, 1),
            description='Developed software solutions'
        )
        self.list_url = reverse('experience-list')
        self.detail_url = reverse('experience-detail', kwargs={'pk': self.experience.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access experience"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_experience(self):
        """Test creating experience entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'company': 'New Company',
            'position': 'Senior Developer',
            'location': 'New York',
            'start_date': '2024-02-01',
            'is_current': True,
            'description': 'Leading development team'
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Experience.objects.count(), 2)
        self.assertEqual(response.data['company'], 'New Company')
    
    def test_list_user_experience(self):
        """Test listing user's experience only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Test Company')
    
    def test_retrieve_experience(self):
        """Test retrieving specific experience"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'], 'Test Company')
    
    def test_update_experience(self):
        """Test updating experience"""
        self.authenticate()
        data = {'company': 'Updated Company'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.experience.refresh_from_db()
        self.assertEqual(self.experience.company, 'Updated Company')
    
    def test_delete_experience(self):
        """Test deleting experience"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Experience.objects.filter(pk=self.experience.pk).exists())


class ProjectViewSetTest(APITestCase):
    """Test for ProjectViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.project = Project.objects.create(
            resume=self.resume,
            name='Test Project',
            description='A test project',
            technologies='Python, Django, React',
            start_date=date(2023, 1, 1),
            end_date=date(2023, 6, 1),
            github_url='https://github.com/test/project'
        )
        self.list_url = reverse('project-list')
        self.detail_url = reverse('project-detail', kwargs={'pk': self.project.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access projects"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_project(self):
        """Test creating project entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'name': 'New Project',
            'description': 'A new project description',
            'technologies': 'JavaScript, Node.js',
            'start_date': '2024-01-01',
            'end_date': '2024-03-01',
            'project_url': 'https://example.com'
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(response.data['name'], 'New Project')
    
    def test_list_user_projects(self):
        """Test listing user's projects only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Project')
    
    def test_retrieve_project(self):
        """Test retrieving specific project"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Project')
    
    def test_update_project(self):
        """Test updating project"""
        self.authenticate()
        data = {'name': 'Updated Project'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Project')
    
    def test_delete_project(self):
        """Test deleting project"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(pk=self.project.pk).exists())


class SkillViewSetTest(APITestCase):
    """Test for SkillViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.skill = Skill.objects.create(
            resume=self.resume,
            name='Python',
            category='Programming Languages',
            level='advanced',
            years_of_experience=5
        )
        self.list_url = reverse('skill-list')
        self.detail_url = reverse('skill-detail', kwargs={'pk': self.skill.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access skills"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_skill(self):
        """Test creating skill entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'name': 'JavaScript',
            'category': 'Programming Languages',
            'level': 'intermediate',
            'years_of_experience': 3
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Skill.objects.count(), 2)
        self.assertEqual(response.data['name'], 'JavaScript')
    
    def test_list_user_skills(self):
        """Test listing user's skills only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Python')
    
    def test_retrieve_skill(self):
        """Test retrieving specific skill"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Python')
    
    def test_update_skill(self):
        """Test updating skill"""
        self.authenticate()
        data = {'level': 'expert'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.skill.refresh_from_db()
        self.assertEqual(self.skill.level, 'expert')
    
    def test_delete_skill(self):
        """Test deleting skill"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Skill.objects.filter(pk=self.skill.pk).exists())


class CertificationViewSetTest(APITestCase):
    """Test for CertificationViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.certification = Certification.objects.create(
            resume=self.resume,
            name='AWS Certified Developer',
            issuing_organization='Amazon Web Services',
            issue_date=date(2023, 1, 1),
            expiration_date=date(2026, 1, 1),
            credential_id='AWS123456'
        )
        self.list_url = reverse('certification-list')
        self.detail_url = reverse('certification-detail', kwargs={'pk': self.certification.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access certifications"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_certification(self):
        """Test creating certification entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'name': 'Google Cloud Professional',
            'issuing_organization': 'Google',
            'issue_date': '2024-01-01',
            'expiration_date': '2027-01-01',
            'credential_id': 'GCP789'
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Certification.objects.count(), 2)
        self.assertEqual(response.data['name'], 'Google Cloud Professional')
    
    def test_list_user_certifications(self):
        """Test listing user's certifications only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'AWS Certified Developer')
    
    def test_retrieve_certification(self):
        """Test retrieving specific certification"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'AWS Certified Developer')
    
    def test_update_certification(self):
        """Test updating certification"""
        self.authenticate()
        data = {'name': 'AWS Certified Solutions Architect'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.certification.refresh_from_db()
        self.assertEqual(self.certification.name, 'AWS Certified Solutions Architect')
    
    def test_delete_certification(self):
        """Test deleting certification"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Certification.objects.filter(pk=self.certification.pk).exists())


class AchievementViewSetTest(APITestCase):
    """Test for AchievementViewSet"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        self.resume = Resume.objects.create(title='Test Resume', user=self.user)
        self.other_resume = Resume.objects.create(title='Other Resume', user=self.other_user)
        self.achievement = Achievement.objects.create(
            resume=self.resume,
            title='Best Developer Award',
            description='Awarded for outstanding performance',
            date_achieved=date(2023, 12, 1),
            organization='Test Company'
        )
        self.list_url = reverse('achievement-list')
        self.detail_url = reverse('achievement-detail', kwargs={'pk': self.achievement.pk})
    
    def authenticate(self):
        """Helper method to authenticate user"""
        token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access achievements"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_achievement(self):
        """Test creating achievement entry"""
        self.authenticate()
        data = {
            'resume': self.resume.pk,
            'title': 'Innovation Award',
            'description': 'Recognized for innovative solution',
            'date_achieved': '2024-01-15',
            'organization': 'Tech Conference'
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Achievement.objects.count(), 2)
        self.assertEqual(response.data['title'], 'Innovation Award')
    
    def test_list_user_achievements(self):
        """Test listing user's achievements only"""
        self.authenticate()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Best Developer Award')
    
    def test_retrieve_achievement(self):
        """Test retrieving specific achievement"""
        self.authenticate()
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Best Developer Award')
    
    def test_update_achievement(self):
        """Test updating achievement"""
        self.authenticate()
        data = {'title': 'Outstanding Developer Award'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.achievement.refresh_from_db()
        self.assertEqual(self.achievement.title, 'Outstanding Developer Award')
    
    def test_delete_achievement(self):
        """Test deleting achievement"""
        self.authenticate()
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Achievement.objects.filter(pk=self.achievement.pk).exists())


class ResumePDFDownloadViewTest(APITestCase):
    """Minimal test suite for ResumePDFDownloadView"""
    
    def setUp(self):
        # Create test users
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass')
        
        # Create test resumes
        self.resume = Resume.objects.create(
            title='Test Resume',
            name='Test User',
            professional_title='Software Engineer',
            email='test@example.com',
            user=self.user
        )
        self.other_resume = Resume.objects.create(
            title='Other Resume',
            name='Other User', 
            user=self.other_user
        )
        
        # URL for PDF download
        self.pdf_url = reverse('download_resume_pdf', kwargs={'resume_id': self.resume.id})
        self.other_pdf_url = reverse('download_resume_pdf', kwargs={'resume_id': self.other_resume.id})
        self.invalid_pdf_url = reverse('download_resume_pdf', kwargs={'resume_id': 99999})
    
    def authenticate(self, user=None):
        """Helper method to authenticate user"""
        if user is None:
            user = self.user
        token = RefreshToken.for_user(user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_authenticated_download_success(self):
        """Test authenticated user can download their PDF"""
        self.authenticate()
        response = self.client.get(self.pdf_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('Content-Disposition', response)
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertGreater(len(response.content), 0)  # PDF has content
    
    def test_unauthenticated_access_denied(self):
        """Test unauthenticated access returns 401"""
        response = self.client.get(self.pdf_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_cannot_access_other_users_resume(self):
        """Test user cannot access another user's resume"""
        self.authenticate()
        response = self.client.get(self.other_pdf_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_nonexistent_resume_404(self):
        """Test invalid resume ID returns 404"""
        self.authenticate()
        response = self.client.get(self.invalid_pdf_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
