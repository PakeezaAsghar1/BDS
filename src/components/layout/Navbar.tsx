import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Menu,
  X,
  Bell,
  HeartHandshake,
  Search,
  PlusCircle,
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
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    stats,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'find-donor', label: 'Find a Donor' },
    { id: 'become-donor', label: 'Donate Blood' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'volunteers', label: 'Volunteers' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'guide', label: 'Donation Guide' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    if (pageId === 'gallery') {
      navigate('home');
      setTimeout(() => {
        document.getElementById('our-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(pageId);
    }
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setRoleDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-200/60 py-3.5'
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
        <div className="flex items-center gap-2.5">
          {/* Role Switcher (For live demonstration of Donor / Requester / Coordinator / Admin portals) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
              id="role-switcher-btn"
              title="Switch user perspective"
            >
              <Shield className="w-3.5 h-3.5 text-[#B4232C]" />
              <span className="capitalize">{currentRole === 'guest' ? 'Visitor' : currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                id="role-dropdown-menu"
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select User Perspective
                </div>
                {(['guest', 'donor', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchUserRole(r);
                      setRoleDropdownOpen(false);
                      if (r === 'admin' || r === 'coordinator') navigate('admin');
                      else if (r === 'donor') navigate('donor-dashboard');
                      else navigate('home');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === r ? 'font-bold text-[#B4232C] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span className="capitalize">{r === 'guest' ? 'Public Visitor' : r}</span>
                    {currentRole === r && <CheckCircle className="w-3.5 h-3.5 text-[#B4232C]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Notifications"
              id="notifications-toggle-btn"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B4232C] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50"
                id="notifications-dropdown-menu"
              >
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                    {unreadNotificationCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-[#B4232C] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#B4232C] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No notifications at this moment.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionLink) {
                            handleNavClick(n.actionLink);
                          }
                        }}
                        className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-xs text-slate-900 leading-tight">{n.title}</h5>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#B4232C] shrink-0 mt-1" />}
                        </div>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 inline-block">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Portal Direct Link based on active role */}
          {currentRole === 'admin' || currentRole === 'coordinator' ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              id="nav-admin-console-btn"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Console</span>
            </button>
          ) : currentRole === 'donor' ? (
            <button
              onClick={() => handleNavClick('donor-dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              id="nav-donor-dashboard-btn"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span>My Donor Portal</span>
            </button>
          ) : null}

          {/* Primary Action Button: Need Blood? */}
          <button
            onClick={() => handleNavClick('request-blood')}
            className="inline-flex items-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-sm shadow-red-900/10 active:scale-95"
            id="navbar-primary-need-blood-btn"
          >
            <PlusCircle className="w-4 h-4" />
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
          {/* Mobile Role Switcher */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2" id="mobile-role-switcher-container">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#B4232C]" />
                <span>User Perspective / Role</span>
              </span>
              <span className="text-[10px] text-[#B4232C] bg-red-50 px-2 py-0.5 rounded-full font-extrabold border border-red-200">
                {currentRole === 'guest' ? 'Visitor' : currentRole.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['guest', 'donor', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchUserRole(r);
                    setMobileMenuOpen(false);
                    if (r === 'admin' || r === 'coordinator') navigate('admin');
                    else if (r === 'donor') navigate('donor-dashboard');
                    else navigate('home');
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                    currentRole === r
                      ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  id={`mobile-role-btn-${r}`}
                >
                  <span className="capitalize">{r === 'guest' ? 'Visitor' : r}</span>
                  {currentRole === r && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

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

          {/* Mobile Admin / Dashboard quick links */}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <button
              onClick={() => handleNavClick('donor-dashboard')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#B4232C]" />
              <span>Donor Portal</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#B4232C]" />
              <span>Coordinator & Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
