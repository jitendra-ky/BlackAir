from rest_framework import permissions
from rest_framework import viewsets
from .models import Resume, Education, Experience, Project, Skill, Certification, Achievement
from .serializers import (
    ResumeSerializer, EducationSerializer, ExperienceSerializer, 
    ProjectSerializer, SkillSerializer, CertificationSerializer, AchievementSerializer
)

class ResumeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeSerializer

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EducationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EducationSerializer

    def get_queryset(self):
        queryset = Education.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset


class ExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        queryset = Experience.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset


class SkillViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SkillSerializer

    def get_queryset(self):
        queryset = Skill.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset


class CertificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificationSerializer

    def get_queryset(self):
        queryset = Certification.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset


class AchievementViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementSerializer

    def get_queryset(self):
        queryset = Achievement.objects.filter(resume__user=self.request.user)
        resume_id = self.request.query_params.get('resume', None)
        if resume_id is not None:
            queryset = queryset.filter(resume=resume_id)
        return queryset
