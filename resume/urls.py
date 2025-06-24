from django.urls import path
from .views import ResumeViewSet
from django.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('', include(router.urls)),
]
