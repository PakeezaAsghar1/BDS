import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UserRole } from '../../types';
import {
  X,
  Shield,
  Users,
  HeartHandshake,
  LogIn,
  UserPlus,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  defaultRole?: 'donor' | 'team' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  defaultRole = 'donor',
}) => {
  const { switchUserRole, navigate, addDonor, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'team' | 'admin'>(defaultRole);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

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

  if (!isOpen) return null;

  const roleDefinitions = [
    {
      id: 'donor' as const,
      label: 'Donor',
      title: 'Blood Donor',
      badge: 'Community Hero',
      description: 'Manage donation availability, digital donor card, and donation history.',
      icon: HeartHandshake,
      color: 'from-rose-500 to-red-600',
      activeBorder: 'border-red-500 bg-red-50/60 ring-2 ring-red-400/30',
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
      activeBorder: 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30',
      user: INITIAL_USERS[1], // Fatima Noor
      portalPage: 'admin',
      userRole: 'coordinator' as UserRole,
    },
    {
      id: 'admin' as const,
      label: 'Admin',
      title: 'Administrator',
      badge: 'Executive Authority',
      description: 'Full oversight: manage BDS executive council, audit trails, and donor verifications.',
      icon: Shield,
      color: 'from-slate-800 to-slate-950',
      activeBorder: 'border-slate-900 bg-slate-100 ring-2 ring-slate-700/30',
      user: INITIAL_USERS[0], // Engr. Haris Tariq
      portalPage: 'admin',
      userRole: 'admin' as UserRole,
    },
  ];

  const currentRoleConfig = roleDefinitions.find((r) => r.id === selectedRole)!;

  const handleQuickSignIn = (roleId: 'donor' | 'team' | 'admin') => {
    const config = roleDefinitions.find((r) => r.id === roleId)!;
    switchUserRole(config.userRole);
    showToast('Signed In Successfully', `Welcome back, ${config.user.name} (${config.title})!`, 'success');
    navigate(config.portalPage);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = currentRoleConfig;
    switchUserRole(config.userRole);
    showToast('Welcome Back', `Logged in as ${config.user.name} (${config.title})`, 'success');
    navigate(config.portalPage);
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim() || (selectedRole === 'donor' ? 'New Blood Donor' : selectedRole === 'team' ? 'New Team Member' : 'New Administrator');
    const email = regEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@narowal.uet.edu.pk`;
    const phone = regPhone.trim() || '+92 300 1234567';

    if (selectedRole === 'donor') {
      await addDonor({
        name,
        email,
        phone,
        bloodGroup: regBloodGroup,
        campus: regCampus,
        age: Number(regAge) || 21,
        emergencyAvailable: regEmergencyAvailable,
        studentBatch: regBatch,
      });
      switchUserRole('donor');
      navigate('donor-dashboard');
    } else if (selectedRole === 'team') {
      switchUserRole('coordinator');
      showToast('Team Registration Complete', `Welcome to BDS UET Team, ${name}! Coordinator Portal ready.`, 'success');
      navigate('admin');
    } else {
      switchUserRole('admin');
      showToast('Admin Access Granted', `Executive session initialized for ${name}.`, 'success');
      navigate('admin');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      id="auth-modal-dialog"
    >
      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 text-left overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 px-6 py-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#B4232C]">
                  <span className="font-['Sancreek','Rye',serif] text-xl font-bold text-white">BDS</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>{mode === 'login' ? 'Account Sign In' : 'Create an Account'}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-red-200 border border-white/20">
                      UET Narowal
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Choose whether you are signing in as an Admin, Team Member, or Donor
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="mt-4 flex rounded-xl bg-black/30 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="auth-tab-login"
              >
                <LogIn className="w-3.5 h-3.5 text-[#B4232C]" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="auth-tab-register"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#B4232C]" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Role Selector: Admin, Team, Donor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Your Account Role / Perspective:
                </label>
                <span className="text-[11px] font-semibold text-[#B4232C]">
                  {selectedRole === 'admin'
                    ? 'Administrator'
                    : selectedRole === 'team'
                    ? 'Team Coordinator'
                    : 'Blood Donor'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5" id="auth-role-selection-grid">
                {roleDefinitions.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`relative p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? r.activeBorder
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      id={`auth-role-btn-${r.id}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-[#B4232C]" />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${r.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black text-slate-900 capitalize">
                          {r.label}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 line-clamp-1 font-medium">
                        {r.badge}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Role Summary Pill */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <currentRoleConfig.icon className="w-4 h-4 text-[#B4232C] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">{currentRoleConfig.title}: </span>
                  {currentRoleConfig.description}
                </div>
              </div>
            </div>

            {/* Mode 1: Sign In Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email or Student Roll / ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginEmail || currentRoleConfig.user.email}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C] bg-white"
                        placeholder="you@narowal.uet.edu.pk"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <span className="text-[11px] text-slate-400">Demo enabled</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C] bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-950/15 flex items-center justify-center gap-2"
                  id="auth-submit-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {currentRoleConfig.title}</span>
                </button>

                {/* Quick 1-Click Access for Evaluation */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                    Or 1-Click Instant Access
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('donor')}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-bold border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <HeartHandshake className="w-3 h-3 text-[#B4232C]" />
                      <span>Donor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('team')}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-bold border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>Team</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSignIn('admin')}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-bold border border-slate-300 bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                    >
                      <Shield className="w-3 h-3 text-amber-300" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Mode 2: Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ahmad"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 0000000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="student@narowal.uet.edu.pk"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Specific Registration Fields */}
                {selectedRole === 'donor' ? (
                  <div className="p-3 bg-red-50/50 rounded-2xl border border-red-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-900">Donor Profile Details</span>
                      <span className="text-[10px] text-red-600 font-semibold">Ready to save lives</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Blood Group</label>
                        <select
                          value={regBloodGroup}
                          onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                        >
                          {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Age</label>
                        <input
                          type="number"
                          min={18}
                          max={65}
                          value={regAge}
                          onChange={(e) => setRegAge(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium pt-1">
                      <input
                        type="checkbox"
                        checked={regEmergencyAvailable}
                        onChange={(e) => setRegEmergencyAvailable(e.target.checked)}
                        className="w-4 h-4 text-[#B4232C] rounded border-slate-300 focus:ring-[#B4232C]"
                      />
                      <span>Available for critical emergency blood appeals (SMS/Call alerts)</span>
                    </label>
                  </div>
                ) : selectedRole === 'team' ? (
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                    <span className="text-xs font-bold text-blue-900 block">Team Volunteer & Coordinator Info</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Session / Batch</label>
                        <input
                          type="text"
                          value={regBatch}
                          onChange={(e) => setRegBatch(e.target.value)}
                          placeholder="e.g. 2022-2026"
                          className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Administrator Credentials</span>
                    <p className="text-[11px] text-slate-600">
                      Central executive permissions are assigned for BDS UET executive council members and faculty patrons.
                    </p>
                  </div>
                )}

                {/* Primary Register Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#B4232C] hover:bg-[#8F1D25] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-950/15 flex items-center justify-center gap-2"
                  id="auth-submit-register-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Continue as {currentRoleConfig.title}</span>
                </button>
              </form>
            )}

            {/* Public Visitor View Option */}
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  switchUserRole('guest');
                  onClose();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline underline-offset-4 transition-colors"
                id="auth-keep-visitor-view-btn"
              >
                Keep browsing in standard User / Visitor view without signing in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
