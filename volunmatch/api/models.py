# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
    skills = models.CharField(max_length=255)
    profile_picture = models.URLField(max_length=200, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # For contact number
    linkedin_url = models.URLField(blank=True, null=True)  # Social media links
    twitter_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)

class Opportunity(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_posted = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE)
    date_applied = models.DateTimeField(auto_now_add=True)
