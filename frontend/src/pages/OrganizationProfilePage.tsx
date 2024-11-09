import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrganizationProfile, updateOrganizationProfile, createOpportunity } from '../api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import OpportunityModal from '../components/OpportunityModal';
import OpportunityDetailsModal from '../components/OpportunityDetailsModal';

interface OrganizationProfile {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  name: string;
  description: string;
  location: string;
  website: string;
  phone: string;
  opportunities: {
    id: number;
    title: string;
    date: string;
    volunteers_needed: number;
    volunteers_registered: number;
  }[];
}

interface OpportunityFormData {
  title: string;
  date: string;
  volunteers_needed: number;
  description: string;
  location: string;
  duration: string;
  skills_required: string[];
}

const OrganizationProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getOrganizationProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrganizationProfile(formData);
      await loadProfile();
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

  const handleAddOpportunity = async (formData: OpportunityFormData) => {
    try {
      const newOpportunity = await createOpportunity(formData);
      await loadProfile();
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
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

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          variants={fadeInUp}
          className="bg-gray-50 dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.01] hover:bg-white dark:hover:bg-gray-700"
        >
          <motion.div 
            variants={fadeInUp}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ease-in-out hover:shadow-lg"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </motion.div>

          {isEditing ? (
            <motion.form 
              variants={staggerChildren}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
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
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>

              <motion.div 
                variants={fadeInUp}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ease-in-out hover:shadow-lg"
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div 
              variants={staggerChildren}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization Details</h3>
                  <motion.dl 
                    variants={staggerChildren}
                    className="mt-4 space-y-4"
                  >
                    {[
                      { label: "Name", value: profile.name },
                      { label: "Contact Person", value: `${profile.user.first_name} ${profile.user.last_name}` },
                      { label: "Email", value: profile.user.email },
                      { label: "Location", value: profile.location },
                      { label: "Website", value: profile.website },
                      { label: "Phone", value: profile.phone }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        variants={fadeInUp}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                      >
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.value || 'Not provided'}</dd>
                      </motion.div>
                    ))}
                  </motion.dl>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                  <motion.p 
                    variants={fadeInUp}
                    transition={{ delay: 0.8 }}
                    className="mt-4 text-sm text-gray-900 dark:text-white"
                  >
                    {profile.description || 'No description provided'}
                  </motion.p>

                  <motion.h3 
                    variants={fadeInUp}
                    transition={{ delay: 1 }}
                    className="text-lg font-medium text-gray-900 dark:text-white mt-8"
                  >
                    <div className="flex justify-between items-center">
                      <span>Opportunities</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Opportunity
                      </motion.button>
                    </div>
                  </motion.h3>

                  {profile.opportunities && profile.opportunities.length > 0 ? (
                    <motion.div 
                      variants={staggerChildren}
                      className="mt-4 max-h-[400px] overflow-y-auto pr-2"
                    >
                      <ul className="space-y-4">
                        {profile.opportunities.map((opportunity, index) => (
                          <motion.li
                            key={opportunity.id}
                            variants={fadeInUp}
                            transition={{ delay: 1.2 + (index * 0.1) }}
                            whileHover={{ scale: 1.02 }}
                            className="text-sm p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 ease-in-out hover:shadow-lg"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900 dark:text-white">{opportunity.title}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-500 dark:text-gray-400">
                                  {opportunity.volunteers_registered}/{opportunity.volunteers_needed} volunteers
                                </span>
                                <button
                                  onClick={() => {
                                    setSelectedOpportunity(opportunity);
                                    setIsDetailsModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 mt-1">
                              Date: {new Date(opportunity.date).toLocaleDateString()}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={fadeInUp}
                      transition={{ delay: 1.2 }}
                      className="mt-4 text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        No opportunities posted yet
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create Your First Opportunity
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <OpportunityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOpportunity}
        />
        {selectedOpportunity && (
          <OpportunityDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            opportunity={selectedOpportunity}
          />
        )}
      </div>
    </motion.div>
  );
};

export default OrganizationProfilePage; 