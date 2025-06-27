from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import RegisterSerializer, UserProfileSerializer
from .models import UserProfile
from rest_framework.permissions import AllowAny, IsAuthenticated

class RegisterView(generics.CreateAPIView, generics.RetrieveAPIView):
    serializer_class = RegisterSerializer

    def get_permissions(self):
        """
        Allow anyone to register (POST),
        but only authenticated users can retrieve their data (GET).
        """
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self):
        """
        For GET request, return the authenticated user.
        """
        return self.request.user

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get_object(self):
        """
        Get the user's profile.
        """
        return UserProfile.objects.get(user=self.request.user)
