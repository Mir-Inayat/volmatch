import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Menu, LogOut } from 'lucide-react'
import { logout } from '../api'
import { useAuth } from '../contexts/AuthContext'
import logo from '../img/logo.jpg';

const Navbar: React.FC = () => {
  const { isAuthenticated, userType, setAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setAuth(false, null);
      setIsMenuOpen(false);
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
        
        {!isAuthenticated && (
          <>
            <Link to="/about" className={baseClasses}>Learn More</Link>
            <Link to="/signup" className={`${baseClasses} text-blue-600 hover:text-blue-700`}>
              Get Started
            </Link>
          </>
        )}
        
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
            <Link to="/organization/profile" className={baseClasses}>Organization Profile</Link>
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
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="VolunMatch Logo" 
                className="h-8 w-8 rounded-full mr-2"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">VolunMatch</span>
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