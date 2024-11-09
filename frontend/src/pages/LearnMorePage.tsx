import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Star, Clock, Users, Award, CheckCircle, HelpCircle } from 'lucide-react';

const LearnMorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Introduction Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">About VolunMatch</h1>
          <p className="text-xl mb-4">
            VolunMatch is a community-driven platform dedicated to connecting passionate individuals 
            with volunteer opportunities that make a real impact.
          </p>
          <p className="text-lg">
            Whether you're looking to help in your neighborhood or support causes globally, 
            we bring those opportunities to you.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-blue-600" />}
              title="AI-Powered Matching"
              description="Find opportunities that perfectly match your skills and interests"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Verified Organizations"
              description="All organizations are vetted to ensure safe and meaningful experiences"
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-blue-600" />}
              title="Skills Development"
              description="Gain practical experience while making a difference"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-blue-600" />}
              title="Recognition System"
              description="Earn badges and track your volunteer journey"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Create Profile"
              description="Set up your profile with skills and interests"
            />
            <StepCard
              number="2"
              title="Explore"
              description="Browse and filter opportunities that match your preferences"
            />
            <StepCard
              number="3"
              title="Connect"
              description="Apply and coordinate with organizations"
            />
            <StepCard
              number="4"
              title="Track Progress"
              description="Log hours and earn recognition for your impact"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <FAQItem
              question="Is there a cost to use VolunMatch?"
              answer="No, VolunMatch is completely free for volunteers. We believe in making volunteering accessible to everyone."
            />
            <FAQItem
              question="How do I track my volunteer hours?"
              answer="Our platform includes a built-in hour tracking system. Simply log your hours after each volunteer session, and we'll maintain your volunteer history."
            />
            <FAQItem
              question="Can I volunteer virtually?"
              answer="Yes! We offer both in-person and virtual volunteering opportunities to accommodate different preferences and situations."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Make a Difference?</h2>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
    <h3 className="text-xl font-semibold mb-2 flex items-center">
      <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
      {question}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{answer}</p>
  </div>
);

export default LearnMorePage; 