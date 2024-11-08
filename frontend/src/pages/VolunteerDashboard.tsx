import React from 'react'
import { Calendar, Clock, Award } from 'lucide-react'

const VolunteerDashboard: React.FC = () => {
  // Dummy data for demonstration
  const recommendations = [
    { id: 1, title: 'Community Garden Clean-up', organization: 'Green Earth', date: '2023-06-15', location: 'Central Park' },
    { id: 2, title: 'Food Bank Assistant', organization: 'City Food Bank', date: '2023-06-18', location: 'Downtown' },
    { id: 3, title: 'Senior Home Visit', organization: 'Elder Care', date: '2023-06-20', location: 'Sunshine Retirement Home' },
  ]

  const completedTasks = [
    { id: 1, title: 'Beach Clean-up', date: '2023-05-30', hours: 4 },
    { id: 2, title: 'Animal Shelter Helper', date: '2023-06-05', hours: 3 },
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Volunteer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Recommendations</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recommendations.map((rec) => (
                <li key={rec.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{rec.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{rec.organization}</p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                      View Details
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contribution Chart</h2>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">GitHub-style contribution chart placeholder</p>
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
              {[...Array(5)].map((_, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Volunteer {index + 1}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Total Hours: {100 - index * 10}</p>
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      Rank #{index + 1}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerDashboard