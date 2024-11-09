import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, Calendar, Clock, Award } from 'lucide-react';
import { fetchProfile, updateProfile, type Profile } from '../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn, staggerContainer } from '../components/animations/AnimationConfig';
import { useSpotlight } from '../hooks/useSpotlight';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { mousePosition, getGradientStyle, initialGradientStyle } = useSpotlight();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        setIsLoading(true);
        const data = await fetchProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        if (err instanceof Error) {
          if (err.message === 'Please log in to view your profile') {
            navigate('/login');
          } else {
            setError(err.message);
          }
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      const updatedProfile = await fetchProfile();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        staggerChildren: 0.4
      }
    }
  };

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const fullName = `${profile.user.first_name} ${profile.user.last_name}`;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen relative overflow-hidden"
      style={mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y)}
    >
      <div 
        className="absolute inset-0 bg-white/10 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <motion.div 
        variants={staggerContainer}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <motion.div 
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-md shadow rounded-lg p-6 border border-gray-700"
        >
          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold text-white">Volunteer Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isEditing) {
                  setFormData(profile || {});
                }
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </motion.div>

          {isEditing ? (
            <motion.form 
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit} 
              className="bg-gray-800/30 backdrop-blur-md shadow overflow-hidden sm:rounded-lg p-6 border border-gray-700"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.user?.first_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.user?.last_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills?.join(', ') || ''}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim());
                      setFormData({
                        ...formData,
                        skills
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/30 backdrop-blur-md shadow overflow-hidden sm:rounded-lg border border-gray-700"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-20 w-20">
                    <img 
                      className="h-20 w-20 rounded-full" 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=80&background=random`} 
                      alt={fullName} 
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{fullName}</h3>
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
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.user.email}</dd>
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
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(profile.join_date).toLocaleDateString()}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Total volunteer hours
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.total_hours} hours</dd>
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
            </motion.div>
          )}

          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gray-800/30 backdrop-blur-md shadow overflow-hidden sm:rounded-lg border border-gray-700"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activities</h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {profile.activities.map((activity) => (
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
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;