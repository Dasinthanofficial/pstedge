import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const initialFormData = {
  name: '',
  role: '',
  quote: '',
  rating: 5
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/api/testimonials');
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const openModal = (test = null) => {
    if (test) {
      setEditingId(test._id);
      setFormData({
        name: test.name || '',
        role: test.role || '',
        quote: test.quote || '',
        rating: test.rating || 5
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;

    try {
      await api.delete(`/api/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert(error.response?.data?.message || 'Failed to delete.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating)
      };

      if (editingId) {
        await api.put(`/api/testimonials/${editingId}`, payload);
      } else {
        await api.post('/api/testimonials', payload);
      }

      await fetchTestimonials();
      closeModal();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      alert(error.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Client Reviews</h1>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto justify-center bg-white text-black px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={18} /> New Review
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[720px]">
            <thead className="bg-gray-900/80 text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Client</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Rating</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Quote Preview</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-sm">
                    Loading...
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-sm text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-900/40 transition-colors group">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-bold text-white text-sm sm:text-base truncate max-w-[150px]">{t.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px] mt-0.5">{t.role}</p>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            color="#FACC15"
                            fill={star <= (t.rating || 5) ? '#FACC15' : 'none'}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-400">
                      <p className="line-clamp-2 max-w-[200px] sm:max-w-xs leading-relaxed">"{t.quote}"</p>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(t)}
                          className="text-[#FF956D] p-2 hover:bg-[#FF956D]/20 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-red-400 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              className="bg-[#111] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {editingId ? 'Edit Review' : 'Add Review'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-1 bg-gray-900 rounded-full hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Client Name</label>
                  <input
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Role / Company</label>
                  <input
                    required
                    placeholder="e.g. Construction Owner"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Client Quote</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Their review..."
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Rating</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: value })}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          formData.rating === value
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                            : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {value} <Star size={14} fill="currentColor" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-900 mt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminTestimonials;