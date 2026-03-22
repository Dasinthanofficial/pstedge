import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getAdminToken } from '../../utils/auth';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    iconName: 'Layers',
    description: '',
    features: ''
  });

  const token = getAdminToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/api/services');
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/api/services/${id}`, config);
        setServices(services.filter((s) => s._id !== id));
      } catch (error) {
        console.error('Error deleting', error);
        alert('Failed to delete service.');
      }
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        title: service.title,
        iconName: service.iconName,
        description: service.description,
        features: service.features.join(', ')
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', iconName: 'Layers', description: '', features: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split(',').map((f) => f.trim()).filter((f) => f)
    };

    try {
      if (editingId) {
        await axios.put(`/api/services/${editingId}`, payload, config);
      } else {
        await axios.post('/api/services', payload, config);
      }
      fetchServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving service', error);
      alert('Failed to save service.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">Manage Services</h1>
        <button onClick={() => openModal()} className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <Plus size={18} /> New Service
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Icon (lucide-react)</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="3" className="text-center py-10 text-gray-500">Loading services...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-10 text-gray-500">No services found.</td></tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{service.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{service.iconName}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button onClick={() => openModal(service)} className="text-[#FF956D] hover:text-[#FFB396] transition-colors p-2 hover:bg-[#FF956D]/10 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
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
              className="bg-[#111] border border-gray-800 rounded-3xl p-8 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Service Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Icon Name (lucide-react)</label>
                  <input required type="text" value={formData.iconName} onChange={(e) => setFormData({ ...formData, iconName: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. Code2, MonitorSmartphone" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Features (comma separated)</label>
                  <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. Mobile-first, SEO optimization" />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-900">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">Save Service</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminServices;