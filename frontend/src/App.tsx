import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import VolunteerSignupPage from './pages/VolunteerSignupPage';
import OrganizationSignupPage from './pages/OrganizationSignupPage';
import LoginPage from './pages/LoginPage';
import VolunteerLoginPage from './pages/VolunteerLoginPage';
import OrganizationLoginPage from './pages/OrganizationLoginPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import { getData } from './api'; // Import your API function

const App: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData()
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <header className="flex justify-between p-4 bg-blue-500 text-white">
            {/* Custom login and logout buttons or any other auth component */}
          </header>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup/volunteer" element={<VolunteerSignupPage />} />
              <Route path="/signup/organization" element={<OrganizationSignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/volunteer" element={<VolunteerLoginPage />} />
              <Route path="/login/organization" element={<OrganizationLoginPage />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
              <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
            </Routes>
          </main>
          {/* Example section to display API data */}
          <section className="p-4">
            <h2>Data from API</h2>
            {data ? (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
              <p>Loading data...</p>
            )}
          </section>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
