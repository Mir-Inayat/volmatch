import React, { useState, useEffect } from 'react'
import { PlusCircle, Users, Star } from 'lucide-react'
import { getRecommendedVolunteers, getOpportunities } from '../api'
import OpportunityModal from '../components/OpportunityModal';
import { createOpportunity } from '../api';
import { Link } from 'react-router-dom'

interface RecommendedVolunteer {
  volunteer_id: number;
  name: string;
  skills: string[];
  rating: number;
}

interface Opportunity {
  id: number;
  title: string;
  date: string;
  location: string;
  volunteers_needed: number;
  volunteers_registered: number;
  created_at: string;
}

interface OpportunityFormData {
  title: string;
  date: string;
  location: string;
  volunteers_needed: number;
  description?: string;
  duration: number;
  skills_required: string[];
}

const OrganizationDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  const [recommendedVolunteers, setRecommendedVolunteers] = useState<RecommendedVolunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecommendedVolunteers = async () => {
      try {
        const data = await getRecommendedVolunteers();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          setRecommendedVolunteers(data);
        } else if (data.message) {
          console.log('Message from API:', data.message);
          setRecommendedVolunteers([]);
        } else {
          setRecommendedVolunteers([]);
        }
      } catch (error) {
        console.error('Error fetching recommended volunteers:', error);
        setRecommendedVolunteers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedVolunteers();
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await getOpportunities();
        console.log('Fetched opportunities:', data);
        const sortedOpportunities = data.sort((a: Opportunity, b: Opportunity) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOpportunities(sortedOpportunities);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  const handleAddOpportunity = async (formData: OpportunityFormData) => {
    try {
      const newOpportunity = await createOpportunity(formData);
      setOpportunities([...opportunities, newOpportunity]);
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Organization Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Volunteer Opportunities</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {opportunities.map((opportunity) => (
                  <li key={opportunity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{opportunity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {new Date(opportunity.date).toLocaleDateString()} - {opportunity.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                          <Users className="h-5 w-5 mr-1" />
                          {opportunity.volunteers_registered}/{opportunity.volunteers_needed}
                        </div>
                        <Link
                          to={`/opportunities/${opportunity.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI-Recommended Volunteers</h2>
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading recommendations...</div>
            ) : recommendedVolunteers.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recommendedVolunteers.map((volunteer) => (
                    <li key={volunteer.volunteer_id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-8 w-8 rounded-full" 
                            src={`https://ui-avatars.com/api/?name=${volunteer.name}&background=random`} 
                            alt={volunteer.name} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {volunteer.name}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {volunteer.skills.map((skill, index) => (
                              <span 
                                key={index}
                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {volunteer.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No recommended volunteers found. Try adding more volunteer opportunities to get recommendations.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Volunteer Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hours</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tasks Completed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Volunteer {index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{20 - index * 2} hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{10 - index} tasks</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span>{5 - index * 0.5}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />
    </div>
  )
}

export default OrganizationDashboard