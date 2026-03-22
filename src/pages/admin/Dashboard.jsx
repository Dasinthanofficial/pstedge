import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Briefcase, Layers, Mail, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    blogs: 0,
    projects: 0,
    services: 0,
    contacts: 0,
    subscribers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setCounts(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Blog Posts', value: counts.blogs, icon: <FileText size={24} />, trend: 'Live' },
    { title: 'Portfolio Projects', value: counts.projects, icon: <Briefcase size={24} />, trend: 'Live' },
    { title: 'Services', value: counts.services, icon: <Layers size={24} />, trend: 'Live' },
    { title: 'Inquiries', value: counts.contacts, icon: <Mail size={24} />, trend: 'Live' },
    { title: 'Subscribers', value: counts.subscribers, icon: <Users size={24} />, trend: 'Live' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#FF956D] bg-[#FF956D]/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} /> {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/blogs" className="glass p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#FF956D] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium text-gray-300">New Blog Post</span>
            </Link>

            <Link to="/admin/projects" className="glass p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#FF956D] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium text-gray-300">New Project</span>
            </Link>

            <Link to="/admin/services" className="glass p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#FF956D] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium text-gray-300">Manage Services</span>
            </Link>

            <Link to="/admin/stats" className="glass p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#FF956D] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium text-gray-300">Manage Stats</span>
            </Link>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#FF956D] mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  You currently have <span className="font-semibold">{loading ? '...' : counts.blogs}</span> blog posts published.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#FF956D] mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  Your portfolio contains <span className="font-semibold">{loading ? '...' : counts.projects}</span> projects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#FF956D] mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  You have received <span className="font-semibold">{loading ? '...' : counts.contacts}</span> inquiries and <span className="font-semibold">{loading ? '...' : counts.subscribers}</span> newsletter subscribers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#FF956D] mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  There are <span className="font-semibold">{loading ? '...' : counts.services}</span> services currently listed on the site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;