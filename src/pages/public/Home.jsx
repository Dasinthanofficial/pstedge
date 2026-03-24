import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Star,
  ChevronDown,
  Zap,
  MapPin,
  ArrowUpRight,
  Mail,
  Github,
  Linkedin,
  X
} from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const BlueUnderline = () => (
  <svg
    className="absolute -bottom-1 md:-bottom-4 left-0 w-full h-3 md:h-5 text-blue-500 overflow-visible"
    viewBox="0 0 400 20"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M2,15 Q100,5 200,10 T400,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
    />
  </svg>
);

const AntigravityCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    let animationFrameId;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX - window.innerWidth / 2;
      targetMouseY = e.clientY - window.innerHeight / 2;
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E44AD', '#F43F5E', '#FF8A65'];

    const particles = Array.from({ length: 450 }, () => ({
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      z: Math.random() * 2000,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 1.5 + 0.5,
      length: Math.random() * 12 + 4,
      thickness: Math.random() * 2.5 + 1.5,
    }));

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 - mouseX * 0.6;
      const centerY = height / 2 - mouseY * 0.6;

      particles.forEach((p) => {
        p.z -= p.speed;

        if (p.z <= 0) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 3000;
          p.y = (Math.random() - 0.5) * 3000;
        }

        const fov = 350;
        const scale = fov / (fov + p.z);
        const x2d = p.x * scale + centerX;
        const y2d = p.y * scale + centerY;

        const angle = Math.atan2(y2d - centerY, x2d - centerX);

        ctx.save();
        ctx.translate(x2d, y2d);
        ctx.rotate(angle);
        ctx.fillStyle = p.color;

        let alpha = Math.min(1, (2000 - p.z) / 800);
        if (p.z < 150) alpha = p.z / 150;
        ctx.globalAlpha = alpha;

        const currentLength = Math.max(2, p.length * scale * 1.5);
        const currentThick = Math.max(1, p.thickness * scale * 1.5);

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(
            -currentLength / 2,
            -currentThick / 2,
            currentLength,
            currentThick,
            currentThick / 2
          );
        } else {
          ctx.rect(
            -currentLength / 2,
            -currentThick / 2,
            currentLength,
            currentThick
          );
        }
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full py-5 md:py-7 flex justify-between items-center text-left focus:outline-none group"
      >
        <span
          className={`font-semibold text-base sm:text-lg md:text-xl transition-colors duration-300 pr-4 ${
            isOpen ? 'text-gray-900' : 'text-gray-800 group-hover:text-blue-600'
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`flex-shrink-0 transition-colors duration-300 ${
            isOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
          }`}
        >
          <ChevronDown size={22} strokeWidth={2.5} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 md:pb-8 text-gray-500 text-sm sm:text-base md:text-[17px] leading-relaxed pr-4 md:pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ContactFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    service: '',
    projectDescription: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await api.post('/api/contact', formData);

      setStatus({ loading: false, success: true, error: '' });
      setFormData({
        businessName: '',
        email: '',
        phone: '',
        service: '',
        projectDescription: ''
      });

      setTimeout(() => {
        setStatus({ loading: false, success: false, error: '' });
        onClose();
      }, 3000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black transition-colors bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          aria-label="Close contact form"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold mb-2 pr-8">Start a Project</h2>
        <p className="text-gray-500 mb-6 text-sm md:text-base">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>

        {status.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center font-medium my-8"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            Message sent successfully! We'll be in touch soon.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Business or Your Name"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />

              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700"
            >
              <option value="">Select a Service...</option>
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Landing Pages">Landing Pages</option>
              <option value="Maintenance & Support">Maintenance & Support</option>
            </select>

            <textarea
              required
              rows="4"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Tell us about your project or goals..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm md:text-base resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            {status.error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {status.error}
              </p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status.loading}
              className="w-full bg-black text-white font-bold rounded-xl py-4 hover:bg-gray-800 disabled:opacity-70 transition-colors shadow-lg shadow-black/10 mt-2"
            >
              {status.loading ? 'Sending Request...' : 'Submit Inquiry'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/api/testimonials');
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching testimonials', error);
        setTestimonials([]);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];
  const rating = current.rating || 5;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-gray-100">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 text-center mb-8 md:mb-14">
          What Clients Say
        </h2>

        <div className="relative w-full overflow-hidden bg-white border border-gray-200 rounded-2xl md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 md:p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-1 mb-4 md:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill={star <= rating ? '#FACC15' : 'none'}
                    color="#FACC15"
                  />
                ))}
              </div>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-8 md:mb-10 max-w-2xl">
                "{current.quote}"
              </p>

              <hr className="w-full border-gray-100 mb-6 md:mb-8" />

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm sm:text-lg shrink-0 border border-gray-200">
                  {current.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left min-w-0 max-w-full px-2">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{current.name}</h4>
                  <p className="text-gray-500 text-xs md:text-sm truncate mt-0.5">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8 md:mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-blue-600 w-6 sm:w-8' : 'bg-gray-200 hover:bg-gray-300 w-2'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(0);
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const isContactOpen = new URLSearchParams(location.search).get('contact') === 'open';

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError('');

      try {
        const { data } = await api.get('/api/projects');

        if (Array.isArray(data)) {
          setTotalProjects(data.length);
          setProjects(data.slice(0, 4));
        } else {
          setTotalProjects(0);
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setTotalProjects(0);
        setProjectsError('Failed to load projects.');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openContactModal = () => {
    navigate('/?contact=open');
  };

  const closeContactModal = () => {
    navigate('/', { replace: true });
  };

  const faqs = [
    {
      q: 'Why choose our agency?',
      a: 'We are dedicated to building fast, scalable, and beautiful websites tailored to your exact business needs. We treat your project like our own, focusing on quality and conversion.'
    },
    {
      q: 'How long does a project take?',
      a: 'Most standard websites take between 2 to 4 weeks from discovery to launch. More complex web applications or e-commerce platforms may take 6 to 8 weeks depending on features.'
    },
    {
      q: 'What is your tech stack?',
      a: 'We specialize in modern architectures: React, Next.js, Node.js, and headless CMS solutions. This ensures your website is blazing fast, highly secure, and easily scalable.'
    },
    {
      q: 'Do you handle SEO?',
      a: 'Yes, technical SEO, semantic HTML, and metadata optimization are baked into our development process from day one. We ensure your site is perfectly readable by search engines.'
    },
    {
      q: 'Do you offer ongoing maintenance?',
      a: 'Absolutely. We offer tailored monthly maintenance packages to keep your website updated, secure, and running smoothly so you can focus on your business.'
    },
    {
      q: 'What do I need to provide to get started?',
      a: "We'll need your branding assets (logo, colors), any existing copy or text you want to use, and a general idea of the websites or styles you admire. We'll guide you through the rest!"
    }
  ];

  const servicesList = [
    { num: '01', title: 'Web Development', desc: 'Custom, blazing-fast websites tailored to your needs.' },
    { num: '02', title: 'UI/UX Design', desc: 'Beautifully crafted interfaces that prioritize user experience.' },
    { num: '03', title: 'Responsive Design', desc: 'Pixel-perfect designs across all devices and screen sizes.' },
    { num: '04', title: 'Website Redesign', desc: 'Modernize your outdated platform for better conversions.' },
    { num: '05', title: 'Landing Pages', desc: 'High-converting pages designed to capture leads instantly.' },
    { num: '06', title: 'Maintenance & Support', desc: 'Ongoing technical support to keep your site running smoothly.' }
  ];

  const techStack = [
    { name: 'MongoDB', src: 'https://api.iconify.design/logos:mongodb-icon.svg' },
    { name: 'Express', src: 'https://api.iconify.design/skill-icons:expressjs-dark.svg' },
    { name: 'React', src: 'https://api.iconify.design/logos:react.svg' },
    { name: 'Node.js', src: 'https://api.iconify.design/logos:nodejs-icon.svg' },
    { name: 'Tailwind', src: 'https://api.iconify.design/logos:tailwindcss-icon.svg' },
    { name: 'Vercel', src: 'https://api.iconify.design/logos:vercel-icon.svg' },
    { name: 'AWS', src: 'https://api.iconify.design/logos:aws.svg' },
    { name: 'GitHub', src: 'https://api.iconify.design/logos:github-icon.svg' },
    { name: 'Figma', src: 'https://api.iconify.design/logos:figma.svg' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="w-full bg-white selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
      <AnimatePresence>
        {isContactOpen && <ContactFormModal isOpen={isContactOpen} onClose={closeContactModal} />}
      </AnimatePresence>

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden min-h-[90vh] md:min-h-fit justify-center">
        <AntigravityCanvas />

        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.5)_40%,rgba(255,255,255,0)_70%)] md:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_50%)]"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur-md text-gray-600 text-xs md:text-sm font-semibold shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Premium Web Design & Development
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-gray-900 leading-[1.1] text-balance mb-4 md:mb-6 text-center drop-shadow-sm px-2"
          >
            We develop websites focused on <br className="hidden md:block" />
            <span className="relative inline-block mt-1 md:mt-2">
              growing your business.
              <BlueUnderline />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium text-center leading-relaxed drop-shadow-sm px-4"
          >
            Stop losing customers to a slow or outdated website. We design fast, modern, and user-friendly experiences that help your brand stand out and grow.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full px-6 sm:w-auto">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openContactModal}
              className="relative group w-full sm:w-auto px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2.5 text-white overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
              style={{
                background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.15)'
              }}
            >
              <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[20px]">
                <motion.div
                  animate={{ x: [-30, 30, -30], y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute top-[-20%] left-[10%] w-[80%] h-[140%] bg-white/20 rounded-full"
                />
              </div>

              <Star
                size={18}
                className="relative z-10 text-white transition-transform duration-500 group-hover:rotate-[144deg]"
                fill="currentColor"
                strokeWidth={1.5}
              />
              <span className="relative z-10 tracking-wide text-white">Book a Strategy Call</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              View Our Work
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 md:mt-20 pt-8 md:pt-10 relative w-full overflow-hidden">
            <div className="absolute left-0 top-10 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-10 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-marquee gap-10 md:gap-20 px-4 items-center pt-2 pb-6">
              {[...techStack, ...techStack].map((tech, i) => (
                <div key={i} className="flex flex-col items-center justify-center group cursor-pointer relative">
                  <img
                    src={tech.src}
                    alt={tech.name}
                    loading="lazy"
                    className="h-6 md:h-8 w-auto max-w-[90px] object-contain filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125"
                  />
                  <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest transition-opacity duration-300 whitespace-nowrap">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">Projects.</h2>
            <p className="text-gray-500 text-base md:text-lg md:ml-4 pb-1">
              Selected work from local businesses to international brands.
            </p>
          </div>

          {totalProjects > 4 && (
            <Link to="/projects" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View all projects <ArrowRight size={18} />
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projectsLoading ? (
            <p className="text-gray-500 col-span-1 md:col-span-2 text-center py-10">Loading projects...</p>
          ) : projectsError ? (
            <p className="text-red-500 col-span-1 md:col-span-2 text-center py-10">{projectsError}</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500 col-span-1 md:col-span-2 text-center py-10">No projects available yet.</p>
          ) : (
            projects.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="block"
              >
                <Link to={`/projects/${item.slug}`} className="group block cursor-pointer">
                  <div className="bento-card mb-4 md:mb-6 h-60 sm:h-72 md:h-[400px] overflow-hidden relative border border-gray-200 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                    <img
                      src={getImageUrl(item.thumbnail)}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>

                  <div className="flex justify-between items-start px-1 md:px-0">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed pr-4 md:pr-8 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-45 shrink-0">
                      <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {totalProjects > 4 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 md:mt-10 md:hidden flex justify-center">
            <Link to="/projects" className="w-full inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
              View all projects <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </section>

      <section id="services" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">Services.</h2>
          <p className="text-gray-500 text-base md:text-lg md:ml-4 pb-1">Comprehensive digital solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {servicesList.map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="bento-card p-6 md:p-10 relative overflow-hidden group bg-white border border-gray-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-default"
            >
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative z-10 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <span className="text-4xl md:text-6xl font-black text-gray-200 group-hover:text-blue-500 transition-colors duration-500">
                    {srv.num}
                  </span>
                  <div className="w-6 md:w-8 h-[3px] bg-gray-100 group-hover:bg-blue-500 group-hover:w-16 transition-all duration-500 ease-out rounded-full"></div>
                </div>

                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {srv.title}
                </h3>

                <p className="text-gray-500 leading-relaxed text-sm md:text-base mt-auto">{srv.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">About.</h2>
          <p className="text-gray-500 text-base md:text-lg md:ml-4 pb-1">The mind behind the agency.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="bento-card relative h-[350px] md:h-[500px] overflow-hidden group border border-gray-200"
          >
            <img
              src="/profile.jpeg"
              alt="Founder"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-black/40 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-gray-300">
                  Founder & Developer
                </span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold">Dasinthan Pathmanathan</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">One mind, clear vision.</h3>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              I’m Dasinthan — the one and only person behind PST EDGE. No big teams, no endless meetings, and no wasted time.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              As a young developer with a fresh and practical mindset, I focus on getting things done efficiently, without overcomplicating the process. I handle every part of the work myself to make sure the quality stays high and the results are delivered quickly.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-10">
              I don’t believe in spending hundreds of hours on something simple. I believe in smart work, clear solutions, and real results.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
              <motion.div whileHover={{ y: -5 }} className="bento-card p-4 md:p-6 bg-white border border-gray-200 shadow-sm cursor-default">
                <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">100%</h4>
                <p className="text-gray-500 text-xs md:text-sm">Satisfied Clients</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bento-card p-4 md:p-6 bg-white border border-gray-200 shadow-sm cursor-default">
                <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">March 23, 2026</h4>
                <p className="text-gray-500 text-xs md:text-sm">Agency Founded</p>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Web Development', 'UI/UX Design', 'SEO Optimization'].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 tracking-wider uppercase bg-white cursor-default transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <TestimonialSlider />

      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 md:mb-10 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">FAQ.</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="bg-white rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                index={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFAQ === i}
                onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="pt-8 pb-4 md:py-12 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] py-12 px-6 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-black/20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]"
          ></motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]"
          ></motion.div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">Ready for your project?</h2>
            <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
              Let&apos;s create something extraordinary together. We look forward to hearing from you.
            </p>
            <div className="flex justify-center items-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openContactModal}
                className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Book a Call →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-2 sm:px-4 md:px-6 pb-6 mt-4 md:mt-10 max-w-7xl mx-auto">
        <div className="bg-[#050505] rounded-t-[2rem] rounded-b-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-16 lg:p-20 text-white relative overflow-hidden flex flex-col justify-between md:min-h-[550px] border border-gray-900 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 relative z-10 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-800 bg-gray-900/50 text-gray-300 text-xs md:text-sm font-medium mb-6 md:mb-8 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Let&apos;s build something great
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight leading-[1.1]">
                  Ready to start <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    your project?
                  </span>
                </h2>

                <p className="text-gray-400 text-base md:text-xl mb-8 md:mb-10 max-w-lg font-light">
                  Send us a message and we&apos;ll get back to you within 24 hours to discuss your digital transformation.
                </p>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openContactModal}
                    className="shrink-0 whitespace-nowrap bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold flex items-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    <Zap size={18} fill="currentColor" /> Start a Project
                  </motion.button>

                  <a
                    href="mailto:dasinthanpathmanathan984@gmail.com"
                    className="font-bold text-white flex items-center gap-2 hover:text-blue-400 transition-colors break-all text-sm md:text-base"
                  >
                    dasinthanpathmanathan984@gmail.com <ArrowUpRight size={18} className="shrink-0" />
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full mt-4 md:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: 0.2, type: 'spring', damping: 20 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden group cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1 text-white">
                    PST EDGE<span className="text-blue-500">.</span>
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm font-medium mb-6 md:mb-8">
                    Premium Web & Software Agency
                  </p>

                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-blue-400 shrink-0">
                        <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
                          Based In
                        </p>
                        <p className="font-medium text-xs md:text-sm">Sri Lanka</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors w-full">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-blue-400 shrink-0">
                        <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          Direct Contact
                        </p>
                        <a
                          href="mailto:dasinthanpathmanathan984@gmail.com"
                          title="dasinthanpathmanathan984@gmail.com"
                          className="font-medium text-xs md:text-sm hover:text-blue-400 transition-colors block truncate w-full"
                        >
                          dasinthanpathmanathan984@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-blue-500"></span>
                    </span>
                    Accepting New Clients
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 md:mt-24 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10"
          >
            <div className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Agency Logo"
                className="h-10 md:h-16 lg:h-20 w-auto object-contain filter brightness-0 invert opacity-100 origin-left transform transition-transform hover:scale-105"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-x-8 text-xs md:text-sm text-gray-400 font-medium">
              <a href="#projects" className="hover:text-white transition-colors">Projects</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-gray-600 text-xs md:text-sm hidden md:block">
                © {new Date().getFullYear()} PST EDGE. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-gray-500">
                <a href="#" className="hover:text-white transition-colors hover:-translate-y-1 transform duration-200">
                  <Github size={18} className="md:w-[20px] md:h-[20px]" />
                </a>
                <a href="#" className="hover:text-white transition-colors hover:-translate-y-1 transform duration-200">
                  <Linkedin size={18} className="md:w-[20px] md:h-[20px]" />
                </a>
              </div>
            </div>
          </motion.div>

          <p className="text-gray-600 text-xs text-center mt-6 md:hidden relative z-10">
            © {new Date().getFullYear()} PST EDGE. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;