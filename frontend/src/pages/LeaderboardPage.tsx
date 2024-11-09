import React, { useEffect, useState } from 'react'
import { Trophy, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion';
import { getLeaderboard, Volunteer } from '../api';

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Dummy data setup...
        setLeaderboardData(dummyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen"
        style={{
          background: `
            radial-gradient(
              circle at 81.4952% 5.51724%, 
              rgb(30, 64, 175) 0%, 
              rgba(30, 58, 138, 0.9) 20%, 
              rgba(23, 37, 84, 0.8) 40%, 
              rgba(15, 23, 42, 0.9) 60%, 
              rgb(15, 23, 42) 80%
            ),
            linear-gradient(
              45deg, 
              rgb(30, 58, 138) 0%, 
              rgb(23, 37, 84) 50%, 
              rgb(15, 23, 42) 100%
            )
          `
        }}>
        <div className="w-12 h-12 border-4 border-blue-400 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(
            circle at 81.4952% 5.51724%, 
            rgb(30, 64, 175) 0%, 
            rgba(30, 58, 138, 0.9) 20%, 
            rgba(23, 37, 84, 0.8) 40%, 
            rgba(15, 23, 42, 0.9) 60%, 
            rgb(15, 23, 42) 80%
          ),
          linear-gradient(
            45deg, 
            rgb(30, 58, 138) 0%, 
            rgb(23, 37, 84) 50%, 
            rgb(15, 23, 42) 100%
          )
        `
      }}
    >
      <motion.div 
        variants={staggerContainer}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <motion.h1 
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-6"
        >
          Global Leaderboard
        </motion.h1>
        
        <motion.div 
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 backdrop-blur-md shadow overflow-hidden sm:rounded-lg border border-gray-700"
        >
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Volunteer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tasks Completed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboardData.map((volunteer, index) => (
                <motion.tr 
                  key={volunteer.id}
                  variants={fadeInUp}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  className={index < 3 ? 'bg-yellow-900/30' : 'bg-gray-800/30'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white">{index + 1}</span>
                      {index < 3 && <Trophy className="ml-2 h-5 w-5 text-yellow-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full ring-2 ring-blue-500/50" 
                          src={`https://ui-avatars.com/api/?name=${volunteer.name}&background=random`} 
                          alt="" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{volunteer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="mr-2 h-5 w-5 text-blue-400" />
                      {volunteer.hours}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {volunteer.tasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <Star className="mr-1 h-5 w-5 text-yellow-400" />
                      {volunteer.rating.toFixed(1)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default LeaderboardPage;