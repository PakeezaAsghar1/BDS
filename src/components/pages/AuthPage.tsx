import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import {
  LogIn,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  Droplet,
  HeartHandshake,
  Shield,
  Users,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  Building2,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  X,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  initialRole?: 'donor' | 'team' | 'admin';
  onScreenChange?: (screen: 1 | 2) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  initialRole = 'donor',
  onScreenChange,
}) => {
  const { switchUserRole, navigate, addDonor, showToast, loginWithSupabase, registerWithSupabase } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Active Screen: 1 = Welcome Panel, 2 = Login & Registration Panel
  const [activeScreen, setActiveScreen] = useState<1 | 2>(1);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'team' | 'admin'>(initialRole);

  // Notify parent of active screen
  useEffect(() => {
    onScreenChange?.(activeScreen);
  }, [activeScreen, onScreenChange]);

  // 10-second auto-swap: automatically transition to Screen 2 if user doesn't manually swap
  useEffect(() => {
    if (activeScreen !== 1) return;
    const timer = setTimeout(() => {
      setActiveScreen(2);
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeScreen]);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginSpecialId, setLoginSpecialId] = useState(
    initialRole === 'admin' ? 'BDS-PATRON-01' : initialRole === 'team' ? 'BDS-COORD-2026' : ''
  );
  const [loginError, setLoginError] = useState('');

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('O+');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regBatch, setRegBatch] = useState('2022-2026');
  const [regCampus, setRegCampus] = useState('UET Narowal Campus');
  const [regEmergencyAvailable, setRegEmergencyAvailable] = useState(true);
  const [regSpecialId, setRegSpecialId] = useState(
    initialRole === 'admin' ? 'BDS-PATRON-01' : initialRole === 'team' ? 'BDS-COORD-2026' : ''
  ); // Team ID / Admin ID (Compulsory)
  const [regError, setRegError] = useState('');

  // Sync mode when route changes
  useEffect(() => {
    setMode(initialMode);
    setActiveScreen(1);
  }, [initialMode]);

  // Touch Swipe Gesture Detection for Mobile
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Do not trigger swipe when interacting with form inputs, buttons, or scrollables
    if (target.closest('input, select, textarea, button, [contenteditable="true"]')) {
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, select, textarea, button')) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);

    // Vertical gestures (swipe up on Screen 1 -> Screen 2, swipe down on Screen 2 -> Screen 1)
    if (isVertical) {
      if (activeScreen === 1 && deltaY < -40) {
        setActiveScreen(2);
      } else if (activeScreen === 2 && deltaY > 40) {
        const scrollArea = document.getElementById('auth-card-scroll-area');
        if (!scrollArea || scrollArea.scrollTop <= 15) {
          setActiveScreen(1);
        }
      }
    } else {
      // Horizontal gestures
      if (activeScreen === 1 && deltaX < -40) {
        setActiveScreen(2);
      } else if (activeScreen === 2 && deltaX > 40) {
        setActiveScreen(1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (forgotModalOpen) {
          setForgotModalOpen(false);
        } else if (activeScreen === 2) {
          setActiveScreen(1);
        }
      } else if (e.key === 'ArrowRight' && activeScreen === 1) {
        setActiveScreen(2);
      } else if (e.key === 'ArrowLeft' && activeScreen === 2) {
        // Only if not typing in an input
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          setActiveScreen(1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen, forgotModalOpen]);

  const roleDefinitions = [
    {
      id: 'donor' as const,
      label: 'Donor',
      title: 'Blood Donor',
      badge: 'Community Hero',
      description: 'Manage donation availability, digital donor card, and emergency dispatches.',
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
      title: 'Team Member',
      badge: 'Coordinator / Volunteer',
      description: 'Review urgent requests, match donors, and coordinate campus blood drives.',
      icon: Users,
      color: 'from-blue-600 to-indigo-700',
      activeBorder: 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30',
      user: INITIAL_USERS[1], // Fatima Noor
      portalPage: 'team-dashboard',
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
    setLoginError('');
    setRegError('');
    const target = roleDefinitions.find((r) => r.id === roleId);
    if (target?.user?.email) {
      setLoginEmail(target.user.email);
    }
    if (roleId === 'admin') {
      setLoginSpecialId('BDS-PATRON-01');
      if (!regSpecialId) setRegSpecialId('BDS-PATRON-01');
    } else if (roleId === 'team') {
      setLoginSpecialId('BDS-COORD-2026');
      if (!regSpecialId) setRegSpecialId('BDS-COORD-2026');
    } else {
      setLoginSpecialId('');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // ID is compulsory for admin and team
    if (selectedRole === 'admin' && !loginSpecialId.trim()) {
      setLoginError('Executive Council Admin ID is compulsory to log in as Administrator.');
      return;
    }
    if (selectedRole === 'team' && !loginSpecialId.trim()) {
      setLoginError('BDS Team Coordinator ID is compulsory to log in as Team Member.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithSupabase(
        loginEmail,
        loginPassword,
        loginSpecialId,
        currentRoleConfig.userRole
      );

      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
        return;
      }

      showToast(
        `Welcome Back, ${res.user?.name || currentRoleConfig.user.name}!`,
        `Signed in as ${currentRoleConfig.title} (${currentRoleConfig.badge})`,
        'success'
      );

      navigate(currentRoleConfig.portalPage);
    } catch (err: any) {
      setLoginError(err?.message || 'Login error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setRegError('Please fill in all mandatory fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }

    // ID is compulsory for admin and team
    if (selectedRole === 'admin' && !regSpecialId.trim()) {
      setRegError('Executive Council Admin ID is compulsory for Admin registration.');
      return;
    }

    if (selectedRole === 'team' && !regSpecialId.trim()) {
      setRegError('BDS Team Coordinator ID is compulsory for Team Member registration.');
      return;
    }

    setIsSubmitting(true);
    try {
      const regRes = await registerWithSupabase({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: currentRoleConfig.userRole,
        department: regDepartment,
        batch: regBatch,
        campus: regCampus,
        specialId: regSpecialId,
        bloodGroup: regBloodGroup,
        password: regPassword,
      });

      if (selectedRole === 'donor') {
        await addDonor({
          userId: regRes.user?.id,
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          bloodGroup: regBloodGroup,
          campus: regCampus,
          area: `${regDepartment} Department, UET Narowal`,
          studentBatch: regBatch,
          age: 21,
          gender: 'Male',
          emergencyAvailable: regEmergencyAvailable,
          availabilityStatus: 'Available',
          verificationStatus: 'Pending',
          donationCount: 0,
          willingToTravelKm: 20,
        });

        showToast('Registration Successful!', 'Welcome to the BDS UET Narowal Lifesaving Network in Supabase.', 'success');
        navigate('donor-dashboard');
      } else {
        showToast(
          'Account Registered in Supabase!',
          `Welcome to BDS UET as ${currentRoleConfig.title}.`,
          'success'
        );
        navigate(currentRoleConfig.portalPage);
      }
    } catch (err: any) {
      setRegError('Failed to save registration to database. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      showToast('Reset Link Dispatched', `Password instructions sent to ${forgotEmail}.`, 'info');
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 1200);
  };

  return (
    <div
      id="auth-experience-container"
      className="relative w-full h-[100dvh] min-h-screen overflow-hidden bg-slate-950 text-slate-900 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Horizontal Sliding Two-Screen Track (450ms-650ms smooth transition) */}
      <div
        className={`w-[200%] h-[100dvh] min-h-screen flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeScreen === 1 ? 'translate-x-0' : '-translate-x-1/2'
        }`}
      >
        {/* ======================================================== */}
        {/* SCREEN 1: WELCOME PANEL                                   */}
        {/* ======================================================== */}
        <section
          id="auth-screen-welcome"
          className="relative w-1/2 h-[100dvh] min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#9e161c] via-[#850f16] to-[#5a050b]"
        >
          {/* Background Image: High-Quality Blood Donation 3D Artwork */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#9e161c] via-[#850f16] to-[#5a050b]">
            <img
              src="/assets/aistudio/1000071942.png"
              alt="Donate Blood. Save Lives. - BDS UET Narowal"
              className="w-full h-full max-h-full object-contain object-center select-none pointer-events-none"
              loading="eager"
            />
          </div>

          {/* Top Header: Back to Home navigation */}
          <div className="relative z-10 pt-6 sm:pt-8 px-6 sm:px-10 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-all cursor-pointer group active:scale-95"
              title="Return to BDS UET Home"
            >
              <div className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-sm">
                <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide drop-shadow-sm">Back to Home</span>
            </button>
          </div>

          {/* Center Space: Open area allowing full visibility of the 3D artwork */}
          <div className="relative z-10 flex-1 pointer-events-none" />

          {/* Bottom Area: Prominent Action Buttons & Swipe-Up Indicator */}
          <div className="relative z-10 pb-6 sm:pb-8 px-6 sm:px-10 max-w-sm mx-auto w-full text-center space-y-3 bg-gradient-to-t from-black/50 via-black/15 to-transparent pt-6 rounded-t-3xl">
            {/* Prominent White Rounded Button: Log In */}
            <button
              onClick={() => {
                setMode('login');
                setActiveScreen(2);
              }}
              className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-[#8F1D25] rounded-full font-black text-sm sm:text-base tracking-wide shadow-2xl transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
              id="welcome-login-btn"
            >
              <span>Log In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Elegant Outlined Rounded Button: Create Account */}
            <button
              onClick={() => {
                setMode('register');
                setActiveScreen(2);
              }}
              className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm sm:text-base border border-white/40 backdrop-blur-md transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              id="welcome-register-btn"
            >
              <span>Create Account</span>
            </button>

            {/* Subtle Swipe-Up Indicator at the Bottom */}
            <div
              onClick={() => setActiveScreen(2)}
              className="pt-1 flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-colors group"
              title="Swipe up or click to open authentication"
            >
              <ChevronUp className="w-5 h-5 animate-bounce text-red-200 group-hover:text-white" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-white/70 group-hover:text-white">
                Swipe up to enter
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SCREEN 2: LOGIN AND REGISTRATION PANEL                    */}
        {/* (Built as a full webpage integrated with the website)     */}
        {/* ======================================================== */}
        <section
          id="auth-screen-forms"
          className="relative w-1/2 min-h-screen flex flex-col overflow-y-auto bg-[#FAF9F7] text-slate-900"
        >
          {/* Subtle Ambient Red Glow at Top (Organic Web Theme) */}
          <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-red-100/60 via-red-50/20 to-transparent pointer-events-none" />
          <div className="absolute -top-24 right-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Main Content: Seamless part of the web, not a detached floating card */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            <div
              id="auth-card-scroll-area"
              className="w-full bg-white rounded-3xl sm:rounded-4xl border border-slate-200/90 shadow-sm p-6 sm:p-10 md:p-12 text-left animate-in fade-in duration-200"
            >
              {/* Back Button on Join the Lifesaving Community */}
              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveScreen(1)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition-all cursor-pointer group active:scale-95 shadow-2xs"
                  id="auth-screen-back-btn"
                  title="Back to Welcome Screen"
                >
                  <ArrowLeft className="w-4 h-4 text-[#B4232C] transition-transform group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>
              </div>

              {/* Header with Heading & Official BDS Logo */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full p-1 bg-white border border-slate-200/90 shadow-md shadow-red-950/10 mb-3 overflow-hidden group hover:scale-105 transition-transform" id="auth-screen-brand-logo">
                  <img
                    src={bdsLogoImg}
                    alt="Blood Donor Society UET Narowal Official Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Join the Lifesaving Community'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium max-w-md mx-auto">
                  {mode === 'login'
                    ? 'Enter your credentials to access your donor, team, or executive council portal.'
                    : 'Register as a verified student donor, team coordinator, or executive administrator.'}
                </p>

                {/* Mode Switcher Tabs Inside Form Area */}
                <div className="mt-4 inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 max-w-xs w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRegError('');
                      setLoginError('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      mode === 'login'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    id="card-tab-login"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#B4232C]" />
                    <span>Log In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegError('');
                      setLoginError('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      mode === 'register'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    id="card-tab-register"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#B4232C]" />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Select Account Role:
                  </span>
                  <span className="text-[11px] font-bold text-[#B4232C]">
                    {currentRoleConfig.title}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {roleDefinitions.map((r) => {
                    const isSelected = selectedRole === r.id;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleQuickSelect(r.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#B4232C] bg-red-50/70 text-[#8F1D25] ring-2 ring-red-400/25 font-bold shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700 font-semibold'
                        }`}
                        id={`role-btn-${r.id}`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                        <span className="text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* LOGIN FORM                                           */}
              {/* ---------------------------------------------------- */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4" id="screen2-login-form">
                  {loginError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Email / Identifier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email or Account Identifier *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="e.g. zain.abideen@student.uet.edu.pk"
                        value={loginEmail || currentRoleConfig.user.email}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                        required
                        id="login-input-email"
                      />
                    </div>
                  </div>

                  {/* Password with Show/Hide Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotModalOpen(true)}
                        className="text-xs font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors cursor-pointer"
                        id="login-forgot-password-link"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                        required
                        id="login-input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Compulsory Admin ID if role is Admin */}
                  {selectedRole === 'admin' && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-slate-900" />
                          <span>Executive Council Admin ID <span className="text-[#B4232C]">* (Compulsory)</span></span>
                        </label>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          Required
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="e.g. BDS-PATRON-01"
                          value={loginSpecialId}
                          onChange={(e) => {
                            setLoginSpecialId(e.target.value);
                            setLoginError('');
                          }}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="login-input-admin-id"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Compulsory council verification credential.</span>
                        <button
                          type="button"
                          onClick={() => setLoginSpecialId('BDS-PATRON-01')}
                          className="text-[#B4232C] font-bold hover:underline cursor-pointer"
                        >
                          Fill Demo: BDS-PATRON-01
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Compulsory Team ID if role is Team */}
                  {selectedRole === 'team' && (
                    <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>BDS Team Coordinator ID <span className="text-[#B4232C]">* (Compulsory)</span></span>
                        </label>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          Required
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="e.g. BDS-COORD-2026"
                          value={loginSpecialId}
                          onChange={(e) => {
                            setLoginSpecialId(e.target.value);
                            setLoginError('');
                          }}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="login-input-team-id"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Compulsory student chapter coordinator ID.</span>
                        <button
                          type="button"
                          onClick={() => setLoginSpecialId('BDS-COORD-2026')}
                          className="text-[#B4232C] font-bold hover:underline cursor-pointer"
                        >
                          Fill Demo: BDS-COORD-2026
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick One-Click Credentials Notice */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Ready to log in as <strong>{currentRoleConfig.user.name}</strong></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Ready</span>
                  </div>

                  {/* Crimson-Red Primary Log In Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-red-950/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    id="login-submit-btn"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In as {currentRoleConfig.title}</span>
                  </button>

                  {/* Switch to Create Account */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setLoginError('');
                          setRegError('');
                        }}
                        className="font-bold text-[#B4232C] hover:text-[#8F1D25] underline cursor-pointer"
                        id="login-switch-to-register-link"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* ---------------------------------------------------- */
                /* REGISTRATION FORM                                    */
                /* ---------------------------------------------------- */
                <form onSubmit={handleRegisterSubmit} className="space-y-4" id="screen2-register-form">
                  {regError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ahmad"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                      required
                      id="reg-input-name"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="email"
                          placeholder="ahmad@student.uet.edu.pk"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="reg-input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="tel"
                          placeholder="+92 300 1234567"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="reg-input-phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password with Show/Hide Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="reg-input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="reg-input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Blood Group (For Donor) */}
                  {selectedRole === 'donor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-[#B4232C] bg-white focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none"
                        id="reg-input-blood-group"
                      >
                        {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Department & Campus */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department & Campus *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. Electrical Engineering, UET Narowal Campus"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                        required
                        id="reg-input-department"
                      />
                    </div>
                  </div>

                  {/* Student Batch / Session if donor/team coordinator is student */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Batch / Session (if student)
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. 2022-2026 / 2022-CS"
                        value={regBatch}
                        onChange={(e) => setRegBatch(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                        id="reg-input-batch"
                      />
                    </div>
                  </div>

                  {/* Checkpoint: Available for Emergency 24/7 Calls */}
                  <div className="p-3.5 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regEmergencyAvailable}
                        onChange={(e) => setRegEmergencyAvailable(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-[#B4232C] rounded focus:ring-red-500 cursor-pointer"
                        id="reg-input-emergency-check"
                      />
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        Available for Emergency 24/7 Calls
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      You will receive verified SMS/WhatsApp dispatches only for critical and compatible emergency cases.
                    </p>
                  </div>

                  {/* Team ID / Admin ID (COMPULSORY for Admin or Team) */}
                  {(selectedRole === 'team' || selectedRole === 'admin') && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          {selectedRole === 'admin' ? (
                            <Shield className="w-4 h-4 text-slate-900" />
                          ) : (
                            <Users className="w-4 h-4 text-blue-600" />
                          )}
                          <span>
                            {selectedRole === 'admin' ? 'Executive Council Admin ID' : 'BDS Team Coordinator ID'}{' '}
                            <span className="text-[#B4232C]">* (Compulsory)</span>
                          </span>
                        </label>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          Required
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          placeholder={selectedRole === 'admin' ? 'e.g. BDS-PATRON-01' : 'e.g. BDS-COORD-2026'}
                          value={regSpecialId}
                          onChange={(e) => {
                            setRegSpecialId(e.target.value);
                            setRegError('');
                          }}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none font-medium bg-white"
                          required
                          id="reg-input-special-id"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>
                          {selectedRole === 'admin'
                            ? 'Compulsory executive appointment verification code.'
                            : 'Compulsory verified team membership identifier.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRegSpecialId(selectedRole === 'admin' ? 'BDS-PATRON-01' : 'BDS-COORD-2026')}
                          className="text-[#B4232C] font-bold hover:underline cursor-pointer"
                        >
                          Fill Demo ID
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Crimson-Red Primary Register Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-red-950/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    id="register-submit-btn"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register as {currentRoleConfig.title}</span>
                  </button>

                  {/* Switch to Log In */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setLoginError('');
                          setRegError('');
                        }}
                        className="font-bold text-[#B4232C] hover:text-[#8F1D25] underline cursor-pointer"
                        id="register-switch-to-login-link"
                      >
                        Log In
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Public Visitor View Option */}
              <div className="text-center pt-5 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole('guest');
                    navigate('home');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
                  id="auth-return-guest-link"
                >
                  Return to Home in Standard Visitor / User View
                </button>
              </div>
            </div>
          </div>

          {/* Screen 2 Footer Hint */}
          <div className="relative z-10 pb-6 text-center">
            <span className="text-[11px] text-slate-400 tracking-wider uppercase">
              Swipe down or click Back to return to welcome panel
            </span>
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* FORGOT PASSWORD MODAL                                    */}
      {/* ======================================================== */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-left shadow-2xl border border-slate-200">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#B4232C] mb-4">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered student or coordinator email address. We'll send verified password reset instructions.
            </p>

            <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  placeholder="yourname@student.uet.edu.pk"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C] outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold shadow-md transition-colors"
                >
                  {forgotSent ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
