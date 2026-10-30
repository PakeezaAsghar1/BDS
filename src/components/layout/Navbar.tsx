import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Menu,
  X,
  HeartHandshake,
  Search,
  Activity,
  Calendar,
  Users,
  BookOpen,
  HelpCircle,
  Phone,
  Shield,
  UserCheck,
  CheckCircle,
  FileSearch,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigate,
    currentRole,
    currentUser,
    switchUserRole,
    stats,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'find-donor', label: 'Find Donor' },
    { id: 'become-donor', label: 'Donate' },
    { id: 'campaigns', label: 'Events' },
    { id: 'team', label: 'Team' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'guide', label: 'Guide' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    navigate(pageId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header
      style={{ position: 'sticky', top: 0, zIndex: 50 }}
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-md ${
        isScrolled
          ? 'shadow-md border-b border-slate-200/90 py-2.5'
          : 'shadow-xs border-b border-slate-200/70 py-3 sm:py-3.5'
      }`}
      id="main-navigation-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C] rounded-lg"
          id="navbar-brand-logo"
        >
          <div className="w-11 h-11 rounded-full p-0.5 bg-white border border-slate-200/80 shadow-md shadow-red-950/10 group-hover:scale-105 transition-transform shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={bdsLogoImg}
              alt="Blood Donor Society UET Narowal Official Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-['Sancreek','Rye',serif] text-2xl sm:text-[26px] text-slate-900 leading-none inline-flex items-center select-none"
                style={{ fontFamily: "'Sancreek', 'Rye', serif", letterSpacing: '0.06em' }}
              >
                {/* Left ornate Victorian curl flourish matching reference image initial swash */}
                <svg
                  className="w-4 h-3.5 text-slate-900 -mr-0.5 mt-1 shrink-0"
                  viewBox="0 0 20 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M 19 14 C 13 14, 6 16, 3 11 C 1 7, 3 2.5, 7 2.5 C 10.5 2.5, 11.5 6, 9 8.5 C 7 10.5, 4.5 9, 4 7" />
                </svg>
                BDS
                {/* Right ornate Victorian curl flourish matching reference image terminal swash */}
                <svg
                  className="w-5 h-3.5 text-slate-900 -ml-0.5 mt-1 shrink-0"
                  viewBox="0 0 24 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M 1 12 C 7 15, 14 15, 18 10 C 21 6.5, 18.5 2, 14.5 2 C 11 2, 10 5.5, 12.5 8 C 15 10, 18 8.5, 18 6.5" />
                </svg>
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.22em] uppercase mt-0.5">UET.Narowl</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-[#B4232C] bg-red-50 font-bold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Utility & CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Public Visitor View: Login & Register buttons (shown for guests or on home page) */}
          {currentRole === 'guest' || currentPage === 'home' ? (
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => navigate('login')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100/90 hover:bg-slate-200 hover:text-slate-950 border border-slate-200/90 transition-all shadow-2xs active:scale-95 cursor-pointer"
                id="navbar-login-btn"
                title="Log in to your account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#B4232C]" />
                <span>Login</span>
              </button>

              <button
                onClick={() => navigate('register')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#B4232C] bg-red-50 hover:bg-red-100 hover:text-[#8F1D25] border border-red-200/90 transition-all shadow-2xs active:scale-95 cursor-pointer"
                id="navbar-register-btn"
                title="Register as Donor, Team, or Member"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#B4232C]" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            /* Authenticated View: Console access & User profile session */
            <div className="flex items-center gap-2">
              {currentRole === 'coordinator' ? (
                <button
                  onClick={() => handleNavClick('team-dashboard')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-900 text-white hover:bg-blue-800 transition-colors shadow-sm"
                  id="nav-team-dashboard-btn"
                >
                  <Users className="w-3.5 h-3.5 text-blue-300" />
                  <span>Team Portal</span>
                </button>
              ) : currentRole === 'donor' ? (
                <button
                  onClick={() => handleNavClick('donor-dashboard')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#B4232C] text-white hover:bg-[#8F1D25] transition-colors shadow-sm"
                  id="nav-donor-dashboard-btn"
                >
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                  <span>Donor Portal</span>
                </button>
              ) : null}


            </div>
          )}

          {/* Primary Action Button: Need Blood? */}
          <button
            onClick={() => handleNavClick('request-blood')}
            className="inline-flex items-center justify-center bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-sm shadow-red-900/10 active:scale-95"
            id="navbar-primary-need-blood-btn"
          >
            <span>Need Blood?</span>
          </button>

          {/* Secondary Action Button: Become a Donor (Hidden on small mobile) */}
          <button
            onClick={() => handleNavClick('become-donor')}
            className="hidden lg:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-colors border border-slate-200/80"
            id="navbar-secondary-become-donor-btn"
          >
            <HeartHandshake className="w-4 h-4 text-[#B4232C]" />
            <span>Become a Donor</span>
          </button>

          {/* Hamburger button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
            id="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto" id="mobile-nav-drawer">
          {/* Mobile Auth & Account View */}
          {currentRole === 'guest' || currentPage === 'home' ? (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#B4232C]" />
                    <span>Visitor / Public View</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Login or register as Admin, Team, or Donor
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  id="mobile-nav-login-btn"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#B4232C]" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-3 py-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  id="mobile-nav-register-btn"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser?.email}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    currentRole === 'admin'
                      ? 'bg-slate-900 text-white'
                      : currentRole === 'coordinator'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {currentRole === 'admin' ? 'Admin' : currentRole === 'coordinator' ? 'Team' : 'Donor'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentRole === 'donor') navigate('donor-dashboard');
                    else navigate('admin');
                  }}
                  className="py-1.5 px-2 bg-slate-900 text-white text-xs font-bold rounded-lg text-center"
                >
                  Go to Console
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    switchUserRole('guest');
                    navigate('home');
                  }}
                  className="py-1.5 px-2 bg-white text-red-600 border border-slate-200 text-xs font-bold rounded-lg text-center"
                >
                  Sign Out (Visitor)
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('emergency-request')}
              className="flex items-center justify-center gap-1.5 bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Emergency Help</span>
            </button>
            <button
              onClick={() => handleNavClick('become-donor')}
              className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#B4232C]" />
              <span>Become a Donor</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  currentPage === link.id ? 'bg-red-50 text-[#B4232C] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && <span className="w-1.5 h-1.5 rounded-full bg-[#B4232C]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
