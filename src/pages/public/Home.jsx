import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeIn, zoomIn } from '../../utils/motion';
import { ArrowRight, Code, Monitor, Layers, ShieldCheck, CheckCircle2, Rocket } from 'lucide-react';
import * as Icons from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [servicesRes, projectsRes, statsRes] = await Promise.all([
          api.get('/api/services'),
          api.get('/api/projects'),
          api.get('/api/stats')
        ]);

        if (Array.isArray(servicesRes.data)) {
          setServices(servicesRes.data.slice(0, 6));
        }

        if (Array.isArray(projectsRes.data)) {
          setProjects(projectsRes.data.slice(0, 3));
        }

        if (Array.isArray(statsRes.data)) {
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Error fetching home data', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black pt-28 md:pt-32 pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.35, 0.2],
              x: [0, 40, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-12%] w-[42rem] h-[42rem] md:w-[52rem] md:h-[52rem] bg-[#FF956D] rounded-full blur-[130px]"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.18, 0.08],
              x: [0, -30, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[-20%] right-[-10%] w-[36rem] h-[36rem] md:w-[48rem] md:h-[48rem] bg-[#FFB396] rounded-full blur-[150px]"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,149,109,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black" />
        </div>

        <motion.div
          variants={staggerContainer(0.18, 0.2)}
          initial="hidden"
          animate="show"
          className="container mx-auto px-6 md:px-12 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <motion.div
              variants={fadeIn('down', 'tween', 0.05, 0.8)}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF956D] shadow-[0_0_14px_rgba(255,149,109,0.9)]"></span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/90 font-semibold">
                Elevating Digital Standards
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn('up', 'spring', 0.2, 1.2)}
              className="max-w-4xl text-[2.9rem] leading-[0.95] sm:text-[4.2rem] md:text-[5.5rem] lg:text-[6.3rem] font-black tracking-[-0.04em] text-white"
            >
              We Build Digital
              <span className="block text-gradient">Experiences</span>
              <span className="block">That Drive Results</span>
            </motion.h1>

            <motion.p
              variants={fadeIn('up', 'tween', 0.38, 0.9)}
              className="mt-8 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-300"
            >
              <span className="font-extrabold text-white tracking-wide">PST EDGE</span> is a tech startup specializing in fullstack web development, modern web design, and premium UI/UX experiences that help brands grow with confidence.
            </motion.p>

            <motion.div
              variants={fadeIn('up', 'tween', 0.55, 0.9)}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
            >
              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-gray-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
              >
                Our Services
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-white backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-white/25 hover:bg-white/[0.08]"
              >
                View Portfolio
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn('up', 'tween', 0.72, 0.8)}
              className="mt-8 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.22em] text-gray-500"
            >
              Modern Design • Fast Development • Scalable Solutions
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.22em] whitespace-nowrap">
            Scroll to explore
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-500 to-transparent animate-pulse"></div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 border-y border-gray-900 bg-black/50 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center"
          >
            {(stats.length > 0
              ? stats
              : [
                { label: 'Projects Delivered', value: '1+' },
                { label: 'Happy Clients', value: '1+' },
                { label: 'Technologies Mastered', value: '10+' },
                { label: 'Lines of Code', value: '50K+' }
              ]
            ).map((stat, i) => (
              <motion.div key={i} variants={zoomIn(0.1 * i, 0.8)}>
                <h4 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h4>
                <p className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn('right', 'tween', 0.2, 1)}
              className="lg:w-1/2"
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Who We Are</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">Innovators at Heart.</h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                PST EDGE is a tech startup delivering fullstack web applications, clean UI/UX designs, and high-performance websites. We combine technical expertise with creative design thinking to help businesses launch and grow their digital presence.
              </p>
              <ul className="grid grid-cols-2 gap-4 mb-8">
                {['MERN Stack Experts', 'Pixel-Perfect Design', 'Clean Code Quality', 'Fast Turnaround'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 size={18} className="icon-accent" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-block px-6 py-3 border border-gray-700 rounded-full hover:bg-white hover:text-black transition-colors font-medium"
              >
                Learn More About Us
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn('left', 'tween', 0.4, 1)}
              className="lg:w-1/2 relative perspective-1000"
            >
              <div className="glass-card p-2 rounded-2xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out shadow-2xl">
                <div className="w-full h-80 bg-gradient-to-tr from-gray-900 to-black rounded-xl overflow-hidden flex items-center justify-center relative border border-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Rocket size={120} className="text-gray-400 rotate-12" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn('right', 'tween', 0.2, 1)}
              className="lg:w-1/3"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="text-white">PST EDGE</span>?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                We don't just build websites — we create complete digital solutions that elevate your brand and deliver real results.
              </p>
              <div className="p-8 glass rounded-3xl border-l-4 border-white/20">
                <p className="italic text-gray-300">"Incredible attention to detail and a truly modern design vision. Highly recommended!"</p>
                <p className="mt-4 font-bold text-white">— Happy Client</p>
              </div>
            </motion.div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'MERN Stack', desc: 'Building fullstack apps with MongoDB, Express, React, and Node.js for maximum performance.', icon: <Code /> },
                { title: 'Stunning UI/UX', desc: 'Pixel-perfect interfaces designed with Figma for seamless user journeys.', icon: <Monitor /> },
                { title: 'Scalable Architecture', desc: 'We build systems designed to grow with your business, from idea to launch.', icon: <Layers /> },
                { title: 'End-to-End Delivery', desc: 'From design to deployment on Vercel & Render — we handle the full pipeline.', icon: <ShieldCheck /> }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeIn('up', 'spring', i * 0.1, 1)}
                  className="glass-card p-8 rounded-2xl border border-gray-800/50"
                >
                  <div className="w-12 h-12 rounded-full glass border border-gray-700 flex items-center justify-center mb-6 icon-accent">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 'tween', 0.1, 1)}
          >
            <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-2">What We Do</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-16">Comprehensive Services</h3>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            {services.length === 0 ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-8 rounded-2xl h-48 animate-pulse bg-white/5"></div>
              ))
            ) : (
              services.map((service, i) => {
                const IconComponent = Icons[service.iconName] || Icons.Layers;
                return (
                  <motion.div
                    key={service._id}
                    variants={fadeIn('up', 'tween', 0.1 * i, 0.8)}
                    className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group cursor-pointer"
                  >
                    <IconComponent size={32} className="mb-6 icon-accent" />
                    <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 'tween', 0.6, 1)}
            className="mt-16"
          >
            <Link
              to="/services"
              className="px-8 py-4 glass text-white rounded-full font-bold hover:bg-white hover:text-black transition-all"
            >
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn('right', 'tween', 0.2, 1)}
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Portfolio</h2>
              <h3 className="text-3xl md:text-5xl font-bold">Featured Projects</h3>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn('left', 'tween', 0.4, 1)}
            >
              <Link to="/portfolio" className="text-white font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                See all work <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-3xl h-80 animate-pulse bg-white/5"></div>
              ))
            ) : (
              projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeIn('up', 'spring', i * 0.2, 1)}
                  className="glass-card rounded-3xl overflow-hidden group border border-gray-800"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block">
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={getImageUrl(project.thumbnail)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-luminosity hover:mix-blend-normal"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs uppercase tracking-widest text-gray-300">{project.category}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] text-gray-500 border border-gray-800 px-2 py-0.5 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black z-0"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="glass-card max-w-4xl mx-auto p-12 md:p-20 rounded-3xl border border-gray-800"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Launch Your Digital Presence?</h2>
            <p className="text-xl text-gray-400 mb-10">Let's build something amazing together.</p>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 inline-block text-lg"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;