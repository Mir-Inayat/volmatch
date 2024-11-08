from django.shortcuts import render

# Create your views here.
from .models import Volunteer, Opportunity, Application
from .serializers import VolunteerSerializer, OpportunitySerializer, ApplicationSerializer, RegisterSerializer, VolunteerProfileSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .recommendations import VolunteerRecommendationSystem
from django.contrib.auth import authenticate

# In api/views.py
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Volunteer, VolunteerActivity, Organization, VolunteerOpportunity

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Create a token for the user
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
        
class RecommendOpportunitiesForVolunteer(APIView):
    def get(self, request, volunteer_id):
        rec_sys = VolunteerRecommendationSystem()
        rec_sys.fetch_data()
        rec_sys.preprocess_data()
        rec_sys.train_content_based_model()
        rec_sys.train_collaborative_model()
        recommendations = rec_sys.get_hybrid_recommendations(volunteer_id, top_n=5)
        return Response(recommendations)

class RecommendVolunteersForOpportunity(APIView):
    def get(self, request, opportunity_id):
        rec_sys = VolunteerRecommendationSystem()
        rec_sys.fetch_data()
        rec_sys.preprocess_data()
        rec_sys.train_content_based_model()
        recommendations = rec_sys.get_volunteers_for_opportunity(opportunity_id, top_n=5)
        return Response(recommendations)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class VolunteerListCreate(generics.ListCreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated]

class OpportunityListCreate(generics.ListCreateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

class ApplicationListCreate(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the volunteer profile for the logged-in user
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            # Format the response data
            profile_data = {
                'user': {
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'email': request.user.email,
                },
                'location': volunteer.location,
                'join_date': volunteer.join_date,
                'total_hours': volunteer.total_hours,
                'tasks_completed': volunteer.tasks_completed,
                'skills': volunteer.skills,
                'badges': volunteer.badges,
                'activities': []
            }

            # Get related activities
            activities = volunteer.activities.all().order_by('-date')[:5]  # Get 5 most recent activities
            profile_data['activities'] = [
                {
                    'id': activity.id,
                    'title': activity.title,
                    'date': activity.date,
                    'hours': activity.hours
                }
                for activity in activities
            ]

            return Response(profile_data)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch profile data'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request):
        try:
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            # Update user info
            user = request.user
            user_data = request.data.get('user', {})
            if user_data:
                user.first_name = user_data.get('first_name', user.first_name)
                user.last_name = user_data.get('last_name', user.last_name)
                user.email = user_data.get('email', user.email)
                user.save()

            # Update volunteer info
            volunteer.location = request.data.get('location', volunteer.location)
            volunteer.skills = request.data.get('skills', volunteer.skills)
            volunteer.save()

            return Response({'message': 'Profile updated successfully'})
        except Exception as e:
            return Response(
                {'error': 'Failed to update profile'},
                status=status.HTTP_400_BAD_REQUEST
            )

class VolunteerActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            activity_data = {
                'volunteer': volunteer.id,
                'title': request.data['title'],
                'date': request.data['date'],
                'hours': request.data['hours']
            }

            # Create new activity
            activity = VolunteerActivity.objects.create(**activity_data)

            # Update volunteer's total hours
            volunteer.total_hours += activity.hours
            volunteer.tasks_completed += 1
            volunteer.save()

            return Response({
                'message': 'Activity added successfully',
                'activity': {
                    'id': activity.id,
                    'title': activity.title,
                    'date': activity.date,
                    'hours': activity.hours
                }
            })
        except Exception as e:
            return Response(
                {'error': 'Failed to add activity'},
                status=status.HTTP_400_BAD_REQUEST
            )

class RegisterVolunteerView(generics.CreateAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [permissions.AllowAny]

class VolunteerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Volunteer, user=self.request.user)
