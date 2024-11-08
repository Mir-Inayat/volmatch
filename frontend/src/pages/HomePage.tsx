import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Award } from 'lucide-react'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            VolunMatch: AI-Powered Volunteer Engagement Hub
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl">
            Connect with meaningful volunteer opportunities tailored just for you.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700">
              Sign Up
            </Link>
            <Link to="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
              Log In
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
              <Heart className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium">AI-Driven Matching</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                Our AI algorithm matches you with the perfect volunteer opportunities based on your skills and interests.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium">Community Engagement</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                Connect with like-minded volunteers and organizations to make a real difference in your community.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
              <Award className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium">Rewards and Recognition</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                Earn points, badges, and climb the leaderboard as you contribute to meaningful causes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              <span className="block">Ready to make a difference?</span>
              <span className="block text-blue-600">Join VolunMatch today.</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link to="/about" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage