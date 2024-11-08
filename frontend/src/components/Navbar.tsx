import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Menu, LogOut } from 'lucide-react'
import { logout } from '../api'

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem('authToken')
  const userType = localStorage.getItem('userType')

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderNavLinks = (isMobile: boolean = false) => {
    const baseClasses = isMobile 
      ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

    return (
      <>
        <Link to="/" className={baseClasses}>Home</Link>
        
        {isAuthenticated && userType === 'volunteer' && (
          <>
            <Link to="/volunteer-dashboard" className={baseClasses}>Volunteer Dashboard</Link>
            <Link to="/leaderboard" className={baseClasses}>Leaderboard</Link>
            <Link to="/community" className={baseClasses}>Community</Link>
            <Link to="/profile" className={baseClasses}>Profile</Link>
          </>
        )}

        {isAuthenticated && userType === 'organization' && (
          <>
            <Link to="/organization-dashboard" className={baseClasses}>Organization Dashboard</Link>
            <Link to="/profile" className={baseClasses}>Profile</Link>
          </>
        )}
      </>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-8" src="/logo.svg" alt="VolunMatch" />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {renderNavLinks()}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Login
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar