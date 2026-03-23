import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, LogOut, Menu, X, Mail, MessageSquare } from 'lucide-react'; // <-- ADDED MessageSquare
import api from '../utils/api';
import { getAdminInfo, setAdminInfo, clearAdminAuth } from '../utils/auth';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        setAdminInfo(data);
        setIsAuthenticated(true);
      } catch (error) {
        clearAdminAuth();
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAdminAuth();
      navigate('/admin/login', { replace: true });
    }
  };

  const adminInfo = getAdminInfo();

  // <-- ADDED Testimonials to the links array
  const links = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/projects', name: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/admin/testimonials', name: 'Reviews', icon: <MessageSquare size={20} /> },
    { path: '/admin/messages', name: 'Inquiries', icon: <Mail size={20} /> },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-black text-gray-200 flex flex-col md:flex-row font-sans">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#080808] border-b border-gray-900 sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold tracking-wider text-white">
          Agency<span className="text-blue-500">.</span> Admin
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-gray-300 p-2">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`fixed md:sticky top-0 left-0 h-[100dvh] w-64 bg-[#080808] border-r border-gray-900 flex flex-col pt-6 z-40 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 mb-10 hidden md:block">
          <Link to="/" className="text-2xl font-bold tracking-wider text-white">
            Agency<span className="text-blue-500">.</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Admin Panel</p>
          {adminInfo?.email && <p className="text-xs text-gray-600 mt-3 break-all">{adminInfo.email}</p>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-16 md:mt-0">
          {links.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return (
              <Link key={link.path} to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}>
                {link.icon} {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-900">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>}

      <main className="flex-1 bg-black p-4 md:p-10 min-h-[100dvh] relative overflow-x-hidden">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;