from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Volunteer, Opportunity, Application

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
        model = Opportunity
        fields = '__all__'

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