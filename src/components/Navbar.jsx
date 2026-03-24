import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const timer = setTimeout(() => {
        const section = document.querySelector(location.hash);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: 'Home', hash: '' },
    { name: 'Projects', hash: '#projects' },
    { name: 'Services', hash: '#services' },
    { name: 'About', hash: '#about' },
    { name: 'FAQ', hash: '#faq' },
  ];

  const handleNavClick = (hash = '') => {
    setIsMobileMenuOpen(false);

    if (!hash) {
      if (location.pathname === '/') {
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (location.pathname === '/') {
      const section = document.querySelector(hash);

      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', hash);
      } else {
        navigate(`/${hash}`);
      }
    } else {
      navigate(`/${hash}`);
    }
  };

  const handleBookCall = () => {
    setIsMobileMenuOpen(false);
    navigate('/?contact=open');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0 py-2" aria-label="Go to homepage">
          <img
            src="/logo.png"
            alt="Agency Logo"
            className="h-10 md:h-12 w-auto object-contain transform scale-[2] md:scale-[3.5] origin-left transition-transform"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 bg-gray-50/80 backdrop-blur-md px-8 py-3 rounded-full border border-gray-200/50 shadow-sm">
          {navLinks.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleNavClick(link.hash)}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={handleBookCall}
            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Book a Call
          </button>
        </div>

        <button
          type="button"
          className="md:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleNavClick(link.hash)}
              className="text-left text-lg font-medium text-gray-600 hover:text-black"
            >
              {link.name}
            </button>
          ))}

          <button
            type="button"
            onClick={handleBookCall}
            className="bg-black text-white px-5 py-3 rounded-full text-sm font-semibold w-full mt-4"
          >
            Book a Call
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;