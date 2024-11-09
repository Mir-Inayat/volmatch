import React from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Building2 } from 'lucide-react'
import { motion } from 'framer-motion';
import { fadeInUp, fadeIn } from '../components/animations/AnimationConfig';

const LoginPage: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center"
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
        variants={fadeInUp}
        className="max-w-md w-full bg-gray-800/30 backdrop-blur-md rounded-lg shadow-lg p-8 border border-gray-700"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-3xl font-bold text-center mb-8 text-white"
        >
          Login to VolunMatch
        </motion.h2>
        
        <div className="mt-8 space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/login/volunteer"
              className="relative block w-full bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:bg-gray-800/70 hover:scale-[1.02]"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserPlus className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Login as a Volunteer
                  </h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Access your volunteer dashboard and opportunities
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/login/organization"
              className="relative block w-full bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:bg-gray-800/70 hover:scale-[1.02]"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Login as an Organization
                  </h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Manage your opportunities and connect with volunteers
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 ease-in-out">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginPage;