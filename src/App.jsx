import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminTestimonials from './pages/admin/AdminTestimonials'; // <-- NEW IMPORT
import AdminMessages from './pages/admin/AdminMessages';

// Cleaner layout wrapper for public pages (keeps Navbar from re-rendering)
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-white min-h-screen text-gray-900 flex flex-col font-sans">
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes with Navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<Home />} /> {/* Catch-all */}
            </Route>

            {/* Admin Routes (No Navbar) */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="testimonials" element={<AdminTestimonials />} /> {/* <-- NEW ROUTE */}
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;