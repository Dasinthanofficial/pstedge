import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    challenge: '',
    solution: '',
    technologies: '',
    liveDemo: '',
    githubLink: '',
    testimonialQuote: '',
    testimonialAuthor: '',
    thumbnail: '',
    file: null
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfig = (isFormData = false) => ({
    headers: {
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Error deleting', error);
        alert('Failed to delete project.');
      }
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        title: project.title,
        slug: project.slug,
        category: project.category,
        description: project.description,
        challenge: project.challenge,
        solution: project.solution,
        technologies: project.technologies?.join(', ') || '',
        liveDemo: project.liveDemo || '',
        githubLink: project.githubLink || '',
        testimonialQuote: project.testimonial?.quote || '',
        testimonialAuthor: project.testimonial?.author || '',
        thumbnail: project.thumbnail,
        file: null
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        category: '',
        description: '',
        challenge: '',
        solution: '',
        technologies: '',
        liveDemo: '',
        githubLink: '',
        testimonialQuote: '',
        testimonialAuthor: '',
        thumbnail: '',
        file: null
      });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!editingId) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, title, slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('slug', formData.slug);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('challenge', formData.challenge);
    payload.append('solution', formData.solution);
    payload.append('technologies', formData.technologies);
    payload.append('liveDemo', formData.liveDemo);
    payload.append('githubLink', formData.githubLink);
    payload.append('testimonialQuote', formData.testimonialQuote);
    payload.append('testimonialAuthor', formData.testimonialAuthor);

    if (formData.file) {
      payload.append('thumbnail', formData.file);
    } else if (formData.thumbnail) {
      payload.append('thumbnail', formData.thumbnail);
    }

    try {
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, payload, getConfig(true));
      } else {
        await api.post('/api/projects', payload, getConfig(true));
      }

      await fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project', error);
      alert(error.response?.data?.message || 'Failed to save project.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold text-white">Manage Portfolio</h1>
        <button onClick={() => openModal()} className="bg-white text-black px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/80 text-gray-400 text-xs md:text-sm uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-5 font-medium">Image</th>
                <th className="px-6 py-5 font-medium">Title</th>
                <th className="px-6 py-5 font-medium">Category</th>
                <th className="px-6 py-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-12 text-gray-500">Loading projects...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-gray-500">No projects found.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-gray-900/40 transition-colors group">
                    <td className="px-6 py-4">
                      {proj.thumbnail ? (
                        <img
                          src={getImageUrl(proj.thumbnail)}
                          alt={proj.title}
                          className="w-16 h-12 object-cover rounded-md border border-gray-800 group-hover:border-gray-600 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-900 rounded-md border border-gray-800 flex items-center justify-center text-gray-600">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white font-medium max-w-[200px] truncate">{proj.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-400"><span className="bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-700">{proj.category}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(proj)} className="text-[#FF956D] hover:text-white transition-colors p-2 hover:bg-[#FF956D]/20 rounded-lg"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(proj._id)} className="text-red-400 hover:text-white transition-colors p-2 hover:bg-red-500/20 rounded-lg"><Trash2 size={18} /></button>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1 bg-gray-900 rounded-full hover:bg-gray-800">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                      <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                      <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                      <input required type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. E-Commerce" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (comma separated)</label>
                      <input required type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. React, Node.js, MongoDB" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Live Demo URL (optional)</label>
                      <input type="text" value={formData.liveDemo} onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL (optional)</label>
                      <input type="text" value={formData.githubLink} onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Thumbnail Image</label>
                      <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700" accept="image/*" />
                      {formData.thumbnail && !formData.file && <p className="text-xs text-gray-500 mt-2">Current: {formData.thumbnail}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Challenge</label>
                    <textarea required rows={2} value={formData.challenge} onChange={(e) => setFormData({ ...formData, challenge: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Solution</label>
                    <textarea required rows={2} value={formData.solution} onChange={(e) => setFormData({ ...formData, solution: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Testimonial Quote (optional)</label>
                    <textarea rows={2} value={formData.testimonialQuote} onChange={(e) => setFormData({ ...formData, testimonialQuote: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Testimonial Author (optional)</label>
                    <input type="text" value={formData.testimonialAuthor} onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. John Doe, CEO" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-900 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white font-medium hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">Save Project</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProjects;