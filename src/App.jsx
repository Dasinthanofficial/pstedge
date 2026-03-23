import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Projects from './pages/public/Projects'; // Renamed
import ProjectDetail from './pages/public/ProjectDetail';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminMessages from './pages/admin/AdminMessages';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-white min-h-screen text-gray-900 flex flex-col font-sans">
        
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;