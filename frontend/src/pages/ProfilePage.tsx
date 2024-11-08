import React from 'react'
import { User, Mail, MapPin, Calendar, Clock, Award } from 'lucide-react'

const ProfilePage: React.FC = () => {
  // Dummy data for the profile
  const profile = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    location: 'New York, NY',
    joinDate: 'January 2023',
    totalHours: 120,
    tasksCompleted: 25,
    skills: ['Gardening', 'Teaching', 'Event Planning'],
    badges: ['Early Bird', 'Team Player', 'Local Hero'],
    recentActivities: [
      { id: 1, title: 'Community Garden Clean-up', date: '2023-06-01', hours: 4 },
      { id: 2, title: 'Food Bank Volunteer', date: '2023-05-15', hours: 3 },
      { id: 3, title: 'Animal Shelter Assistant', date: '2023-04-30', hours: 5 },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Volunteer Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20">
              <img className="h-20 w-20 rounded-full" src={`https://ui-avatars.com/api/?name=${profile.name}&size=80&background=random`} alt={profile.name} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{profile.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Volunteer Extraordinaire</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.location}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Member since
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.joinDate}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Total volunteer hours
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.totalHours} hours</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <ul className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                  {profile.skills.map((skill) => (
                    <li key={skill} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Badges</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <ul className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                  {profile.badges.map((badge) => (
                    <li key={badge} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-yellow-400" />
                        {badge}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activities</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {profile.recentActivities.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">{activity.title}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                      {activity.hours} hours
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {activity.date}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage