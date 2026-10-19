import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import {
  LogIn,
  UserPlus,
  ArrowLeftRight,
  Shield,
  Users,
  HeartHandshake,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  Building2,
  GraduationCap,
  Heart,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  initialRole?: 'donor' | 'team' | 'admin';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  initialRole = 'donor',
}) => {
  const { switchUserRole, navigate, addDonor, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'team' | 'admin'>(initialRole);
  
  // View state: 'poster' starts first when visiting login/register page, then swaps to 'form'
  const [activeView, setActiveView] = useState<'poster' | 'form'>('poster');
  const [timeLeft, setTimeLeft] = useState<number>(10);

  // Sync mode with prop if route changes
  useEffect(() => {
    setMode(initialMode);
    setActiveView('poster');
    setTimeLeft(10);
  }, [initialMode]);

  // 10-second automatic swap timer
  useEffect(() => {
    if (activeView !== 'poster') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setActiveView('form');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeView]);

  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('O+');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regBatch, setRegBatch] = useState('2022-2026');
  const [regCampus, setRegCampus] = useState('UET Narowal Campus');
  const [regAge, setRegAge] = useState(21);
  const [regPassword, setRegPassword] = useState('');
  const [regEmergencyAvailable, setRegEmergencyAvailable] = useState(true);

  const roleDefinitions = [
    {
      id: 'donor' as const,
      label: 'Donor',
      title: 'Blood Donor',
      badge: 'Community Hero',
      description: 'Manage donation availability, digital donor card, and live emergency requests.',
      icon: HeartHandshake,
      color: 'from-rose-500 to-red-600',
      activeBorder: 'border-red-500 bg-red-50/80 ring-2 ring-red-400/30',
      user: INITIAL_USERS[2], // Zain Ul Abideen
      portalPage: 'donor-dashboard',
      userRole: 'donor' as UserRole,
    },
    {
      id: 'team' as const,
      label: 'Team',
      title: 'BDS Team Member',
      badge: 'Coordinator / Volunteer',
      description: 'Review urgent blood requests, match donors, and coordinate campus blood drives.',
      icon: Users,
      color: 'from-blue-600 to-indigo-700',
      activeBorder: 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30',
      user: INITIAL_USERS[1], // Fatima Noor
      portalPage: 'admin',
      userRole: 'coordinator' as UserRole,
    },
    {
      id: 'admin' as const,
      label: 'Admin',
      title: 'Administrator',
      badge: 'Executive Council',
      description: 'Full oversight: manage BDS executive council, audit trails, and donor verifications.',
      icon: Shield,
      color: 'from-slate-800 to-slate-950',
      activeBorder: 'border-slate-900 bg-slate-100 ring-2 ring-slate-700/30',
      user: INITIAL_USERS[0], // Engr. Haris Tariq
      portalPage: 'admin',
      userRole: 'admin' as UserRole,
    },
  ];

  const currentRoleConfig = roleDefinitions.find((r) => r.id === selectedRole) || roleDefinitions[0];

  const handleRoleQuickSelect = (roleId: 'donor' | 'team' | 'admin') => {
    setSelectedRole(roleId);
    const target = roleDefinitions.find((r) => r.id === roleId);
    if (target?.user?.email) {
      setLoginEmail(target.user.email);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = currentRoleConfig.user;
    switchUserRole(currentRoleConfig.userRole);

    showToast(
      `Welcome, ${targetUser.name}!`,
      `Signed in as ${currentRoleConfig.title} (${currentRoleConfig.badge})`,
      'success'
    );

    navigate(currentRoleConfig.portalPage);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim() || !regPhone.trim()) {
      showToast('Incomplete Form', 'Please provide at least your full name and contact number.', 'error');
      return;
    }

    if (selectedRole === 'donor') {
      try {
        await addDonor({
          name: regName.trim(),
          email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '.')}@student.uet.edu.pk`,
          phone: regPhone.trim(),
          bloodGroup: regBloodGroup,
          campus: regCampus,
          area: `${regDepartment} Department, UET Narowal`,
          studentBatch: regBatch,
          age: Number(regAge) || 20,
          gender: 'Male',
          emergencyAvailable: regEmergencyAvailable,
          availabilityStatus: 'Available',
          verificationStatus: 'Pending',
          donationCount: 0,
          willingToTravelKm: 15,
        });

        switchUserRole('donor');
        showToast('Registration Successful!', 'Welcome to the BDS UET Narowal Donor Network.', 'success');
        navigate('donor-dashboard');
      } catch (err) {
        showToast('Registration Error', 'Unable to complete registration. Please retry.', 'error');
      }
    } else {
      switchUserRole(currentRoleConfig.userRole);
      showToast('Registration Request Submitted', `Role assigned: ${currentRoleConfig.title}. Welcome to BDS UET!`, 'success');
      navigate(currentRoleConfig.portalPage);
    }
  };

  return (
    <div id="auth-page-container" className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation Bar & Breadcrumbs */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#B4232C] transition-colors group self-start"
          id="auth-page-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-[#B4232C]">BDS UET Narowal</span>
          <span>/</span>
          <span>Authentication Portal</span>
          <span>/</span>
          <span className="text-slate-900 font-bold capitalize">{mode}</span>
        </div>
      </div>

      {/* Main Page Layout: Either Poster View OR Full Page Form View */}
      {activeView === 'poster' ? (
        /* ================= POSTER VIEW ================= */
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-950 via-[#180406] to-slate-950 rounded-3xl shadow-2xl border border-red-900/50 overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200" id="auth-page-poster-view">
          {/* Header Bar with Countdown & Actions */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-white shadow-sm">
                <HeartHandshake className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  BDS UET Narowal
                </h2>
                <p className="text-xs text-red-200/80 font-medium">
                  Blood Donation Society • Saving Lives Together
                </p>
              </div>
            </div>

            {/* Quick Swap Button */}
            <button
              onClick={() => setActiveView('form')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border border-white/20 active:scale-95 shadow-xs cursor-pointer"
              id="auth-poster-swap-top-btn"
              title="Skip countdown and go directly to form"
            >
              <ArrowLeftRight className="w-4 h-4 text-red-300" />
              <span>Swap to Form</span>
            </button>
          </div>

          {/* 10-Second Auto Progress Bar */}
          <div className="w-full bg-black/70 h-1.5 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 transition-all duration-1000 ease-linear shadow-xs"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>

          {/* Main Poster Image Showcase Area - Clickable to Swap */}
          <div
            onClick={() => setActiveView('form')}
            className="p-5 sm:p-8 flex flex-col items-center justify-center cursor-pointer group select-none"
            title="Click anywhere to swap to form immediately"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[390px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group-hover:scale-[1.015] transition-all duration-300 bg-red-950/40">
              <img
                src="/assets/aistudio/1000071942_c34a0b1a.png"
                alt="Donate Blood. Save Lives. - BDS UET Narowal"
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="px-5 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/25 shadow-2xl">
                  <ArrowLeftRight className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>Click anywhere to swap to form</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Countdown & Action Bar */}
          <div className="p-5 sm:p-8 pt-0 border-t border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-300 pt-3 px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="font-semibold text-white">Donate Blood. Save Lives.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Automatic transition:</span>
                <span className="font-bold text-red-200 bg-red-950/80 border border-red-700/60 px-2.5 py-0.5 rounded-lg text-xs">
                  Swapping in {timeLeft}s
                </span>
              </div>
            </div>

            {/* Big Primary Swap Button */}
            <button
              onClick={() => setActiveView('form')}
              className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-red-600 via-[#B4232C] to-[#8F1D25] hover:from-red-500 hover:to-red-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-red-950/50 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer border border-red-500/40"
              id="auth-page-poster-swap-btn"
            >
              <ArrowLeftRight className="w-5 h-5 text-white" />
              <span>Swap to {mode === 'register' ? 'Register' : 'Login'} Form Now</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= FULL PAGE FORM VIEW ================= */
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200" id="auth-page-form-view">
          {/* Top Page Header Banner */}
          <div className="relative bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 px-6 sm:px-10 py-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#B4232C] shadow-sm">
                  <span className="font-['Sancreek','Rye',serif] text-2xl font-bold text-white">BDS</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <span>{mode === 'login' ? 'Account Login' : 'Register New Account'}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-red-200 border border-white/20">
                      UET Narowal
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Select your role to access your dedicated Blood Donor, Team Coordinator, or Admin portal.
                  </p>
                </div>
              </div>

              {/* Swap to Poster Button & Tabs */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('poster');
                    setTimeLeft(10);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border border-white/20 active:scale-95 shadow-xs cursor-pointer"
                  id="auth-form-swap-to-poster-btn"
                  title="Swap back to Welcome Poster view"
                >
                  <ArrowLeftRight className="w-4 h-4 text-red-300" />
                  <span>View Poster</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-5 max-w-md flex rounded-xl bg-black/40 p-1 border border-white/15">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="auth-page-tab-login"
              >
                <LogIn className="w-4 h-4 text-[#B4232C]" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="auth-page-tab-register"
              >
                <UserPlus className="w-4 h-4 text-[#B4232C]" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Form Page Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* 1. Role Selection Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700">
                  Select Your Account Role / Perspective:
                </label>
                <span className="text-xs font-bold text-[#B4232C] bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
                  {selectedRole === 'admin'
                    ? 'Executive Council (Admin)'
                    : selectedRole === 'team'
                    ? 'BDS Team Member (Coordinator)'
                    : 'Blood Donor Portal'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5" id="auth-page-role-grid">
                {roleDefinitions.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleQuickSelect(r.id)}
                      className={`relative p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? `${r.activeBorder} shadow-sm`
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                      id={`auth-role-card-${r.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${r.color} shadow-xs`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900">{r.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                          {r.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-600 uppercase tracking-wider">{r.badge}</span>
                        <span className="text-[#B4232C] font-semibold">Select &rarr;</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Login Form OR Register Form */}
            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-5" id="auth-page-login-form">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Quick Demo Credentials for {currentRoleConfig.title}:
                    </span>
                    <span className="text-[11px] text-slate-500">Auto-filled for demonstration</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address / Portal ID
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={loginEmail || currentRoleConfig.user.email}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none bg-white font-medium"
                          required
                          id="login-page-email-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none bg-white font-medium"
                          required
                          id="login-page-password-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sign in directly as <strong className="text-slate-900">{currentRoleConfig.user.name}</strong> ({currentRoleConfig.title})
                    </span>
                    <span className="text-[11px] text-slate-400">Ready to proceed</span>
                  </div>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  id="auth-page-submit-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {currentRoleConfig.title} & Enter Portal</span>
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-6" id="auth-page-register-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ahmad"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium"
                      required
                      id="register-page-name-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium"
                        required
                        id="register-page-phone-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="yourname@student.uet.edu.pk"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium"
                        id="register-page-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group *
                    </label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#B4232C] focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none bg-white"
                      id="register-page-blood-group-select"
                    >
                      {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department & Campus
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Electrical Engineering, UET Narowal"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Batch / Session
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. 2022-2026 / 2022-CS"
                        value={regBatch}
                        onChange={(e) => setRegBatch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>

                {selectedRole === 'donor' && (
                  <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regEmergencyAvailable}
                        onChange={(e) => setRegEmergencyAvailable(e.target.checked)}
                        className="w-4 h-4 text-[#B4232C] rounded focus:ring-red-500"
                        id="register-page-emergency-checkbox"
                      />
                      <span className="text-xs font-bold text-slate-900">
                        Available for Emergency 24/7 Calls (UET Narowal & DHQ Hospital Area)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-600 pl-6">
                      You will receive verified SMS/WhatsApp dispatches only for critical and compatible emergency cases.
                    </p>
                  </div>
                )}

                {/* Submit Register Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  id="auth-page-submit-register-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register as {currentRoleConfig.title} & Enter Dashboard</span>
                </button>
              </form>
            )}

            {/* Public Visitor View Option & Return to Poster */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveView('poster');
                  setTimeLeft(10);
                }}
                className="text-[#B4232C] hover:text-[#8F1D25] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                id="auth-page-footer-poster-link"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>View BDS UET Welcome Poster</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUserRole('guest');
                  navigate('home');
                }}
                className="text-slate-500 hover:text-slate-900 font-semibold underline underline-offset-4 transition-colors"
                id="auth-page-keep-visitor-btn"
              >
                Return to home in Visitor / User view
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
