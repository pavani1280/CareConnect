import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, ShieldCheck, MapPin, User, LogOut, ChevronDown, Sparkles, Menu, X, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Hyderabad, Telangana');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkNavPage = location.pathname === '/' || location.pathname === '/landing';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkNavPage
          ? 'bg-[#07221e] text-white border-b border-emerald-950/40 py-3.5'
          : scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-3 text-slate-900'
          : 'bg-white py-4 border-b border-slate-100 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: CareConnect Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#00a86b] flex items-center justify-center text-white shadow-md shadow-[#00a86b]/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-2xl font-black tracking-tight ${isDarkNavPage ? 'text-white' : 'text-slate-900'}`}>
                CareConnect
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00a86b]"></span>
            </div>
          </Link>

          {/* Location Badge Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-100">
            <MapPin className="w-3.5 h-3.5 text-[#00a86b]" />
            <span>📍 {selectedCity}</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className={`hidden lg:flex items-center gap-8 text-xs font-extrabold uppercase tracking-wider ${
          isDarkNavPage ? 'text-slate-200' : 'text-slate-700'
        }`}>
          <a href="#services" className="hover:text-[#00a86b] transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-[#00a86b] transition-colors">How It Works</a>
          <Link to="/become-provider" className="hover:text-[#00a86b] transition-colors">For Providers</Link>
          <a href="#about" className="hover:text-[#00a86b] transition-colors">Safety</a>
          <Link to="/customer/support" className="hover:text-[#00a86b] transition-colors">Help</Link>
        </nav>

        {/* Right: User / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative flex items-center gap-3">
              <Link
                to={
                  user.role === 'CUSTOMER'
                    ? '/customer/dashboard'
                    : user.role === 'PROVIDER'
                    ? '/provider/dashboard'
                    : user.role === 'OPERATIONS_MANAGER'
                    ? '/ops/dashboard'
                    : user.role === 'SUPPORT_AGENT'
                    ? '/support/dashboard'
                    : '/admin/dashboard'
                }
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00a86b] hover:bg-[#00915c] text-white font-extrabold text-xs shadow-md transition-all"
              >
                <span>Dashboard</span>
              </Link>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-colors ${
                  isDarkNavPage ? 'border-emerald-800/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#00a86b] text-white flex items-center justify-center font-extrabold text-xs">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'CC'}
                </div>
                <span className="text-xs font-extrabold hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 text-xs text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-extrabold truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role ? user.role.replace('_', ' ') : 'User'}</p>
                  </div>
                  <Link
                    to={
                      user.role === 'CUSTOMER'
                        ? '/customer/dashboard'
                        : user.role === 'PROVIDER'
                        ? '/provider/dashboard'
                        : user.role === 'OPERATIONS_MANAGER'
                        ? '/ops/dashboard'
                        : user.role === 'SUPPORT_AGENT'
                        ? '/support/dashboard'
                        : '/admin/dashboard'
                    }
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 font-bold"
                  >
                    Go to Portal Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`px-4 py-2 text-xs font-extrabold transition-colors ${
                  isDarkNavPage ? 'text-white hover:text-emerald-300' : 'text-slate-700 hover:text-[#00a86b]'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-[#00a86b] hover:bg-[#00915c] text-white font-extrabold text-xs shadow-md shadow-[#00a86b]/20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border ${
              isDarkNavPage ? 'border-emerald-800 text-white' : 'border-slate-200 text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07221e] border-b border-emerald-900/60 px-4 pt-4 pb-6 space-y-3 text-white shadow-2xl">
          <div className="flex items-center gap-2 p-2.5 bg-emerald-950/60 rounded-xl text-xs font-bold text-emerald-200">
            <MapPin className="w-4 h-4 text-[#00a86b]" />
            <span>Location: Hyderabad, Telangana</span>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-bold">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/40">Services</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/40">How It Works</a>
            <Link to="/become-provider" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/40">For Providers</Link>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/40">Safety</a>
            <Link to="/customer/support" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/40">Help</Link>
          </nav>

          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-900/60">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl border border-emerald-700 text-center font-bold text-xs hover:bg-emerald-900/40"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl bg-[#00a86b] text-center font-bold text-white text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
