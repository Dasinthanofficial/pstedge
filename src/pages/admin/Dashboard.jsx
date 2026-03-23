import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    contacts: 0,
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
    { title: 'Portfolio Projects', value: counts.projects, icon: <Briefcase size={24} />, trend: 'Live' },
    { title: 'Client Inquiries', value: counts.contacts, icon: <Mail size={24} />, trend: 'Live' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-3xl">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
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
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/projects" className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">New Project</span>
                <span className="text-xs text-gray-500">Add a new item to your portfolio</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  Your portfolio currently showcases <span className="font-semibold">{loading ? '...' : counts.projects}</span> projects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm text-white">
                  You have received <span className="font-semibold">{loading ? '...' : counts.contacts}</span> total inquiries from the contact form.
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