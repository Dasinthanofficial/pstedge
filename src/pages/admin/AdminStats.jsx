import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getAdminToken } from '../../utils/auth';

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    order: 0
  });

  const token = getAdminToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/stats');
      setStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      try {
        await axios.delete(`/api/stats/${id}`, config);
        setStats(stats.filter((s) => s._id !== id));
      } catch (error) {
        console.error('Error deleting', error);
        alert('Failed to delete stat.');
      }
    }
  };

  const openModal = (stat = null) => {
    if (stat) {
      setEditingId(stat._id);
      setFormData({
        label: stat.label,
        value: stat.value,
        order: stat.order
      });
    } else {
      setEditingId(null);
      setFormData({ label: '', value: '', order: stats.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/stats/${editingId}`, formData, config);
      } else {
        await axios.post('/api/stats', formData, config);
      }
      fetchStats();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving stat', error);
      alert('Failed to save stat.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FF956D]/20 rounded-2xl text-[#FF956D]">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Marketing Stats</h1>
            <p className="text-gray-500 text-sm">Manage the impact numbers shown on your home page</p>
          </div>
        </div>
        <button onClick={() => openModal()} className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <Plus size={18} /> New Stat
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium uppercase tracking-widest">Label</th>
                <th className="px-6 py-4 font-medium uppercase tracking-widest">Value (e.g. 150+)</th>
                <th className="px-6 py-4 font-medium uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 font-medium text-right uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Loading stats...</td></tr>
              ) : stats.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-500">No stats found. Click "New Stat" to add one.</td></tr>
              ) : (
                stats.map((stat) => (
                  <tr key={stat._id} className="hover:bg-gray-900/30 transition-colors group">
                    <td className="px-6 py-4 text-white font-medium">{stat.label}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#FF956D]/10 text-[#FF956D] rounded-full text-sm font-bold border border-[#FF956D]/20">
                        {stat.value}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{stat.order}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(stat)} className="text-[#FF956D] hover:text-[#FFB396] transition-colors p-2 hover:bg-[#FF956D]/10 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(stat._id)} className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#111] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(37,99,235,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Stat' : 'New Stat'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">Stat Label</label>
                  <input required type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF956D] transition-colors" placeholder="e.g. Completed Projects" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">Display Value</label>
                  <input required type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF956D] transition-colors" placeholder="e.g. 150+ or 1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">Display Order</label>
                  <input required type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF956D] transition-colors" />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-900">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-[#FF956D] text-white font-bold hover:bg-[#FFB396] transition-colors shadow-lg shadow-[#FF956D]/20">Save Stat</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStats;