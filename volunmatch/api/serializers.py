from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Volunteer, Opportunity, Application, CommunityPost, PostLike, PostComment, Organization, VolunteerOpportunity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

# Add this back - it was missing
class VolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Volunteer
        fields = '__all__'

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerOpportunity
        fields = [
            'id',
            'title',
            'description',
            'date',
            'location',
            'volunteers_needed',
            'volunteers_registered',
            'skills_required',
            'created_at'
        ]
        read_only_fields = ['volunteers_registered', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

class VolunteerProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()

    class Meta:
        model = Volunteer
        fields = ['user', 'location', 'join_date', 'total_hours', 'skills', 'badges', 'activities']

    def get_user(self, obj):
        return {
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'email': obj.user.email,
        }

    def get_activities(self, obj):
        activities = obj.application_set.filter(status='completed')
        return [{
            'id': activity.id,
            'title': activity.opportunity.title,
            'date': activity.opportunity.date,
            'hours': activity.hours_completed
        } for activity in activities]

class PostCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = ['id', 'author', 'content', 'created_at']

    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'name': f"{obj.author.user.first_name} {obj.author.user.last_name}",
            'avatar': None
        }

class CommunityPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = PostCommentSerializer(source='post_comments', many=True, read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'author', 'title', 'content', 'category', 'likes', 'comments', 'created_at', 'tags', 'is_liked']

    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'name': f"{obj.author.user.first_name} {obj.author.user.last_name}",
            'avatar': None
        }

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            volunteer = Volunteer.objects.get(user=request.user)
            return obj.post_likes.filter(volunteer=volunteer).exists()
        return False

class OrganizationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Organization
        fields = '__all__'

class OrganizationProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    opportunities = OpportunitySerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = [
            'id',
            'user',
            'name',
            'description',
            'location',
            'website',
            'phone',
            'category',
            'opportunities'
        ]