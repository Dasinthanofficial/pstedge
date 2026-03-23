import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="w-full bg-white min-h-[100dvh] pt-32 pb-24 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            All Projects<span className="text-blue-600">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl"
          >
            A complete archive of our digital projects, designed and developed with precision.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bento-card h-72 md:h-[400px] animate-pulse bg-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {projects.map((item, i) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/projects/${item.slug}`} className="group block cursor-pointer">
                  <div className="bento-card mb-6 h-72 md:h-[400px] overflow-hidden relative border border-gray-200">
                    <img 
                      src={getImageUrl(item.thumbnail)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">{item.category}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed pr-8 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-45 shrink-0">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;