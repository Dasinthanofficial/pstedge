import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getAdminToken } from '../../utils/auth';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${import.meta.env.VITE_API_URL || ''}${imagePath}`;
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    featuredImage: '',
    file: null
  });

  const token = getAdminToken();

  const getConfig = (isFormData = false) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
    },
    withCredentials: true
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/blogs/${id}`, getConfig());
        setBlogs(blogs.filter((b) => b._id !== id));
      } catch (error) {
        console.error('Error deleting', error);
        alert('Failed to delete blog post.');
      }
    }
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingId(blog._id);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        excerpt: blog.excerpt,
        content: blog.content,
        readTime: blog.readTime || '5 min read',
        featuredImage: blog.featuredImage,
        file: null
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        content: '',
        readTime: '5 min read',
        featuredImage: '',
        file: null
      });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!editingId) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
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
    payload.append('excerpt', formData.excerpt);
    payload.append('content', formData.content);
    payload.append('readTime', formData.readTime);

    if (formData.file) {
      payload.append('featuredImage', formData.file);
    } else if (formData.featuredImage) {
      payload.append('featuredImage', formData.featuredImage);
    }

    try {
      if (editingId) {
        await axios.put(`/api/blogs/${editingId}`, payload, getConfig(true));
      } else {
        await axios.post('/api/blogs', payload, getConfig(true));
      }

      await fetchBlogs();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving blog', error);
      alert(error.response?.data?.message || 'Failed to save blog post.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold text-white">Manage Blog Posts</h1>
        <button onClick={() => openModal()} className="bg-white text-black px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
          <Plus size={18} /> New Post
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
                <tr><td colSpan="4" className="text-center py-12 text-gray-500">Loading blogs...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-gray-500">No blog posts found.</td></tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-900/40 transition-colors group">
                    <td className="px-6 py-4">
                      {blog.featuredImage ? (
                        <img
                          src={getImageUrl(blog.featuredImage)}
                          alt={blog.title}
                          className="w-16 h-12 object-cover rounded-md border border-gray-800 group-hover:border-gray-600 transition-colors"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-900 rounded-md border border-gray-800 flex items-center justify-center text-gray-600">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white font-medium max-w-[200px] truncate">{blog.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <span className="bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-700">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(blog)} className="text-[#FF956D] hover:text-white transition-colors p-2 hover:bg-[#FF956D]/20 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="text-red-400 hover:text-white transition-colors p-2 hover:bg-red-500/20 rounded-lg">
                          <Trash2 size={18} />
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
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
                      <input required type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. Web Development" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                      <input required type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Featured Image</label>
                      <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700" accept="image/*" />
                      {formData.featuredImage && !formData.file && <p className="text-xs text-gray-500 mt-2">Current: {formData.featuredImage}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                      <textarea required rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                  <textarea required rows={8} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-y font-mono text-sm"></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-900">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white font-medium hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Save Blog Post
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

export default AdminBlogs;