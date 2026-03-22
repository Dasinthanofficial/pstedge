import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../../utils/motion';
import { Code, Edit3, MonitorSmartphone, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    { title: 'Innovation', desc: 'Always pushing boundaries to deliver the best.' },
    { title: 'Integrity', desc: 'Honest and transparent communication always.' },
    { title: 'Quality', desc: 'Pixel-perfect delivery for every single project.' },
    { title: 'Growth', desc: 'Helping our clients scale their business globally.' }
  ];

  return (
    <div className="w-full pt-32 pb-16">
      <motion.div 
        variants={staggerContainer(0.1)} 
        initial="hidden" 
        animate="show" 
        className="container mx-auto px-6 md:px-12"
      >
        <motion.div variants={fadeIn('up', 'tween', 0, 0.8)} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            About <span className="logo-text ml-2">PST EDGE</span>
          </h1>
          <p className="text-xl text-gray-400">Where Technology Meets Creativity</p>
        </motion.div>

        {/* Story Section */}
        <section className="mb-24 flex flex-col lg:flex-row gap-12 items-center">
            <motion.div variants={fadeIn('right', 'tween', 0.2, 1)} className="lg:w-1/2">
                <div className="glass-card p-2 rounded-2xl">
                    <div className="w-full h-80 bg-[#121212] rounded-xl flex items-center justify-center border border-gray-800 p-4">
                        <img 
                          src="/logo.png" 
                          alt="PST EDGE Logo" 
                          className="h-64 md:h-72 w-auto object-contain drop-shadow-[0_0_40px_rgba(255,149,109,0.4)] transition-transform duration-500 hover:scale-105" 
                        />
                    </div>
                </div>
            </motion.div>
            <motion.div variants={fadeIn('left', 'tween', 0.4, 1)} className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    PST EDGE is a tech startup focused on building fullstack web applications, clean UI/UX designs, and high-performance websites for clients who want a modern digital presence. We combine technical expertise with creative design thinking.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-white font-bold mb-2">Our Mission</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">To help businesses and startups launch their digital presence with premium web solutions that look stunning and perform flawlessly.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2">Our Vision</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">To grow PST EDGE into a globally trusted name for fullstack development, web design, and UI/UX.</p>
                    </div>
                </div>
            </motion.div>
        </section>

        {/* Values Section */}
        <section className="mb-24 text-center">
            <motion.h2 variants={fadeIn('up', 'tween', 0.2, 0.8)} className="text-3xl font-bold mb-12">Our Core Values</motion.h2>
            <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((v, i) => (
                    <motion.div key={i} variants={fadeIn('up', 'tween', i * 0.1, 0.8)} className="glass-card p-8 rounded-2xl flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center mb-6">
                            <span className="text-xl font-bold text-white">{i + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                        <p className="text-sm text-gray-500">{v.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>

         {/* CTA */}
         <motion.div variants={fadeIn('up', 'tween', 0.4, 1)} className="text-center p-12 glass rounded-3xl border border-gray-800">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to work with us?</h2>
             <Link to="/contact" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all inline-block hover:scale-105">
                 Contact Us
             </Link>
         </motion.div>

      </motion.div>
    </div>
  );
};

export default About;
