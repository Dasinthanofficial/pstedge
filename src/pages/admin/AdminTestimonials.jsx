import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', role: '', quote: '', rating: 5 });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/api/testimonials');
      setTestimonials(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await api.delete(`/api/testimonials/${id}`);
        fetchTestimonials();
      } catch (error) { alert('Failed to delete.'); }
    }
  };

  const openModal = (test = null) => {
    if (test) {
      setEditingId(test._id);
      setFormData({ name: test.name, role: test.role, quote: test.quote, rating: test.rating });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', quote: '', rating: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/api/testimonials/${editingId}`, formData);
      else await api.post('/api/testimonials', formData);
      fetchTestimonials();
      setIsModalOpen(false);
    } catch (error) { alert('Failed to save.'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HEADER: Flex-col on mobile, flex-row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Client Reviews</h1>
        <button onClick={() => openModal()} className="w-full sm:w-auto justify-center bg-white text-black px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <Plus size={18} /> New Review
        </button>
      </div>

      {/* TABLE WRAPPER: overflow-x-auto allows swiping left/right on iPhone XS */}
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-900/80 text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Client</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Quote Preview</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {loading ? (
                <tr><td colSpan="3" className="p-6 text-center text-sm">Loading...</td></tr>
              ) : testimonials.length === 0 ? (
                <tr><td colSpan="3" className="p-6 text-center text-sm text-gray-500">No reviews found.</td></tr>
              ) : testimonials.map((t) => (
                <tr key={t._id} className="hover:bg-gray-900/40 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-bold text-white text-sm sm:text-base truncate max-w-[150px]">{t.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px] mt-0.5">{t.role}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-400">
                    <p className="line-clamp-2 max-w-[200px] sm:max-w-xs leading-relaxed">"{t.quote}"</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(t)} className="text-[#FF956D] p-2 hover:bg-[#FF956D]/20 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-400 p-2 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Padding reduced on mobile, max-height ensures it fits on small screens */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{editingId ? 'Edit Review' : 'Add Review'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Client Name</label>
                <input required placeholder="e.g. Suresh Kumar" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Role / Company</label>
                <input required placeholder="e.g. Construction Owner" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Client Quote</label>
                <textarea required rows="4" placeholder="Their review..." value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none custom-scrollbar" />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-900 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default AdminTestimonials;