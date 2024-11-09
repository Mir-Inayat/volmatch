import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSpotlight } from '../hooks/useSpotlight';

const VolunteerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { mousePosition, getGradientStyle, initialGradientStyle } = useSpotlight();

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Implement Google login here if applicable
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(email, password);
      
      // Verify that the user is a volunteer
      if (response.user_type !== 'volunteer') {
        setError('This account is not registered as a volunteer.');
        return;
      }

      // If verification passes, store tokens and user type
      localStorage.setItem('authToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('userType', 'volunteer');

      setAuth(true, 'volunteer');
      navigate('/profile');
    } catch (err: any) {
      console.error('Login failed:', err);
      // Show more specific error messages
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] relative overflow-hidden flex items-center justify-center"
      style={mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y)}
    >
      <div 
        className="absolute inset-0 bg-white/10 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <div className="max-w-md w-full space-y-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login options
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Volunteer Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your email and password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out hover:shadow-lg"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup/volunteer" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 ease-in-out">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerLoginPage;
