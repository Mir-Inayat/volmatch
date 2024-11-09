import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { register, RegisterData } from '../api';
import { useSpotlight } from '../hooks/useSpotlight';

const VolunteerSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    location: '',
    skills: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { mousePosition, getGradientStyle, initialGradientStyle } = useSpotlight();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const interestsSelect = document.getElementById('interests') as HTMLSelectElement;
      const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
      const bioElement = document.getElementById('bio') as HTMLTextAreaElement;
      const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;

      const selectedInterests = Array.from(interestsSelect.selectedOptions).map(option => option.value);
      const selectedAvailability = Array.from(availabilitySelect.selectedOptions).map(option => option.value);

      const registrationData: RegisterData = {
        username: formData.email,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        location: formData.location,
        skills: formData.skills,
        bio: bioElement.value,
        interests: selectedInterests,
        availability: selectedAvailability,
        experience: experienceElement.value,
        profile_image: profileImage || undefined
      };

      const response = await register(registrationData);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        navigate('/profile');
      } else {
        setError('Registration failed. No authentication token received.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google signup logic
    console.log('Google signup clicked');
  };

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] relative overflow-hidden"
      style={mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y)}
    >
      <div 
        className="absolute inset-0 bg-white/10 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <div className="max-w-2xl mx-auto">
        <div>
          <Link to="/signup" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to signup options
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Volunteer Sign Up
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your volunteer account and start making a difference
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
            Sign up with Google
          </button>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.01]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skills *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    required
                    onChange={handleSkillsChange}
                    placeholder="e.g., First Aid, Teaching, Project Management (comma-separated)"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="profile-photo"
                    className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <span>Upload photo</span>
                    <input
                      id="profile-photo"
                      name="profile-photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">Optional. PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Volunteering Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Volunteering Details</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Areas of Interest *
                  </label>
                  <select
                    id="interests"
                    multiple
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                    size={5}
                  >
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="animal-welfare">Animal Welfare</option>
                    <option value="community">Community Service</option>
                    <option value="elderly-care">Elderly Care</option>
                    <option value="youth-mentoring">Youth Mentoring</option>
                    <option value="disaster-relief">Disaster Relief</option>
                    <option value="arts-culture">Arts & Culture</option>
                    <option value="sports-recreation">Sports & Recreation</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Availability *
                  </label>
                  <select
                    id="availability"
                    multiple
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                    size={4}
                  >
                    <option value="weekday-morning">Weekday Mornings</option>
                    <option value="weekday-afternoon">Weekday Afternoons</option>
                    <option value="weekday-evening">Weekday Evenings</option>
                    <option value="weekend-morning">Weekend Mornings</option>
                    <option value="weekend-afternoon">Weekend Afternoons</option>
                    <option value="weekend-evening">Weekend Evenings</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short Bio *
                  </label>
                  <textarea
                    id="bio"
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                    placeholder="Tell us about yourself and why you want to volunteer..."
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Past Volunteer Experience
                  </label>
                  <textarea
                    id="experience"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                    placeholder="Describe your previous volunteer experiences..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out hover:shadow-lg"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VolunteerSignupPage