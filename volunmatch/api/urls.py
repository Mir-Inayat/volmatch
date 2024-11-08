from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('volunteers/', views.VolunteerListCreate.as_view(), name='volunteer-list'),
    path('opportunities/', views.OpportunityListCreate.as_view(), name='opportunity-list'),
    path('applications/', views.ApplicationListCreate.as_view(), name='application-list'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('recommendations/opportunities/<int:volunteer_id>/', views.RecommendOpportunitiesForVolunteer.as_view(), name='recommend_opportunities'),
    path('recommendations/volunteers/<int:opportunity_id>/', views.RecommendVolunteersForOpportunity.as_view(), name='recommend_volunteers'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.VolunteerProfileView.as_view(), name='profile'),
    path('profile/activity/', views.VolunteerActivityView.as_view(), name='volunteer-activity'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
]
