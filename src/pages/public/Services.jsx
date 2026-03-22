import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../../utils/motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import api from '../../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/api/services');
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="w-full pt-32 pb-16">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 md:px-12"
      >
        <motion.div variants={fadeIn('up', 'tween', 0, 0.8)} className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Our <span className="text-white">Services</span>
          </h1>
          <p className="text-xl text-gray-400">Fullstack Web Development, Design & UI/UX Solutions</p>
        </motion.div>

        <section className="mb-24 relative z-10">
          <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20 text-gray-500">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">No services available at the moment.</div>
            ) : (
              services.map((service, idx) => {
                const IconComponent = Icons[service.iconName] || Icons.Layers;

                return (
                  <motion.div
                    key={service._id}
                    variants={fadeIn('up', 'spring', idx * 0.1, 1)}
                    className="glass-card p-8 md:p-10 rounded-3xl group relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 font-bold text-8xl pointer-events-none transition-transform group-hover:scale-110">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>

                    <IconComponent size={40} className="mb-6 icon-accent transition-colors" />

                    <h3 className="text-2xl font-bold mb-4 z-10 relative">{service.title}</h3>

                    <p className="text-gray-400 leading-relaxed mb-6 flex-grow z-10 relative">
                      {service.description}
                    </p>

                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <ul className="space-y-2 z-10 relative border-t border-gray-800 pt-6 mt-auto">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </section>

        <section className="mb-24 py-16 text-center border-y border-gray-900 bg-[#080808]">
          <motion.h2 variants={fadeIn('up', 'tween', 0.2, 0.8)} className="text-3xl font-bold mb-16">
            Our Process
          </motion.h2>

          <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {['Discovery', 'Strategy', 'Design', 'Development', 'Testing', 'Launch'].map((step, i) => (
              <motion.div key={i} variants={fadeIn('right', 'spring', i * 0.1, 1)} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full glass border border-gray-700 flex items-center justify-center font-bold text-xl mb-4 relative">
                  {i + 1}
                  {i !== 5 && (
                    <div className="hidden lg:block absolute left-full top-1/2 w-full h-[1px] bg-gray-800 -z-10"></div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-300">{step}</h4>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.div variants={fadeIn('up', 'tween', 0.4, 1)} className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          <Link
            to="/contact"
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all inline-block hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Get a Free Quote
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;