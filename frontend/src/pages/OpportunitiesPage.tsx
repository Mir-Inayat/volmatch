import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, slideInFromRight } from '../components/animations/AnimationConfig';
import { useSpotlight } from '../hooks/useSpotlight';

const OpportunitiesPage: React.FC = () => {
  const { mousePosition, getGradientStyle, initialGradientStyle } = useSpotlight();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={mousePosition.x === 50 ? initialGradientStyle : getGradientStyle(mousePosition.x, mousePosition.y)}
    >
      <motion.div 
        variants={staggerContainer}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <motion.div 
          variants={fadeInUp}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold">Volunteer Opportunities</h1>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Map through opportunities */}
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              variants={slideInFromRight}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              {/* Opportunity card content */}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 