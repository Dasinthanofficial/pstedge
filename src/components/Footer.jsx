import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] border-t border-gray-900 pt-20 pb-10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center group mb-8">
                            <img 
                                src="/logo.png" 
                                alt="PST EDGE" 
                                className="h-28 md:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.45)] transition-all duration-500 transform scale-125 origin-left" 
                            />
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            A tech startup crafting premium fullstack web solutions, modern web design, and UI/UX experiences that help businesses grow.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Services</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/services" className="hover:text-white transition-colors">Web Development</Link></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">UI/UX Design</Link></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">Website Redesign</Link></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">Landing Pages</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                        <ul className="space-y-4 text-sm text-gray-500 mb-6">
                            <li className="flex items-center gap-3"><Mail size={14} className="text-[#FF956D]" /> hello@pstedge.com</li>
                            <li className="flex items-center gap-3"><Phone size={14} className="text-[#FF956D]" /> +XX XXXX XXXXX</li>
                            <li className="flex items-center gap-3"><MapPin size={14} className="text-[#FF956D]" /> City, Country</li>
                        </ul>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Linkedin size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Github size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Twitter size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-[0.2em] pt-8 border-t border-gray-900">
                    <p>&copy; {new Date().getFullYear()} PST EDGE. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
