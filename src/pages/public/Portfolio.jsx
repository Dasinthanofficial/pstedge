import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../utils/motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching projects', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = useMemo(() => {
    const dynamicFilters = [...new Set(projects.map((project) => project.category).filter(Boolean))];
    return ['All', ...dynamicFilters];
  }, [projects]);

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((project) => project.category === filter);

  return (
    <div className="w-full pt-32 pb-16 min-h-[100dvh]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          variants={fadeIn('up', 'tween', 0, 0.8)}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Our <span className="text-white">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-400">Projects That Speak for Themselves</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === item
                  ? 'bg-white text-black'
                  : 'border border-gray-700 text-gray-400 hover:text-white hover:border-gray-400'
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF956D]"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex justify-center h-64 text-gray-500">
            No projects available for this category.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  key={project._id}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-gray-800"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block">
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                      <img
                        src={getImageUrl(project.thumbnail)}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out mix-blend-luminosity hover:mix-blend-normal"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-gray-700">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies?.map((tech) => (
                          <span key={tech} className="text-xs text-gray-500">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <span className="text-sm font-bold flex items-center gap-2 hover:text-white transition-colors">
                        View Details <span className="text-xl leading-none">→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center bg-[#0a0a0a] border border-gray-800 p-12 rounded-3xl"
        >
          <h2 className="text-3xl font-bold mb-6">Like what you see?</h2>
          <Link
            to="/contact"
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all inline-block hover:scale-105"
          >
            Start Your Project
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;