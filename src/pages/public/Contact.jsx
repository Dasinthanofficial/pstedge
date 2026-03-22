import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import api from '../../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    service: '',
    projectDescription: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const payload = {
      businessName: formData.businessName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formData.service.trim(),
      projectDescription: formData.projectDescription.trim()
    };

    try {
      await api.post('/api/contact', payload);
      setStatus({ type: 'success', message: 'Message sent successfully. We will get back to you soon!' });
      setFormData({ businessName: '', email: '', phone: '', service: '', projectDescription: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-32 pb-16 min-h-[100dvh] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-[100dvh] bg-gradient-to-b from-gray-900/40 to-black -z-10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4"></div>

      <div className="container mx-auto px-6 md:px-12">
        <motion.div variants={fadeIn('up', 'tween', 0, 0.8)} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Get In <span className="text-white">Touch</span></h1>
          <p className="text-xl text-gray-400">Let&apos;s Build Something Amazing Together</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <motion.div variants={fadeIn('right', 'tween', 0.2, 0.8)} initial="hidden" animate="show" className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Have a project in mind? Whether you need a new website, a redesign, or a fullstack web application — our team is ready to help.
              </p>
            </div>

            <div className="space-y-6 text-gray-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center flex-shrink-0 icon-accent"><Mail /></div>
                <div><h4 className="font-bold text-white">Email</h4><p>hello@pstedge.com</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center flex-shrink-0 icon-accent"><Phone /></div>
                <div><h4 className="font-bold text-white">Phone / WhatsApp</h4><p>+XX XXXX XXXXX</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center flex-shrink-0 icon-accent"><MapPin /></div>
                <div><h4 className="font-bold text-white">Location</h4><p>Tech Hub City, Country</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center flex-shrink-0 icon-accent"><Clock /></div>
                <div><h4 className="font-bold text-white">Business Hours</h4><p>Mon - Sat, 9AM - 7PM</p></div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800">
              <h4 className="font-bold text-xl mb-4">Frequently Asked Questions</h4>
              <div className="space-y-4">
                <div className="glass-card p-4 rounded-xl">
                  <h5 className="font-semibold text-white mb-2 text-sm">How quickly can you start?</h5>
                  <p className="text-xs text-gray-500">Usually within 24–48 hours after project approval.</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <h5 className="font-semibold text-white mb-2 text-sm">Do you offer revisions?</h5>
                  <p className="text-xs text-gray-500">Yes, we iterate until you are completely satisfied with the result.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn('left', 'tween', 0.4, 0.8)} initial="hidden" animate="show">
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-3xl border border-gray-800 space-y-6 relative overflow-hidden">
              {status.message && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${status.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                  {status.message}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Your Name / Business Name *</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Service Interested In *</label>
                <select name="service" value={formData.service} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                  <option value="" disabled>Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Project Description *</label>
                <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} required rows={5} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold text-lg rounded-xl py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span> : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;