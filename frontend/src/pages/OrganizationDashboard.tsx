import React, { useState } from 'react'
import { PlusCircle, Users, Star } from 'lucide-react'

const OrganizationDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState([
    { id: 1, title: 'Community Garden Clean-up', date: '2023-06-15', location: 'Central Park', volunteers: 5 },
    { id: 2, title: 'Food Bank Assistant', date: '2023-06-18', location: 'Downtown', volunteers: 10 },
    { id: 3, title: 'Senior Home Visit', date: '2023-06-20', location: 'Sunshine Retirement Home', volunteers: 3 },
  ])

  const [recommendedVolunteers, setRecommendedVolunteers] = useState([
    { id: 1, name: 'John Doe', skills: ['Gardening', 'Leadership'], availability: 'Weekends' },
    { id: 2, name: 'Jane Smith', skills: ['Cooking', 'Organization'], availability: 'Evenings' },
    { id: 3, name: 'Mike Johnson', skills: ['Elderly Care', 'First Aid'], availability: 'Flexible' },
  ])

  const handleAddOpportunity = () => {
    // This would typically open a modal or form to add a new opportunity
    const newOpportunity = {
      id: opportunities.length + 1,
      title: 'New Volunteer Opportunity',
      date: '2023-07-01',
      location: 'TBD',
      volunteers: 0,
    }
    setOpportunities([...opportunities, newOpportunity])
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Organization Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Volunteer Opportunities</h2>
              <button
                onClick={handleAddOpportunity}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New
              </button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {opportunities.map((opportunity) => (
                <li key={opportunity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{opportunity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {opportunity.date} - {opportunity.location}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                      <Users className="h-5 w-5 mr-1" />
                      {opportunity.volunteers}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI-Recommended Volunteers</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recommendedVolunteers.map((volunteer) => (
                <li key={volunteer.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${volunteer.name}&background=random`} alt={volunteer.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{volunteer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        Skills: {volunteer.skills.join(', ')}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                      {volunteer.availability}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
    </div>
  )
}

export default OrganizationDashboard