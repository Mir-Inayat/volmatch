import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Volunteer, Opportunity

class VolunteerRecommendationSystem:
    def __init__(self):
        self.volunteer_data = None
        self.opportunity_data = None
        self.volunteer_item_matrix = None
        self.content_based_model = None
        self.collaborative_model = None
        self.volunteer_similarity_matrix = None

    def fetch_data(self):
        # Fetch volunteer data with ratings
        volunteers = Volunteer.objects.all()
        self.volunteer_data = pd.DataFrame([{
            'volunteer_id': v.id,
            'opportunity_id': v.opportunity_id,
            'rating': v.rating,
            'skills': v.skills
        } for v in volunteers])

        # Fetch opportunity data
        opportunities = Opportunity.objects.all()
        self.opportunity_data = pd.DataFrame([{
            'opportunity_id': opp.id,
            'title': opp.title,
            'description': opp.description,
            'required_skills': opp.required_skills,
            'location': opp.location
        } for opp in opportunities])

    def preprocess_data(self):
        # Create volunteer-item interaction matrix
        self.volunteer_item_matrix = pd.pivot_table(
            self.volunteer_data,
            values='rating',
            index='volunteer_id',
            columns='opportunity_id',
            fill_value=0
        )

        # Prepare data for content-based filtering
        self.opportunity_data['combined_features'] = (
            self.opportunity_data['title'] + ' ' +
            self.opportunity_data['description'] + ' ' +
            self.opportunity_data['required_skills'] + ' ' +
            self.opportunity_data['location']
        )

    def train_content_based_model(self):
        # Use TF-IDF to calculate similarity between opportunities based on their combined features
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.opportunity_data['combined_features'])
        self.content_based_model = cosine_similarity(tfidf_matrix)

    def train_collaborative_model(self):
        # Calculate volunteer-volunteer similarity matrix using collaborative filtering
        self.volunteer_similarity_matrix = cosine_similarity(self.volunteer_item_matrix)

    def get_content_based_recommendations(self, opportunity_id, top_n=5):
        # Get similar opportunities based on content similarity
        idx = self.opportunity_data.index[self.opportunity_data['opportunity_id'] == opportunity_id].tolist()[0]
        sim_scores = list(enumerate(self.content_based_model[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:top_n+1]
        opportunity_indices = [i[0] for i in sim_scores]
        return self.opportunity_data.iloc[opportunity_indices]

    def get_collaborative_recommendations(self, volunteer_id, top_n=5):
        # Find volunteers similar to the current volunteer
        volunteer_index = self.volunteer_item_matrix.index.get_loc(volunteer_id)
        similar_volunteers = self.volunteer_similarity_matrix[volunteer_index].argsort()[::-1][1:11]

        # Look for opportunities that similar volunteers rated highly but this volunteer hasn't rated yet
        volunteer_opportunities = self.volunteer_item_matrix.loc[volunteer_id]
        unrated_opportunities = volunteer_opportunities[volunteer_opportunities == 0].index
        
        recommendations = []
        for opp_id in unrated_opportunities:
            opp_ratings = self.volunteer_item_matrix[opp_id].iloc[similar_volunteers]
            avg_rating = opp_ratings[opp_ratings > 0].mean()
            if not np.isnan(avg_rating):
                recommendations.append((opp_id, avg_rating))

        recommendations.sort(key=lambda x: x[1], reverse=True)
        top_recommendations = recommendations[:top_n]
        return self.opportunity_data[self.opportunity_data['opportunity_id'].isin([i[0] for i in top_recommendations])]

    def get_hybrid_recommendations(self, volunteer_id, opportunity_id, top_n=5):
        # Get content-based and collaborative filtering recommendations
        content_based_recs = self.get_content_based_recommendations(opportunity_id, top_n)
        collaborative_recs = self.get_collaborative_recommendations(volunteer_id, top_n)

        # Combine recommendations and remove duplicates
        hybrid_recs = pd.concat([content_based_recs, collaborative_recs]).drop_duplicates()

        # Limit to top_n recommendations
        top_recommendations = hybrid_recs.head(top_n)
        return [
            {
                'opportunity_id': int(row['opportunity_id']),
                'title': row['title'],
                'description': row['description'],
                'required_skills': row['required_skills'],
                'location': row['location']
            }
            for _, row in top_recommendations.iterrows()
        ]

    def get_volunteers_for_opportunity(self, opportunity_id, top_n=5):
        # Suggest volunteers for an opportunity based on skills matching
        opportunity = self.opportunity_data[self.opportunity_data['opportunity_id'] == opportunity_id]
        required_skills = opportunity['required_skills'].values[0]
        volunteers = self.volunteer_data[self.volunteer_data['skills'].str.contains(required_skills)]
        
        volunteer_ids = volunteers['volunteer_id'].unique()
        recommended_volunteers = Volunteer.objects.filter(id__in=volunteer_ids)[:top_n]
        return [
            {
                'volunteer_id': v.id,
                'name': v.name,
                'skills': v.skills,
                'rating': v.rating
            }
            for v in recommended_volunteers
        ]
