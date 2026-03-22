import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail, Download, Calendar } from 'lucide-react';
import api from '../../utils/api';

const escapeCSV = (value) => {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
};

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/api/subscribers');
      setSubscribers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;

    try {
      await api.delete(`/api/subscribers/${id}`);
      setSubscribers((prev) => prev.filter((subscriber) => subscriber._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete subscriber');
    }
  };

  const exportToCSV = () => {
    const header = 'Email,Joined Date\n';
    const rows = subscribers
      .map((subscriber) =>
        [
          escapeCSV(subscriber.email),
          escapeCSV(new Date(subscriber.createdAt).toLocaleDateString())
        ].join(',')
      )
      .join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pst_edge_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Loading subscribers...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-400">You have {subscribers.length} active subscribers.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
        >
          Export CSV <Download size={18} />
        </button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0a] border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">#</th>
                <th className="px-8 py-5">Email Address</th>
                <th className="px-8 py-5">Joined At</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-500">No subscribers found yet.</td>
                </tr>
              ) : subscribers.map((sub, i) => (
                <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 text-gray-500 font-mono text-sm">{i + 1}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF956D]/10 flex items-center justify-center text-[#FF956D]">
                        <Mail size={14} />
                      </div>
                      <span className="text-white font-medium">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={14} /> {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="p-2 text-red-500 hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSubscribers;