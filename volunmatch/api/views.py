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
from django.db.models import Avg
from .models import VolunteerPerformance
from .models import CommunityPost
from .serializers import CommunityPostSerializer
from .models import PostLike, PostComment
from .serializers import PostCommentSerializer
from .serializers import (
    UserSerializer, 
    OpportunitySerializer,
    OrganizationProfileSerializer
)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            try:
                # Verify this is a volunteer account
                volunteer = Volunteer.objects.get(user=user)
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_type': 'volunteer',
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                })
            except Volunteer.DoesNotExist:
                return JsonResponse({
                    'error': 'This account is not registered as a volunteer'
                }, status=400)
        else:
            return JsonResponse({
                'error': 'Invalid email or password'
            }, status=400)

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

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            # Create user
            user_data = {
                'username': request.data['username'],
                'password': request.data['password'],
                'email': request.data['email'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name']
            }
            
            user = User.objects.create_user(**user_data)
            
            # Create volunteer profile
            volunteer_data = {
                'user': user,
                'location': request.data.get('location', ''),
                'skills': request.data.get('skills', []),
                'bio': request.data.get('bio', ''),
                'interests': request.data.get('interests', []),
                'availability': request.data.get('availability', []),
                'experience': request.data.get('experience', '')
            }
            
            volunteer = Volunteer.objects.create(**volunteer_data)
            
            # Generate token for auto-login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out"}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class VolunteerListCreate(generics.ListCreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated]

class OpportunityListCreate(generics.ListCreateAPIView):
    queryset = VolunteerOpportunity.objects.all()
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Link the opportunity to the organization
        organization = Organization.objects.get(user=self.request.user)
        serializer.save(organization=organization)

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

class VolunteerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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

    def patch(self, request):
        try:
            volunteer = Volunteer.objects.get(user=request.user)
            
            # Update user fields
            user_data = {}
            if 'first_name' in request.data:
                user_data['first_name'] = request.data['first_name']
            if 'last_name' in request.data:
                user_data['last_name'] = request.data['last_name']
            
            if user_data:
                User.objects.filter(id=request.user.id).update(**user_data)
            
            # Update volunteer fields
            volunteer_data = {}
            if 'location' in request.data:
                volunteer_data['location'] = request.data['location']
            if 'skills' in request.data:
                volunteer_data['skills'] = request.data['skills']
            
            if volunteer_data:
                Volunteer.objects.filter(id=volunteer.id).update(**volunteer_data)
            
            # Return updated profile
            updated_volunteer = Volunteer.objects.get(id=volunteer.id)
            serializer = VolunteerProfileSerializer(updated_volunteer)
            return Response(serializer.data)
            
        except Volunteer.DoesNotExist:
            return Response(
                {'error': 'Volunteer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class LeaderboardView(APIView):
    def get(self, request):
        volunteers = Volunteer.objects.all()
        
        # Calculate average rating for each volunteer from their performances
        leaderboard_data = []
        for volunteer in volunteers:
            performances = VolunteerPerformance.objects.filter(volunteer=volunteer)
            avg_rating = performances.aggregate(Avg('rating'))['rating__avg'] or 0.0
            
            leaderboard_data.append({
                'id': volunteer.id,
                'name': f"{volunteer.user.first_name} {volunteer.user.last_name}",
                'hours': volunteer.total_hours,
                'tasks': volunteer.tasks_completed,
                'rating': avg_rating
            })
        
        # Sort by hours completed
        leaderboard_data.sort(key=lambda x: x['hours'], reverse=True)
        
        return Response(leaderboard_data)

class CommunityPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = CommunityPost.objects.all()
        serializer = CommunityPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            # Add the volunteer as the author
            data = request.data.copy()
            
            post = CommunityPost.objects.create(
                author=volunteer,
                title=data.get('title'),
                content=data.get('content'),
                category=data.get('category'),
                tags=data.get('tags', [])
            )
            
            serializer = CommunityPostSerializer(post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = get_object_or_404(CommunityPost, id=post_id)
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            like, created = PostLike.objects.get_or_create(
                post=post,
                volunteer=volunteer
            )
            
            if not created:
                # Unlike if already liked
                like.delete()
                post.likes = post.post_likes.count()
                post.save()
                return Response({'liked': False, 'likes_count': post.likes})
            
            post.likes = post.post_likes.count()
            post.save()
            return Response({'liked': True, 'likes_count': post.likes})
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PostCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(CommunityPost, id=post_id)
        comments = post.post_comments.all()
        serializer = PostCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = get_object_or_404(CommunityPost, id=post_id)
            volunteer = get_object_or_404(Volunteer, user=request.user)
            
            comment = PostComment.objects.create(
                post=post,
                author=volunteer,
                content=request.data.get('content')
            )
            
            post.comments = post.post_comments.count()
            post.save()
            
            serializer = PostCommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class OrganizationProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = OrganizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Organization, user=self.request.user)

class OrganizationRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            # Check if user already exists
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                return Response({
                    'error': 'An account with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create user
            user_data = {
                'username': email,  # Use email as username
                'email': email,
                'password': request.data['password'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name']
            }
            
            try:
                user = User.objects.create_user(**user_data)
            except Exception as e:
                return Response({
                    'error': f'Error creating user: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create organization profile
            organization_data = {
                'user': user,
                'name': request.data.get('name'),
                'description': request.data.get('description', ''),
                'location': request.data.get('location', ''),
                'website': request.data.get('website', ''),
                'phone': request.data.get('phone', ''),
                'category': request.data.get('category', '')
            }
            
            try:
                organization = Organization.objects.create(**organization_data)
            except Exception as e:
                user.delete()  # Cleanup if organization creation fails
                return Response({
                    'error': f'Error creating organization: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Registration failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class OrganizationLoginView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        print("Received login data:", data)  # Add this log
        email = data.get('email')
        password = data.get('password')

        print("Attempting login with:", email)  # Add this log
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            try:
                # Verify this is an organization account
                organization = Organization.objects.get(user=user)
                print("Found organization:", organization.name)  # Add this log
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful',
                    'organization': {
                        'id': organization.id,
                        'name': organization.name
                    }
                })
            except Organization.DoesNotExist:
                print("No organization found for user")  # Add this log
                return JsonResponse({'error': 'This account is not registered as an organization'}, status=400)
        else:
            print("Authentication failed")  # Add this log
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

class RecommendVolunteersForOrganization(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            organization = get_object_or_404(Organization, user=request.user)
            opportunities = organization.opportunities.all()
            
            if not opportunities.exists():
                return Response({
                    'message': 'No opportunities found for this organization',
                    'volunteers': []
                }, status=status.HTTP_200_OK)
            
            rec_sys = VolunteerRecommendationSystem()
            rec_sys.fetch_data()
            rec_sys.preprocess_data()
            rec_sys.train_content_based_model()
            
            recommended_volunteers = set()
            for opportunity in opportunities:
                volunteers = rec_sys.get_volunteers_for_opportunity(opportunity.id, top_n=3)
                if volunteers:
                    recommended_volunteers.update(volunteers)
            
            recommendations = list(recommended_volunteers)[:10]
            
            if not recommendations:
                return Response({
                    'message': 'No recommended volunteers found',
                    'volunteers': []
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Successfully found recommendations',
                'volunteers': recommendations
            })
            
        except Exception as e:
            print("Error in recommendation:", str(e))
            return Response({
                'error': str(e),
                'volunteers': []
            }, status=status.HTTP_400_BAD_REQUEST)

class OpportunityApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, opportunity_id):
        try:
            volunteer = get_object_or_404(Volunteer, user=request.user)
            opportunity = get_object_or_404(VolunteerOpportunity, id=opportunity_id)
            
            # Check if already applied
            existing_application = Application.objects.filter(
                volunteer=volunteer, 
                opportunity=opportunity
            ).first()
            
            if existing_application:
                existing_application.delete()
                opportunity.volunteers_registered = Application.objects.filter(opportunity=opportunity).count()  # Update count
                opportunity.save()
                return Response({
                    'message': 'Application withdrawn successfully',
                    'status': 'withdrawn'
                })
            
            # Check capacity before creating new application
            if opportunity.volunteers_registered >= opportunity.volunteers_needed:
                return Response(
                    {'error': 'This opportunity is already full'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create new application
            application = Application.objects.create(
                volunteer=volunteer,
                opportunity=opportunity,
                status='pending'
            )
            
            # Update count based on actual applications
            opportunity.volunteers_registered = Application.objects.filter(opportunity=opportunity).count()
            opportunity.save()
            
            return Response({
                'message': 'Application submitted successfully',
                'status': 'applied',
                'application_id': application.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request, opportunity_id):
        try:
            volunteer = get_object_or_404(Volunteer, user=request.user)
            application = Application.objects.filter(
                volunteer=volunteer,
                opportunity_id=opportunity_id
            ).first()
            
            return Response({
                'is_applied': bool(application),
                'application_id': application.id if application else None
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
