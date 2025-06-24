from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Resume
        fields = ['id', 'title', 'user', 'uuid', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'uuid', 'created_at', 'updated_at']
