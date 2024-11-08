from django.shortcuts import render

# Create your views here.
from .models import Volunteer, Opportunity, Application
from .serializers import VolunteerSerializer, OpportunitySerializer, ApplicationSerializer, RegisterSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .recommendations import VolunteerRecommendationSystem
from django.contrib.auth import authenticate

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

class CustomLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Please provide both username and password."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is not None:
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
