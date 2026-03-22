import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center group py-2 overflow-visible">
          <img
            src="/logo.png"
            alt="PST EDGE"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,149,109,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(255,149,109,0.5)] transition-all duration-500 transform scale-[4] origin-left"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-base tracking-wide transition-colors duration-300 hover:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="ml-4 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-base transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          className={`md:hidden focus:outline-none transition-colors ${isMobileMenuOpen ? 'text-[#FF956D]' : 'text-gray-300 hover:text-[#FF956D]'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 py-4 shadow-2xl">
          <div className="flex flex-col px-6 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block text-lg font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-4 px-6 py-3 rounded-full bg-white text-black font-semibold text-center transition-transform hover:scale-105"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;