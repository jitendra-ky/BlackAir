from django.urls import path
from .views import (
    ResumeViewSet, EducationViewSet, ExperienceViewSet, 
    ProjectViewSet, SkillViewSet, CertificationViewSet, AchievementViewSet
)
from django.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'achievements', AchievementViewSet, basename='achievement')

urlpatterns = [
    path('', include(router.urls)),
]
