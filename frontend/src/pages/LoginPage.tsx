import React from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Building2 } from 'lucide-react'

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose your account type to login
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            to="/login/volunteer"
            className="relative block w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Login as a Volunteer
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Access your volunteer dashboard and opportunities
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/login/organization"
            className="relative block w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Login as an Organization
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your opportunities and connect with volunteers
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage