# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)  # Organization name
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    website = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

class VolunteerOpportunity(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='opportunities')
    title = models.CharField(max_length=200)
    date = models.DateField()
    location = models.CharField(max_length=200)
    volunteers_needed = models.IntegerField(default=1)
    volunteers_registered = models.IntegerField(default=0)
    description = models.TextField()
    skills_required = models.JSONField(default=list)  # List of required skills
    created_at = models.DateTimeField(auto_now_add=True)

class VolunteerPerformance(models.Model):
    volunteer = models.ForeignKey('Volunteer', on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    hours_completed = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        default=0.0
    )
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['volunteer', 'organization']

class VolunteerRecommendation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    volunteer = models.ForeignKey('Volunteer', on_delete=models.CASCADE)
    skills_match = models.JSONField(default=list)  # List of matching skills
    availability = models.CharField(max_length=100)
    match_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['volunteer', 'organization']
        ordering = ['-match_score']

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100, blank=True, default="")
    join_date = models.DateField(default=timezone.now)
    total_hours = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    skills = models.JSONField(default=list)
    badges = models.JSONField(default=list)
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list)
    availability = models.JSONField(default=list)
    experience = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

class VolunteerActivity(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=200)
    date = models.DateField()
    hours = models.IntegerField()
    
    class Meta:
        ordering = ['-date']

class Opportunity(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_posted = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    opportunity = models.ForeignKey(VolunteerOpportunity, on_delete=models.CASCADE)
    date_applied = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected'),
            ('completed', 'Completed')
        ],
        default='pending'
    )
    hours_completed = models.IntegerField(default=0)

class CommunityPost(models.Model):
    author = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    tags = models.JSONField(default=list)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class PostLike(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='post_likes')
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'volunteer']

class PostComment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='post_comments')
    author = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
