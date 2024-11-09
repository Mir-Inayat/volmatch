import React, { useEffect, useState } from 'react'
import { Trophy, Clock, Star } from 'lucide-react'
import { getLeaderboard, Volunteer } from '../api';

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Dummy data for the leaderboard
        const dummyData = [
          { id: 1, name: 'John Doe', hours: 120, tasks: 25, rating: 4.9 },
          { id: 2, name: 'Jane Smith', hours: 115, tasks: 23, rating: 4.8 },
          { id: 3, name: 'Mike Johnson', hours: 110, tasks: 22, rating: 4.7 },
          { id: 4, name: 'Emily Brown', hours: 105, tasks: 21, rating: 4.6 },
          { id: 5, name: 'David Lee', hours: 100, tasks: 20, rating: 4.5 },
          { id: 6, name: 'Sarah Wilson', hours: 95, tasks: 19, rating: 4.4 },
          { id: 7, name: 'Tom Harris', hours: 90, tasks: 18, rating: 4.3 },
          { id: 8, name: 'Lisa Chen', hours: 85, tasks: 17, rating: 4.2 },
          { id: 9, name: 'Alex Taylor', hours: 80, tasks: 16, rating: 4.1 },
          { id: 10, name: 'Olivia Martinez', hours: 75, tasks: 15, rating: 4.0 },
        ];
        setLeaderboardData(dummyData); // Set dummy data on error
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Global Leaderboard</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Volunteer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hours
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tasks Completed
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboardData.map((volunteer, index) => (
              <tr key={volunteer.id} className={index < 3 ? 'bg-yellow-50 dark:bg-yellow-900' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{index + 1}</span>
                    {index < 3 && <Trophy className="ml-2 h-5 w-5 text-yellow-400" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${volunteer.name}&background=random`} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{volunteer.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="mr-2 h-5 w-5" />
                    {volunteer.hours}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {volunteer.tasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Star className="mr-1 h-5 w-5 text-yellow-400" />
                    {volunteer.rating.toFixed(1)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaderboardPage