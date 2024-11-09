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
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profile.user.first_name} {profile.user.last_name}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.user.email}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.location}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                          {profile.website}
                        </a>
                      ) : 'Not provided'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.phone || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                <p className="mt-4 text-sm text-gray-900 dark:text-white">{profile.description || 'No description provided'}</p>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-8">Opportunities</h3>
                {profile.opportunities && profile.opportunities.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {profile.opportunities.map(opportunity => (
                      <li key={opportunity.id} className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{opportunity.title}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {opportunity.volunteers_registered}/{opportunity.volunteers_needed} volunteers
                          </span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">Date: {new Date(opportunity.date).toLocaleDateString()}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No opportunities posted yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationProfilePage; 