import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Award } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

const HomePage: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [ctaMousePosition, setCtaMousePosition] = useState({ x: 50, y: 50 });

  const addRipple = useCallback((x: number, y: number) => {
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples(prevRipples => [...prevRipples, newRipple]);
    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const header = document.querySelector('.water-effect-header');
      if (header) {
        const rect = header.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    const handleCtaMouseMove = (e: MouseEvent) => {
      const cta = document.querySelector('.cta-section');
      if (cta) {
        const rect = cta.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCtaMousePosition({ x, y });
      }
    };

    const header = document.querySelector('.water-effect-header');
    header?.addEventListener('mousemove', handleMouseMove);
    document.querySelector('.cta-section')?.addEventListener('mousemove', handleCtaMouseMove);
    
    return () => {
      header?.removeEventListener('mousemove', handleMouseMove);
      document.querySelector('.cta-section')?.removeEventListener('mousemove', handleCtaMouseMove);
    };
  }, []);

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

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="mt-10 flex justify-center space-x-4">
          <Link 
            to={userType === 'volunteer' ? '/volunteer-dashboard' : '/organization-dashboard'} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      );
    }

    return (
      <div className="mt-10 flex justify-center space-x-4">
        <Link to="/signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700">
          Sign Up
        </Link>
        <Link to="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
          Log In
        </Link>
      </div>
    );
  };

  const renderCallToAction = () => {
    if (isAuthenticated) {
      return (
        <div 
          className="cta-section relative overflow-hidden rounded-lg"
          style={getGradientStyle(ctaMousePosition.x, ctaMousePosition.y)}
        >
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Welcome back!</span>
              <span className="block text-blue-200">Continue making a difference.</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link 
                  to={userType === 'volunteer' ? '/opportunities' : '/organization/opportunities'} 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  {userType === 'volunteer' ? 'Browse Opportunities' : 'Manage Opportunities'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          <span className="block">Ready to make a difference?</span>
          <span className="block text-blue-600">Join VolunMatch today.</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Get started
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <Link to="/about" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Updated gradient style with exact values from CTA section
  const getGradientStyle = (mouseX: number, mouseY: number) => ({
    background: `
      radial-gradient(
        circle at ${mouseX}% ${mouseY}%, 
        rgb(30, 64, 175) 0%,         /* Exact blue-800 */
        rgba(30, 58, 138, 0.9) 20%,  /* Exact blue-900 */
        rgba(23, 37, 84, 0.8) 40%,   /* Exact blue-950 */
        rgba(15, 23, 42, 0.9) 60%,   /* Exact slate-900 */
        rgb(15, 23, 42) 80%          /* Exact slate-900 */
      ),
      linear-gradient(
        45deg,
        rgb(30, 58, 138) 0%,     /* Exact blue-900 */
        rgb(23, 37, 84) 50%,     /* Exact blue-950 */
        rgb(15, 23, 42) 100%     /* Exact slate-900 */
      )
    `
  });

  // For initial render before mouse movement
  const initialGradientStyle = {
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
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <header 
        className="water-effect-header relative text-white overflow-hidden"
        style={mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y)}
      >
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="water-ripple" />
          </div>
        ))}
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center" style={{ background: mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y).background }}>
          <motion.h1 
            variants={fadeInUp}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            VolunMatch: AI-Powered Volunteer Engagement Hub
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-xl"
          >
            Connect with meaningful volunteer opportunities tailored just for you.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 1, delay: 1 }}
          >
            {renderAuthButtons()}
          </motion.div>
        </div>
      </header>

      <main>
        <motion.div 
          variants={staggerChildren}
          className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8"
        >
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: <Heart className="h-12 w-12 text-blue-600" />,
                title: "AI-Driven Matching",
                description: "Our AI algorithm matches you with the perfect volunteer opportunities based on your skills and interests."
              },
              {
                icon: <Users className="h-12 w-12 text-blue-600" />,
                title: "Community Engagement",
                description: "Connect with like-minded volunteers and organizations to make a real difference in your community."
              },
              {
                icon: <Award className="h-12 w-12 text-blue-600" />,
                title: "Rewards and Recognition",
                description: "Earn points, badges, and climb the leaderboard as you contribute to meaningful causes."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ 
                  duration: 0.8,
                  delay: 1.4 + index * 0.4
                }}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.3 }
                }}
              >
                {feature.icon}
                <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          transition={{ duration: 1, delay: 2.6 }}
          className="relative overflow-hidden"
        >
          {renderCallToAction()}
        </motion.div>
      </main>
    </motion.div>
  )
}

export default HomePage