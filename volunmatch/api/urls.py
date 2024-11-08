from django.urls import path
from .views import (
    VolunteerListCreate,
    OpportunityListCreate,
    ApplicationListCreate,
    RegisterView,
    LogoutView,
    RecommendOpportunitiesForVolunteer,
    RecommendVolunteersForOpportunity,
    LoginView
)

urlpatterns = [
    path('volunteers/', VolunteerListCreate.as_view(), name='volunteer-list'),
    path('opportunities/', OpportunityListCreate.as_view(), name='opportunity-list'),
    path('applications/', ApplicationListCreate.as_view(), name='application-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('recommendations/opportunities/<int:volunteer_id>/', RecommendOpportunitiesForVolunteer.as_view(), name='recommend_opportunities'),
    path('recommendations/volunteers/<int:opportunity_id>/', RecommendVolunteersForOpportunity.as_view(), name='recommend_volunteers'),
    path('login/', LoginView.as_view(), name='login'),
]
