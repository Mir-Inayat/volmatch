import React, { useEffect, useState } from 'react'
import { Calendar, Clock, Award, MapPin, Search } from 'lucide-react'
import { getLeaderboard, getOpportunities, applyForOpportunity, type Volunteer, type Opportunity, withdrawFromOpportunity } from '../api'

const VolunteerDashboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<Volunteer[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const completedTasks = [
    { id: 1, title: 'Beach Clean-up', date: '2023-05-30', hours: 4 },
    { id: 2, title: 'Animal Shelter Helper', date: '2023-06-05', hours: 3 },
  ]

  const [isApplying, setIsApplying] = useState<number | null>(null);

  // Add state for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState<number | null>(null);

  const handleApply = async (opportunityId: number) => {
    try {
      setIsApplying(opportunityId);
      await applyForOpportunity(opportunityId);
      setFeedbackMessage('Successfully applied for opportunity!');
      
      const updatedOpportunities = await getOpportunities();
      setOpportunities(updatedOpportunities);
      setFilteredOpportunities(updatedOpportunities);
    } catch (error: any) {
      setFeedbackMessage(error.response?.data?.error || 'Failed to apply for opportunity');
    } finally {
      setIsApplying(null);
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  const handleWithdraw = async (opportunityId: number) => {
    if (showWithdrawConfirm === opportunityId) {
      try {
        setIsApplying(opportunityId);
        await withdrawFromOpportunity(opportunityId);
        setFeedbackMessage('Successfully withdrawn from opportunity');
        
        const updatedOpportunities = await getOpportunities();
        setOpportunities(updatedOpportunities);
        setFilteredOpportunities(updatedOpportunities);
      } catch (error: any) {
        setFeedbackMessage(error.response?.data?.error || 'Failed to withdraw from opportunity');
      } finally {
        setIsApplying(null);
        setShowWithdrawConfirm(null);
        setTimeout(() => setFeedbackMessage(''), 3000);
      }
    } else {
      setShowWithdrawConfirm(opportunityId);
      setTimeout(() => setShowWithdrawConfirm(null), 3000); // Reset after 3 seconds
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardData, opportunitiesData] = await Promise.all([
          getLeaderboard(),
          getOpportunities()
        ]);
        setLeaderboard(leaderboardData);
        setOpportunities(opportunitiesData);
        setFilteredOpportunities(opportunitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter opportunities based on search term and filters
  useEffect(() => {
    let filtered = opportunities;

    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(opp => 
        opp.skills_required.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredOpportunities(filtered);
  }, [searchTerm, locationFilter, skillFilter, opportunities]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Volunteer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recommended Opportunities</h2>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                
                <input
                  type="text"
                  placeholder="Filter by skills..."
                  className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>

              {/* Opportunities List */}
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOpportunities.map((opp) => (
                  <li key={opp.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{opp.title}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opp.location}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {opp.applications_count} applied • {opp.volunteers_registered}/{opp.volunteers_needed} spots filled
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button 
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white ${
                            isApplying === opp.id 
                              ? 'bg-gray-400 cursor-not-allowed'
                              : opp.applied
                              ? 'bg-green-600 hover:bg-red-600'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => opp.applied ? handleWithdraw(opp.id) : handleApply(opp.id)}
                          disabled={isApplying === opp.id}
                        >
                          {isApplying === opp.id ? 'Processing...' : 
                           showWithdrawConfirm === opp.id ? 'Confirm Withdrawal?' :
                           opp.applied ? 'Applied' : 'Apply'}
                        </button>
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
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contribution Chart</h2>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">GitHub-style contribution chart coming soon!</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Completed Tasks</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {completedTasks.map((task) => (
                <li key={task.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Date: {task.date}</p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                      {task.hours} hours
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Volunteers Leaderboard</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((entry) => (
                <li key={entry.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{entry.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Total Hours: {entry.hours}</p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      Rank #{entry.rank || '-'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Add feedback message display */}
      {feedbackMessage && (
        <div className="text-center my-2">
          <p className={feedbackMessage.includes('Success') ? 'text-green-600' : 'text-red-600'}>
            {feedbackMessage}
          </p>
        </div>
      )}
    </div>
  )
}

export default VolunteerDashboard