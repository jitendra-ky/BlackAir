from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.views import APIView
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from weasyprint import HTML
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


class ResumePDFDownloadView(APIView):
    """
    Generate and download resume as PDF using WeasyPrint
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, resume_id):
        # User is already authenticated by permission_classes
        user = request.user
        
        # Get the resume and ensure it belongs to the current user
        resume = get_object_or_404(Resume, id=resume_id, user=user)
        
        # Get all related data
        education = Education.objects.filter(resume=resume).order_by('-start_date')
        experience = Experience.objects.filter(resume=resume).order_by('-start_date')
        projects = Project.objects.filter(resume=resume).order_by('-start_date')
        skills = Skill.objects.filter(resume=resume).order_by('category', 'name')
        certifications = Certification.objects.filter(resume=resume).order_by('-issue_date')
        achievements = Achievement.objects.filter(resume=resume).order_by('-date_achieved')
        
        # Prepare context for template
        context = {
            'resume': resume,
            'education': education,
            'experience': experience,
            'projects': projects,
            'skills': skills,
            'certifications': certifications,
            'achievements': achievements,
        }
        
        # Render HTML template
        html_string = render_to_string('pdf/resume_pdf.html', context)
        
        # Generate PDF
        try:
            # Create PDF from HTML
            pdf = HTML(string=html_string).write_pdf()
            
            # Create response
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = f"resume_{resume.title.replace(' ', '_') if resume.title else 'resume'}_{resume_id}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            # Log the error in production
            return HttpResponse(f'Error generating PDF: {str(e)}', status=500)
