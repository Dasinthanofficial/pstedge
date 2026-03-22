import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Calendar, User, Phone, Briefcase, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/api/contact');
      const messageList = Array.isArray(res.data) ? res.data : [];
      setMessages(messageList);

      if (messageList.length > 0 && !selectedMessage) {
        setSelectedMessage(messageList[0]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/api/contact/${id}`);
      setMessages((prev) => prev.filter((message) => message._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete message');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Loading messages...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inquiries</h1>
          <p className="text-gray-400">Manage your contact form submissions and leads.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-500 rounded-2xl">No messages found</div>
          ) : messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => setSelectedMessage(msg)}
              className={`glass-card p-5 rounded-2xl cursor-pointer border transition-all ${selectedMessage?._id === msg._id ? 'border-white bg-white/5' : 'border-gray-800 hover:border-gray-600'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white truncate max-w-[150px]">{msg.businessName}</h4>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                  <Calendar size={10} /> {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1 italic">
                <Mail size={12} className="text-[#FF956D]" /> {msg.email}
              </p>
              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span className="bg-gray-900 px-2 py-0.5 rounded-full">{msg.service}</span>
                <ChevronRight size={14} className={selectedMessage?._id === msg._id ? 'text-[#FF956D]' : 'text-gray-600'} />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 rounded-3xl border border-gray-800 h-full"
            >
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-900">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">{selectedMessage.businessName}</h2>
                  <p className="text-gray-400 flex items-center gap-2"><User size={16} /> {selectedMessage.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-3 bg-red-900/20 text-red-500 rounded-xl hover:bg-red-900/40 transition-colors"
                  title="Delete Message"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-[#FF956D]/10 text-[#FF956D] flex items-center justify-center"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Phone</p>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-[#FF956D]/10 text-[#FF956D] flex items-center justify-center"><Briefcase size={18} /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Requested Service</p>
                      <p className="font-medium">{selectedMessage.service}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Project Description</h4>
                <div className="bg-[#050505] p-6 rounded-2xl border border-gray-900 text-gray-300 leading-relaxed min-h-[150px]">
                  {selectedMessage.projectDescription}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-900">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
                >
                  Reply via Email <Mail size={18} />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center text-gray-600 p-20 rounded-3xl border border-dashed border-gray-800">
              <Mail size={48} className="mb-4 text-[#FF956D] opacity-20" />
              <p className="text-center">Select a message from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMessages;