import React, { useState, useEffect } from 'react';
import { getOrganizationProfile, updateOrganizationProfile } from '../api';

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

const OrganizationProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({});

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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add form fields for editing */}
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
              {/* Add more form fields */}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization Details</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.name}</dd>
                  </div>
                  {/* Add more profile details */}
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Opportunities</h3>
                <ul className="mt-4 space-y-4">
                  {profile.opportunities.map(opportunity => (
                    <li key={opportunity.id} className="flex justify-between items-center">
                      <span>{opportunity.title}</span>
                      <span>{opportunity.volunteers_needed} needed, {opportunity.volunteers_registered} registered</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationProfilePage; 