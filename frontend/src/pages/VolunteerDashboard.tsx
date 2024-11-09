import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Filter, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOpportunities, applyForOpportunity, type Opportunity } from '../api';

const VolunteerDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    skills: [] as string[],
    date: ''
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      showNotification('Failed to load opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId: number) => {
    try {
      await applyForOpportunity(opportunityId);
      showNotification('Application submitted successfully!', 'success');
      loadOpportunities(); // Refresh the list
    } catch (error) {
      console.error('Error applying:', error);
      showNotification('Failed to submit application', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         opp.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = !filters.location || opp.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesDate = !filters.date || opp.date.includes(filters.date);
    const matchesSkills = filters.skills.length === 0 || 
                         filters.skills.some(skill => opp.skills_required.includes(skill));
    
    return matchesSearch && matchesLocation && matchesDate && matchesSkills;
  });

  if (loading) {
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
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50`}>
          {notification.message}
        </div>
      )}

      <motion.div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-white">Available Opportunities</h1>
          <p className="mt-1 text-sm text-gray-300">
            Find and apply for volunteer opportunities that match your interests
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div className="px-4 sm:px-6 mb-6">
          <div className="bg-gray-800/30 backdrop-blur-md rounded-lg p-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Search</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="bg-gray-700/50 border border-gray-600 text-white rounded-md pl-10 p-2.5 w-full"
                    placeholder="Search opportunities..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="mt-1 bg-gray-700/50 border border-gray-600 text-white rounded-md p-2.5 w-full"
                  placeholder="Filter by location..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="mt-1 bg-gray-700/50 border border-gray-600 text-white rounded-md p-2.5 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Skills</label>
                <select
                  multiple
                  value={filters.skills}
                  onChange={(e) => setFilters({
                    ...filters,
                    skills: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="mt-1 bg-gray-700/50 border border-gray-600 text-white rounded-md p-2.5 w-full"
                >
                  <option value="teaching">Teaching</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="organizing">Organizing</option>
                  <option value="technical">Technical</option>
                  <option value="medical">Medical</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-md rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-lg font-medium text-white mb-2">{opportunity.title}</h3>
              <p className="text-gray-300 mb-4">{opportunity.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  {new Date(opportunity.date).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                  {opportunity.location}
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  {opportunity.volunteers_registered} / {opportunity.volunteers_needed} volunteers
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.skills_required.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApply(opportunity.id)}
                className="mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={opportunity.volunteers_registered >= opportunity.volunteers_needed}
              >
                {opportunity.volunteers_registered >= opportunity.volunteers_needed 
                  ? 'Opportunity Full' 
                  : 'Apply Now'
                }
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VolunteerDashboard;