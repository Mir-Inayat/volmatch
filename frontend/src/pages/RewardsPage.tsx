import React from 'react'

const RewardsPage: React.FC = () => {
  // Sample data for top volunteers (replace with real data fetched from backend)
  const topVolunteers = [
    { id: 1, name: 'Rahul', points: 1200, badges: ['Community Star'] },
    { id: 2, name: 'Ayesha', points: 1100, badges: ['Dedicated Helper'] },
    { id: 3, name: 'Arjun', points: 1000, badges: ['Volunteer Champion'] },
  ]

  const handleReward = (volunteerId: number) => {
    // Function to handle rewarding the volunteer
    alert(`Reward given to volunteer ID: ${volunteerId}`)
    // Here, add API call logic to send reward details to the backend
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-8">Top Volunteers</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topVolunteers.map(volunteer => (
          <div key={volunteer.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold">{volunteer.name}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Points: {volunteer.points}</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Badges: {volunteer.badges.join(', ')}</p>
            <button
              onClick={() => handleReward(volunteer.id)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Give Reward
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RewardsPage
