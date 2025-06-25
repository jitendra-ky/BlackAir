from rest_framework import serializers
from .models import Resume, Education, Experience, Project, Skill, Certification, Achievement

class ResumeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Resume
        fields = ['id', 'title', 'user', 'uuid', 'name', 'professional_title', 'phone', 
                 'email', 'location', 'linkedin_url', 'github_url', 'website_url', 
                 'twitter_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'uuid', 'created_at', 'updated_at']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'resume', 'school', 'degree', 'field_of_study', 'start_date', 
                 'end_date', 'gpa', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'resume', 'company', 'position', 'location', 'start_date', 
                 'end_date', 'is_current', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'resume', 'name', 'description', 'technologies', 'start_date', 
                 'end_date', 'project_url', 'github_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'resume', 'name', 'category', 'level', 'years_of_experience', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'resume', 'name', 'issuing_organization', 'issue_date', 
                 'expiration_date', 'credential_id', 'credential_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'resume', 'title', 'description', 'date_achieved', 
                 'organization', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
