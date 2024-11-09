import React from 'react';
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
import CommunityPage from './pages/CommunityPage';
import OrganizationProfilePage from './pages/OrganizationProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import LearnMorePage from './pages/LearnMorePage';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';

const App: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar />
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
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/organization/profile" element={<OrganizationProfilePage />} />
                    <Route path="/about" element={<LearnMorePage />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </PageTransition>
    </AnimatePresence>
  );
};

export default App;
