// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/public/Home';
// import About from './pages/public/About';
// import Services from './pages/public/Services';
// import Portfolio from './pages/public/Portfolio';
// import Blog from './pages/public/Blog';
// import Contact from './pages/public/Contact';
// import BlogDetail from './pages/public/BlogDetail';
// import ProjectDetail from './pages/public/ProjectDetail';

// // Admin Pages
// import Login from './pages/admin/Login';
// import AdminLayout from './components/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';
// import AdminBlogs from './pages/admin/AdminBlogs';
// import AdminProjects from './pages/admin/AdminProjects';
// import AdminServices from './pages/admin/AdminServices';
// import AdminMessages from './pages/admin/AdminMessages';
// import AdminSubscribers from './pages/admin/AdminSubscribers';
// import AdminStats from './pages/admin/AdminStats';
// import ScrollToTop from './components/ScrollToTop';

// const PublicLayout = ({ children }) => (
//   <div className="bg-black min-h-screen text-gray-200 flex flex-col font-sans">
//     <Navbar />
//     <main className="flex-grow">
//       {children}
//     </main>
//     <Footer />
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
//         <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
//         <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
//         <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
//         <Route path="/portfolio/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
//         <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
//         <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
//         <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

//         <Route path="/admin/login" element={<Login />} />

//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="services" element={<AdminServices />} />
//           <Route path="blogs" element={<AdminBlogs />} />
//           <Route path="projects" element={<AdminProjects />} />
//           <Route path="messages" element={<AdminMessages />} />
//           <Route path="subscribers" element={<AdminSubscribers />} />
//           <Route path="stats" element={<AdminStats />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Portfolio from './pages/public/Portfolio';
import Blog from './pages/public/Blog';
import Contact from './pages/public/Contact';
import BlogDetail from './pages/public/BlogDetail';
import ProjectDetail from './pages/public/ProjectDetail';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminStats from './pages/admin/AdminStats';
import ScrollToTop from './components/ScrollToTop';

const PublicLayout = ({ children }) => {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="bg-black min-h-screen text-gray-200 flex flex-col font-sans">
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="max-w-lg w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Website Notice</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Our website is currently under maintenance. Some features or content may be temporarily unavailable while we improve your experience.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              Continue to Website
            </button>
          </div>
        </div>
      )}

      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/portfolio/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="stats" element={<AdminStats />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;