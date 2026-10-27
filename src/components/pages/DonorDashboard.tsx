import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { BloodGroup, DonorAvailability } from '../../types';
import bdsLogoImg from '../../assets/images/bds_logo.png';
import {
  Heart,
  Calendar,
  ShieldCheck,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Award,
  ArrowRight,
  PhoneCall,
  LayoutDashboard,
  Droplet,
  History,
  Megaphone,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Lock,
  Search,
  Filter,
  Check,
  Building2,
  GraduationCap,
  Sparkles,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Radio,
  QrCode,
  Download
} from 'lucide-react';

type DashboardTab =
  | 'overview'
  | 'requests'
  | 'history'
  | 'drives'
  | 'notifications'
  | 'profile'
  | 'settings';

export const DonorDashboard: React.FC = () => {
  const {
    currentUser,
    donors,
    requests,
    campaigns,
    notifications,
    unreadNotificationCount,
    donationRecords,
    markNotificationRead,
    markAllNotificationsRead,
    updateDonorAvailability,
    updateDonorProfile,
    addDonationRecord,
    registerForCampaign,
    refreshFromSupabase,
    navigate,
    logout,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Modals
  const [digitalCardModalOpen, setDigitalCardModalOpen] = useState(false);
  const [logDonationModalOpen, setLogDonationModalOpen] = useState(false);
  const [selectedRequestForDonate, setSelectedRequestForDonate] = useState<any | null>(null);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New donation form
  const [newHospital, setNewHospital] = useState('DHQ Hospital Narowal');
  const [newDonationDate, setNewDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDonationType, setNewDonationType] = useState<'Whole Blood' | 'Platelets Apheresis' | 'Plasma'>('Whole Blood');
  const [newUnits, setNewUnits] = useState(1);
  const [newCertId, setNewCertId] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // History filtering
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'All' | 'Verified' | 'Pending'>('All');

  // Blood requests filter
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState<'All' | 'Critical' | 'Urgent'>('All');

  // Profile editable form fields
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAltPhone, setProfileAltPhone] = useState('');
  const [profileCampus, setProfileCampus] = useState('');
  const [profileDepartment, setProfileDepartment] = useState('');
  const [profileBatch, setProfileBatch] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileArea, setProfileArea] = useState('');

  // Resolve authentic donor profile matching logged-in user
  const donorProfile = useMemo(() => {
    if (!currentUser) return null;
    const match =
      donors.find((d) => d.id === currentUser.donorProfileId) ||
      donors.find((d) => d.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
      donors.find((d) => d.id === currentUser.id);

    if (match) return match;

    // Fallback construct if signed in as donor
    return {
      id: currentUser.donorProfileId || currentUser.id || 'donor-101',
      name: currentUser.name || 'Zain Ul Abideen',
      email: currentUser.email || 'donor@bds.uet.edu.pk',
      phone: currentUser.phone || '+92 300 1234567',
      bloodGroup: (currentUser.bloodGroup || 'O-') as BloodGroup,
      campus: currentUser.campus || 'UET Narowal Campus',
      studentBatch: currentUser.batch || '2022-2026',
      department: currentUser.department || 'Computer Science',
      city: 'Narowal',
      area: 'UET Campus',
      availabilityStatus: 'Available' as DonorAvailability,
      emergencyAvailable: true,
      donationCount: 4,
      lastDonationDate: '2026-01-18',
      verificationStatus: (currentUser.verificationStatus || 'Verified') as 'Verified' | 'Pending' | 'Rejected',
      notificationsEnabled: true,
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: new Date().toISOString(),
    };
  }, [currentUser, donors]);

  // Sync profile form when donor changes
  React.useEffect(() => {
    if (donorProfile) {
      setProfilePhone(donorProfile.phone || '');
      setProfileAltPhone(donorProfile.whatsapp || donorProfile.phone || '');
      setProfileCampus(donorProfile.campus || 'UET Narowal Campus');
      setProfileDepartment(donorProfile.department || 'Computer Science');
      setProfileBatch(donorProfile.studentBatch || '2022-2026');
      setProfileCity(donorProfile.city || 'Narowal');
      setProfileArea(donorProfile.area || 'Narowal City');
    }
  }, [donorProfile]);

  // Authorization Checks
  // 1. Unauthenticated gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center mx-auto border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Donor Authentication Required</h2>
            <p className="text-sm text-slate-600">
              Please log in with your registered BDS Donor credentials to access your verified dashboard.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('login')}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#C62828] hover:bg-[#7F1D1D] shadow-md transition-all flex items-center justify-center gap-2"
              id="donor-auth-login-btn"
            >
              <span>Go to Donor Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs"
            >
              Return to BDS Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role mismatch gate (if non-donor accesses route)
  if (currentUser.role !== 'donor') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
            <p className="text-sm text-slate-600">
              You are currently signed in with the <strong className="uppercase text-slate-900">{currentUser.role}</strong> role. The Donor Dashboard is reserved for registered blood donors.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate(currentUser.role === 'admin' ? 'admin' : 'requester-dashboard')}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Go to Your {currentUser.role === 'admin' ? 'Admin Console' : 'Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors text-xs"
            >
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verification status determination from authentic record
  const verificationStatus = donorProfile?.verificationStatus || currentUser.verificationStatus || 'Verified';

  // 3. Verification Pending Gate Screen
  if (verificationStatus === 'Pending') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200/90 p-8 sm:p-10 space-y-7">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Verification Pending
                </span>
                <span className="text-xs text-slate-400">ID: {donorProfile?.id || 'D-PENDING'}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Account Under Clinical Review</h1>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Welcome, <strong className="text-slate-900">{currentUser.name}</strong>. Your donor registration with <strong>Blood Donors Society UET Narowal</strong> has been received and is currently undergoing clinical screening.
            </p>
            <p className="text-xs text-slate-500">
              To safeguard both donor wellness and patient safety, the BDS Clinical Verification Committee verifies hemoglobin thresholds, donation interval clearances, and campus student verification before granting active dispatch privileges.
            </p>
          </div>

          {/* Verification Progress Steps */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verification Pipeline</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px]">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-slate-900">Step 1: Registration Submitted</p>
                  <p className="text-slate-500 text-[11px]">Donor profile & contact details logged securely in Supabase.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] animate-pulse">
                  2
                </div>
                <div>
                  <p className="font-bold text-amber-900">Step 2: Clinical & Campus Identity Screening</p>
                  <p className="text-slate-500 text-[11px]">BDS medical team verifies blood group records and university enrollment.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px]">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-500">Step 3: Active Dispatch & Community Matching Activation</p>
                  <p className="text-slate-400 text-[11px]">Full verified dashboard access granted upon medical confirmation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Helpline and Actions */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Need urgent verification for an emergency blood match?</span>
              <p className="text-slate-600">
                Contact the BDS UET Narowal Executive Desk directly at <strong className="text-[#C62828] font-mono">+92 312 9901842</strong> or email <span className="font-mono text-slate-700">blooddonorsociety@uet.edu.pk</span>.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={async () => {
                await refreshFromSupabase();
                showToast('Status Checked', 'Checked database for verification updates.', 'info');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => navigate('home')}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={logout}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Verification Rejected Gate Screen
  if (verificationStatus === 'Rejected') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8 sm:p-10 space-y-7">
          <div className="flex items-center gap-4 border-b border-red-100 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-[#C62828] flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                Verification Ineligible
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Donor Account Status: Deferral / Ineligible</h1>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Dear <strong className="text-slate-900">{currentUser.name}</strong>, based on clinical review or medical screening criteria established by the Blood Donors Society UET, your donor profile could not be granted active verified status at this time.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Clinical Committee Notes:</span>
              <p className="italic text-slate-600">
                "Clinical deferral recorded: Hemoglobin or clinical safety parameters require evaluation. Recommended re-screening after 6 months or submission of an official medical fitness certificate."
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Donating blood requires meeting essential health baselines (e.g. minimum weight of 50 kg, adequate hemoglobin, and clearance of infectious screen markers). A clinical deferral is intended for your own wellbeing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Questions or Medical Appeal?</span>
              <p className="text-slate-600">
                Visit the BDS Health & Volunteer Desk at <strong>UET Narowal Health Center</strong> or contact the President / Medical Coordinator at <strong className="text-[#C62828] font-mono">+92 312 9901842</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => navigate('contact')}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Contact BDS Committee
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('home')}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={logout}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VERIFIED DONOR DASHBOARD STATE & CALCULATIONS ---
  const activeDonor = donorProfile!;

  // 1. Clinical safety & recovery window calculation (90-day whole blood interval)
  const clinicalEligibility = useMemo(() => {
    if (!activeDonor.lastDonationDate) {
      return {
        isEligible: true,
        daysRemaining: 0,
        nextEligibleDate: 'Immediately',
        status: 'Eligible',
        note: 'No recent donation on record. You are eligible to donate whole blood.',
      };
    }
    const lastDate = new Date(activeDonor.lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 90);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        isEligible: true,
        daysRemaining: 0,
        nextEligibleDate: 'Eligible Now',
        status: 'Eligible',
        note: 'Your 90-day clinical recovery cycle is complete. You may donate once pre-donation screening is verified.',
      };
    }
    return {
      isEligible: false,
      daysRemaining: diffDays,
      nextEligibleDate: nextDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'In Recovery Window',
      note: `You must wait ${diffDays} day(s) before donating again. Follow the guidelines confirmed by the BDS clinical team.`,
    };
  }, [activeDonor.lastDonationDate]);

  // 2. Verified Donation Records for this donor
  const myDonations = useMemo(() => {
    return donationRecords.filter(
      (r) =>
        r.donorId === activeDonor.id ||
        r.donorId === currentUser.donorProfileId ||
        r.donorId === currentUser.id
    );
  }, [donationRecords, activeDonor.id, currentUser]);

  const verifiedDonationCount = useMemo(() => {
    const verifiedFromRecords = myDonations
      .filter((r) => r.verificationStatus === 'Verified')
      .reduce((sum, r) => sum + (r.units || 1), 0);
    return Math.max(verifiedFromRecords, activeDonor.donationCount || 0);
  }, [myDonations, activeDonor.donationCount]);

  // Estimated impact calculation: 1 whole blood unit touches up to 3 lives
  const estimatedLivesTouched = verifiedDonationCount * 3;

  // Formatted last donation date
  const formattedLastDonation = useMemo(() => {
    if (!activeDonor.lastDonationDate) return 'None on record';
    try {
      const d = new Date(activeDonor.lastDonationDate);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return activeDonor.lastDonationDate;
    }
  }, [activeDonor.lastDonationDate]);

  // Matching urgent blood requests (compatible blood group matching)
  const matchingRequests = useMemo(() => {
    return requests.filter((r) => {
      if (r.status === 'Completed' || r.status === 'Donation Confirmed') return false;
      const isDirectMatch = r.bloodGroup === activeDonor.bloodGroup;
      const isUniversalDonor = activeDonor.bloodGroup === 'O-';
      return isDirectMatch || isUniversalDonor;
    });
  }, [requests, activeDonor.bloodGroup]);

  // Filtered requests for the Requests tab
  const filteredMatchingRequests = useMemo(() => {
    if (requestUrgencyFilter === 'All') return matchingRequests;
    return matchingRequests.filter((r) => r.urgency === requestUrgencyFilter);
  }, [matchingRequests, requestUrgencyFilter]);

  // Filtered donations for History tab
  const filteredHistory = useMemo(() => {
    return myDonations.filter((r) => {
      const matchSearch =
        r.hospitalOrVenue.toLowerCase().includes(historySearch.toLowerCase()) ||
        r.id.toLowerCase().includes(historySearch.toLowerCase()) ||
        (r.certificateId && r.certificateId.toLowerCase().includes(historySearch.toLowerCase()));
      const matchStatus =
        historyStatusFilter === 'All' ? true : r.verificationStatus === historyStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [myDonations, historySearch, historyStatusFilter]);

  // Availability handlers
  const handleSelectAvailability = async (status: DonorAvailability) => {
    setIsSavingAvailability(true);
    try {
      if (updateDonorAvailability) {
        await updateDonorAvailability(activeDonor.id, status, activeDonor.emergencyAvailable);
      }
    } catch {
      showToast('Error', 'Failed to update availability status. Please retry.', 'error');
    } finally {
      setIsSavingAvailability(false);
    }
  };

  const handleTogglePriorityAlerts = async () => {
    const nextVal = !activeDonor.emergencyAvailable;
    setIsSavingAvailability(true);
    try {
      if (updateDonorAvailability) {
        await updateDonorAvailability(activeDonor.id, activeDonor.availabilityStatus, nextVal);
      }
    } catch {
      showToast('Error', 'Failed to update emergency alerts setting.', 'error');
    } finally {
      setIsSavingAvailability(false);
    }
  };

  // Submit new donation record
  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospital.trim()) {
      showToast('Validation Error', 'Please specify the hospital or venue name.', 'error');
      return;
    }
    const recordPayload = {
      donorId: activeDonor.id,
      donationDate: newDonationDate,
      hospitalOrVenue: newHospital.trim(),
      donationType: newDonationType,
      units: Number(newUnits) || 1,
      verificationStatus: 'Pending' as const,
      certificateId: newCertId.trim() || `DON-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: newNotes.trim() || 'Logged via Verified Donor Dashboard for BDS clinical review',
    };

    await addDonationRecord(recordPayload);
    setLogDonationModalOpen(false);
    setNewNotes('');
    setNewCertId('');
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateDonorProfile(activeDonor.id, {
        phone: profilePhone.trim(),
        whatsapp: profileAltPhone.trim(),
        campus: profileCampus.trim(),
        department: profileDepartment.trim(),
        studentBatch: profileBatch.trim(),
        city: profileCity.trim(),
        area: profileArea.trim(),
      });
    } catch {
      showToast('Error', 'Failed to update profile details.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Tab Titles
  const tabTitles: Record<DashboardTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Donor Overview',
      subtitle: `Welcome back, ${activeDonor.name.split(' ')[0]}`,
    },
    requests: {
      title: 'Blood Requests & Urgent Matches',
      subtitle: `${matchingRequests.length} emergency requests matching your blood group (${activeDonor.bloodGroup})`,
    },
    history: {
      title: 'Donation History',
      subtitle: 'Verified records and clinical documentation',
    },
    drives: {
      title: 'Blood Drives & Campus Events',
      subtitle: 'Upcoming community collection campaigns at UET',
    },
    notifications: {
      title: 'Notifications & Alerts',
      subtitle: 'Live alerts, emergency calls, and drive announcements',
    },
    profile: {
      title: 'My Donor Profile',
      subtitle: 'Manage your verified contact info and campus details',
    },
    settings: {
      title: 'Account Settings',
      subtitle: 'Privacy, emergency dispatch preferences, and security',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900" id="bds-verified-donor-dashboard">
      {/* ========================================================
          A. FIXED / STICKY LEFT SIDEBAR (DESKTOP)
      ======================================================== */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/90 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full p-0.5 bg-white border border-slate-200 shadow-sm shrink-0 overflow-hidden">
            <img src={bdsLogoImg} alt="BDS UET Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              Blood Donors Society
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider">UET Narowal</span>
              <span className="text-[10px] bg-red-100 text-[#7F1D1D] font-extrabold px-1.5 py-0.2 rounded">PORTAL</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Donor navigation">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            {
              id: 'requests',
              label: 'Blood Requests',
              icon: Droplet,
              badge: matchingRequests.length > 0 ? matchingRequests.length : undefined,
            },
            { id: 'history', label: 'Donation History', icon: History },
            { id: 'drives', label: 'Blood Drives & Events', icon: Megaphone },
            {
              id: 'notifications',
              label: 'Notifications',
              icon: Bell,
              badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
            },
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as DashboardTab)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-red-50 text-[#C62828] border-r-4 border-[#C62828] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C62828]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#C62828] text-white' : 'bg-red-100 text-[#7F1D1D]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Donor Info Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C62828] to-[#7F1D1D] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
              {activeDonor.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-900 truncate block">{activeDonor.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Verified Donor</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors border border-slate-200/80 bg-white"
            id="donor-sidebar-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER
      ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                  <img src={bdsLogoImg} alt="BDS Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-none">BDS UET</h3>
                  <span className="text-[10px] text-[#C62828] font-bold">Donor Portal</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                {
                  id: 'requests',
                  label: 'Blood Requests',
                  icon: Droplet,
                  badge: matchingRequests.length > 0 ? matchingRequests.length : undefined,
                },
                { id: 'history', label: 'Donation History', icon: History },
                { id: 'drives', label: 'Blood Drives & Events', icon: Megaphone },
                {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: Bell,
                  badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
                },
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as DashboardTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-red-50 text-[#C62828] border-r-4 border-[#C62828]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#C62828]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#7F1D1D]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT AREA (SCROLLABLE)
      ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ========================================================
            B. TOP NAVIGATION BAR
        ======================================================== */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {tabTitles[activeTab].title}
              </h1>
              <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                {tabTitles[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell with Badge */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              aria-label="Notifications"
              id="topbar-notifications-btn"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C62828] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left"
                id="topbar-profile-dropdown-btn"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C62828] to-[#7F1D1D] text-white font-black text-xs flex items-center justify-center shadow-2xs">
                  {activeDonor.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{activeDonor.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">ID: {activeDonor.id.toUpperCase()}</span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{activeDonor.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{activeDonor.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Blood Donor</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Update Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================
            TAB 1: OVERVIEW PAGE
        ======================================================== */}
        {activeTab === 'overview' && (
          <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* 4. DASHBOARD WELCOME & DONOR METRICS HEADER (UNBOXED / NOT A CARD) */}
            <div className="pb-6 border-b border-slate-200/80">
              {/* Header and Quick Actions */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back, {activeDonor.name}!
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Donor</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Your willingness to donate can make a real difference. Thank you for being part of BDS UET.
                  </p>

                  {/* Donor Information Row */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Donor ID: </span>
                      <strong className="font-mono text-slate-900">{activeDonor.id.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Location: </span>
                      <strong className="text-slate-900">{activeDonor.campus || 'UET Narowal Campus'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Blood Group: </span>
                      <strong className="text-[#C62828] font-black">{activeDonor.bloodGroup}</strong>
                    </div>
                  </div>
                </div>

                {/* Right side: Stats in text form + Log New Donation button */}
                <div className="flex flex-col items-start lg:items-end gap-3.5 shrink-0 w-full sm:w-auto">
                  {/* Stats in text form matching reference image */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="text-left sm:text-right">
                      <div className="font-semibold text-slate-800 leading-tight">
                        Total Donations: <span className="font-black text-slate-900">{verifiedDonationCount}</span>
                      </div>
                      <div className="font-bold text-[#B4232C] text-xs">Units</div>
                    </div>

                    <span className="text-slate-400 font-black text-base select-none leading-none">•</span>

                    <div className="text-left">
                      <div className="font-semibold text-slate-800 leading-tight">Lives</div>
                      <div className="leading-tight">
                        <span className="font-semibold text-slate-800">Touched: </span>
                        <span className="font-black text-emerald-600">~{estimatedLivesTouched}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setLogDonationModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs bg-[#B4232C] hover:bg-[#8F1D22] text-white shadow-sm transition-all"
                      id="welcome-log-donation-btn"
                    >
                      <Heart className="w-5 h-5 fill-white text-white shrink-0" />
                      <span className="text-left leading-tight">
                        Log New<br />Donation
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO-COLUMN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: 7. AVAILABILITY CONTROLS & 8. CLINICAL SAFETY */}
              <div className="lg:col-span-5 space-y-8">
                {/* 7. DONOR AVAILABILITY CONTROLS */}
                <div
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6"
                  id="availability-controls-card"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-extrabold text-slate-900">Your Availability</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Keep your availability updated so the BDS team can contact you when needed.
                    </p>
                  </div>

                  {/* 4 Selectable Status Options */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Select Current Status
                    </label>

                    {[
                      {
                        status: 'Available' as DonorAvailability,
                        color: 'emerald',
                        dotBg: 'bg-emerald-500',
                        label: 'AVAILABLE',
                        desc: 'Willing to be contacted about suitable donation opportunities.',
                      },
                      {
                        status: 'Busy' as DonorAvailability,
                        color: 'amber',
                        dotBg: 'bg-amber-500',
                        label: 'BUSY',
                        desc: 'Temporarily unavailable (exams, travel, personal commitments).',
                      },
                      {
                        status: 'On Break' as DonorAvailability,
                        color: 'blue',
                        dotBg: 'bg-blue-500',
                        label: 'ON BREAK',
                        desc: 'Taking a temporary break from donation notifications.',
                      },
                      {
                        status: 'Emergency On-Call' as DonorAvailability,
                        color: 'red',
                        dotBg: 'bg-[#C62828]',
                        label: 'EMERGENCY ON-CALL',
                        desc: 'Explicitly opt in to priority emergency notifications, subject to consent.',
                      },
                    ].map((opt) => {
                      const isSelected = activeDonor.availabilityStatus === opt.status;
                      return (
                        <button
                          key={opt.status}
                          disabled={isSavingAvailability}
                          onClick={() => handleSelectAvailability(opt.status)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-[#C62828] bg-red-50/70 shadow-2xs ring-1 ring-[#C62828]/20'
                              : 'border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${opt.dotBg}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-extrabold ${
                                  isSelected ? 'text-[#C62828]' : 'text-slate-900'
                                }`}
                              >
                                {opt.label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-[#C62828]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Priority Hospital Alerts Toggle */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        Receive Priority Hospital Alerts
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Allow BDS to notify you about urgent blood requests that may match your blood group and location.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSavingAvailability}
                      onClick={handleTogglePriorityAlerts}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeDonor.emergencyAvailable ? 'bg-[#C62828]' : 'bg-slate-300'
                      }`}
                      aria-label="Toggle Priority Hospital Alerts"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          activeDonor.emergencyAvailable ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Safety & Consent Disclaimer */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Clinical Safety Note</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Availability does not guarantee medical eligibility to donate. Emergency notifications strictly respect donor consent, verified blood group, clinical recovery intervals, and privacy settings.
                    </p>
                  </div>
                </div>

                {/* 8. CLINICAL SAFETY AND DONATION ELIGIBILITY */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Safety</span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Donation Eligibility</h3>
                    </div>
                    <Calendar className="w-5 h-5 text-[#C62828]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Donation</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{formattedLastDonation}</p>
                      <span className="text-[10px] text-slate-500">Whole Blood</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Eligible Donation</span>
                      <p className="text-xs font-bold text-[#C62828] mt-1">{clinicalEligibility.nextEligibleDate}</p>
                      <span className="text-[10px] text-slate-500">90-day recovery cycle</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border space-y-1.5 transition-colors bg-white">
                    <div className="flex items-center gap-2">
                      {clinicalEligibility.isEligible ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-extrabold text-emerald-800">
                            Status: Eligible to Donate
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-xs font-extrabold text-amber-800">
                            Status: In Recovery Window ({clinicalEligibility.daysRemaining} days left)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{clinicalEligibility.note}</p>
                  </div>

                  <button
                    onClick={() => setLogDonationModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
                    id="log-donation-overview-btn"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Log a Completed Donation</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 9. URGENT BLOOD MATCHES & RECENT PREVIEWS */}
              <div className="lg:col-span-7 space-y-8">
                {/* 9. URGENT BLOOD MATCHES */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828]">
                        Compatibility Matches
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                        Urgent Requests Matching Your Blood Group
                      </h3>
                    </div>
                    <span className="text-xs bg-red-100 text-[#7F1D1D] font-extrabold px-2.5 py-1 rounded-full">
                      {matchingRequests.length} Active Case(s)
                    </span>
                  </div>

                  {matchingRequests.length === 0 ? (
                    <div className="p-8 text-center space-y-3 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="w-12 h-12 rounded-full bg-red-50 text-[#C62828] flex items-center justify-center mx-auto">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">No Emergency Matches Right Now</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        There are currently no open critical blood requests matching blood group {activeDonor.bloodGroup} in your area. You are currently on standby to save lives!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {matchingRequests.slice(0, 3).map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-[#C62828]/40 transition-all shadow-2xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <BloodGroupBadge group={req.bloodGroup} size="sm" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-extrabold text-slate-900">
                                    Patient: {req.patientName}
                                  </h4>
                                  <span
                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                      req.urgency === 'Critical'
                                        ? 'bg-red-100 text-[#7F1D1D] animate-pulse'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {req.urgency}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{req.hospital}</span> •{' '}
                                  <span className="font-bold text-slate-700">{req.unitsNeeded} unit(s) needed</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {req.id}</span>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                            <span className="text-[11px] text-slate-500 italic truncate max-w-xs">
                              {req.reasonForBlood || 'Urgent requirement verified by BDS coordinator'}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setSelectedRequestForDonate(req)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#C62828] hover:bg-[#7F1D1D] transition-colors shadow-2xs"
                              >
                                I Can Donate
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {matchingRequests.length > 3 && (
                        <button
                          onClick={() => setActiveTab('requests')}
                          className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:text-[#C62828] hover:border-[#C62828] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>View all {matchingRequests.length} matching requests</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* RECENT DONATION RECORDS PREVIEW */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Recent Donation History</h3>
                      <p className="text-xs text-slate-500">Verified donations saved to your donor ledger</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-bold text-[#C62828] hover:underline flex items-center gap-1"
                    >
                      <span>View All Records</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {myDonations.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">
                      No previous donation records found. Click "Log a Completed Donation" to add your historical donations.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {myDonations.slice(0, 3).map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{rec.hospitalOrVenue}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  rec.verificationStatus === 'Verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rec.verificationStatus}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {rec.donationDate} • {rec.donationType} • {rec.units} Unit(s)
                            </p>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 font-semibold">
                            {rec.certificateId || rec.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* UPCOMING CAMPUS BLOOD DRIVES PREVIEW */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Upcoming Campus Blood Drives</h3>
                      <p className="text-xs text-slate-500">Organized by BDS UET Narowal Executive Council</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('drives')}
                      className="text-xs font-bold text-[#C62828] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Drives</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {campaigns.slice(0, 2).map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#C62828] uppercase tracking-wider">
                          {camp.date} • {camp.startTime}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900">{camp.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{camp.venue}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('drives');
                        }}
                        className="py-1.5 px-3 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                      >
                        Book Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: BLOOD REQUESTS & URGENT MATCHES
        ======================================================== */}
        {activeTab === 'requests' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Urgent Blood Requests</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Filtered by compatibility for blood group <strong className="text-[#C62828]">{activeDonor.bloodGroup}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['All', 'Critical', 'Urgent'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRequestUrgencyFilter(filter)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                      requestUrgencyFilter === filter
                        ? 'bg-[#C62828] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredMatchingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#C62828] flex items-center justify-center mx-auto">
                  <Droplet className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Open Requests Under This Filter</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Great news! There are currently no active patient requests under the selected filter matching your blood group. Keep your availability active to be alerted when a match arrives.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMatchingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-[#C62828]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge group={req.bloodGroup} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900">{req.patientName}</h4>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  req.urgency === 'Critical'
                                    ? 'bg-red-100 text-[#7F1D1D] animate-pulse'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {req.urgency}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              ID: <span className="font-mono">{req.id}</span> • {req.campus}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#C62828] bg-red-50 px-2.5 py-1 rounded-lg">
                          {req.unitsNeeded} Unit(s)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
                          <span>{req.hospital}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Required by: <strong>{req.requiredDate}</strong> ({req.requiredTime})
                        </p>
                        {req.reasonForBlood && (
                          <p className="text-[11px] italic text-slate-600 pt-1 border-t border-slate-200/60">
                            Reason: {req.reasonForBlood}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRequestForDonate(req)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>I Can Donate</span>
                      </button>

                      <a
                        href="tel:+923129901842"
                        className="py-2 px-3 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Coordinator</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: DONATION HISTORY
        ======================================================== */}
        {activeTab === 'history' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Donation History & Ledger</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Track your lifetime contributions and submit recent donations for staff verification.
                </p>
              </div>

              <button
                onClick={() => setLogDonationModalOpen(true)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors flex items-center gap-2 shadow-xs"
                id="log-donation-history-tab-btn"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Log a Completed Donation</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hospital or certificate..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {(['All', 'Verified', 'Pending'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setHistoryStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                      historyStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              {filteredHistory.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No donation records match the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Hospital / Venue</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Units</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4">Certificate ID</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {rec.donationDate}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{rec.hospitalOrVenue}</td>
                          <td className="py-3.5 px-4 text-slate-600">{rec.donationType}</td>
                          <td className="py-3.5 px-4 font-extrabold text-[#C62828]">{rec.units} Unit(s)</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                rec.verificationStatus === 'Verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {rec.verificationStatus === 'Verified' ? (
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{rec.verificationStatus}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-bold">
                            {rec.certificateId || rec.id}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{rec.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: BLOOD DRIVES & EVENTS
        ======================================================== */}
        {activeTab === 'drives' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">Campus Blood Drives & Events</h2>
              <p className="text-xs text-slate-500">
                Join our university mobile camps to donate safely with verified medical teams and receive recognition certificates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-[#7F1D1D]">
                        {camp.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{camp.date}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-slate-900">{camp.title}</h3>
                      <p className="text-xs text-slate-600">{camp.subtitle}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C62828] shrink-0" />
                        <span className="font-bold text-slate-800">{camp.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {camp.startTime} - {camp.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Organizer: {camp.organizer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Target: <strong>{camp.targetUnits} Units</strong>
                    </span>
                    <button
                      onClick={async () => {
                        await registerForCampaign({
                          campaignId: camp.id,
                          campaignTitle: camp.title,
                          userName: activeDonor.name,
                          userEmail: activeDonor.email,
                          userPhone: activeDonor.phone,
                          bloodGroup: activeDonor.bloodGroup,
                          timeSlot: camp.timeSlots?.[0] || '10:00 AM - 12:00 PM',
                        });
                      }}
                      className="py-2 px-4 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors shadow-2xs"
                    >
                      Book Donation Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: NOTIFICATIONS
        ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Donor Notifications</h2>
                <p className="text-xs text-slate-500 mt-1">Live alerts and campus emergency broadcasts</p>
              </div>

              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-[#C62828] bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {notifications.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-500">You have no notifications at this time.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#C62828]" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: MY PROFILE
        ======================================================== */}
        {activeTab === 'profile' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Donor Profile Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your phone and campus location up to date so dispatch coordinators can reach you.
                </p>
              </div>

              {/* Locked Clinical Attributes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Clinically Locked Attributes
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Requires BDS Admin Approval to Change</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Full Legal Name</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{activeDonor.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Donor ID</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{activeDonor.id.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Verified Blood Group</span>
                    <p className="font-black text-[#C62828] mt-0.5 flex items-center gap-1.5">
                      <span>{activeDonor.bloodGroup}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Editable Fields Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Primary Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp / Emergency Phone
                    </label>
                    <input
                      type="tel"
                      value={profileAltPhone}
                      onChange={(e) => setProfileAltPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus</label>
                    <select
                      value={profileCampus}
                      onChange={(e) => setProfileCampus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none bg-white"
                    >
                      <option value="UET Narowal Campus">UET Narowal Campus</option>
                      <option value="UET Lahore Main Campus">UET Lahore Main Campus</option>
                      <option value="UET KSK Campus">UET KSK Campus</option>
                      <option value="UET Faisalabad Campus">UET Faisalabad Campus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                    <input
                      type="text"
                      value={profileDepartment}
                      onChange={(e) => setProfileDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Batch / Session</label>
                    <input
                      type="text"
                      value={profileBatch}
                      onChange={(e) => setProfileBatch(e.target.value)}
                      placeholder="e.g. 2022-2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Hostel Area</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors shadow-xs"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: SETTINGS
        ======================================================== */}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Donor Account Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Manage notification channels and account security</p>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Notification Channels</h3>
                <div className="space-y-2">
                  {[
                    { title: 'SMS Critical Dispatch Alerts', desc: 'Direct emergency SMS for verified patients in Narowal.' },
                    { title: 'WhatsApp Direct Notification', desc: 'Receive instant coordination calls via WhatsApp.' },
                    { title: 'Campus Blood Drive Reminders', desc: 'Updates about upcoming donation camps at UET.' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-[#C62828] rounded border-slate-300 focus:ring-[#C62828]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign Out Card */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-950 block">End Active Session</span>
                  <p className="text-[11px] text-slate-600">Securely sign out of the BDS verified portal.</p>
                </div>
                <button
                  onClick={logout}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: LOG A COMPLETED DONATION
      ======================================================== */}
      {logDonationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setLogDonationModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Log Completed Blood Donation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Submitted records enter pending status until verified by the BDS clinical committee.
              </p>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hospital or Venue Name *
                </label>
                <input
                  type="text"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  placeholder="e.g. DHQ Hospital Narowal, Sundas Foundation"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donation Date *</label>
                  <input
                    type="date"
                    value={newDonationDate}
                    onChange={(e) => setNewDonationDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Units Donated</label>
                  <select
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none bg-white"
                  >
                    <option value={1}>1 Unit (Standard Whole Blood)</option>
                    <option value={2}>2 Units (Double Red / Apheresis)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donation Type</label>
                <select
                  value={newDonationType}
                  onChange={(e) => setNewDonationType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none bg-white"
                >
                  <option value="Whole Blood">Whole Blood (Standard 90-day recovery)</option>
                  <option value="Platelets Apheresis">Platelets Apheresis</option>
                  <option value="Plasma">Plasma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Certificate / Receipt Reference (Optional)
                </label>
                <input
                  type="text"
                  value={newCertId}
                  onChange={(e) => setNewCertId(e.target.value)}
                  placeholder="e.g. DHQ-2026-9812"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Donated for emergency leukemia patient under BDS coordination"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLogDonationModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors shadow-xs"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: RESPOND TO BLOOD REQUEST (I CAN DONATE)
      ======================================================== */}
      {selectedRequestForDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedRequestForDonate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Confirm Donation Response</h3>
                <p className="text-xs text-slate-500">Case ID: {selectedRequestForDonate.id}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <strong className="text-slate-900">{selectedRequestForDonate.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Required Group:</span>
                <strong className="text-[#C62828] font-bold">{selectedRequestForDonate.bloodGroup}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <strong className="text-slate-900">{selectedRequestForDonate.hospital}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency:</span>
                <strong className="text-red-700 font-bold">{selectedRequestForDonate.urgency}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[#C62828] block">BDS Emergency Protocol:</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                By responding, your availability will be flagged for the emergency coordinator. Please confirm you are healthy, non-fasting, and can arrive at {selectedRequestForDonate.hospital} within the required time.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <a
                href="tel:+923129901842"
                className="py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hotline</span>
              </a>

              <button
                onClick={() => {
                  showToast(
                    'Response Sent!',
                    `Emergency Coordinator has been alerted that you are ready to donate for ${selectedRequestForDonate.patientName}.`,
                    'success'
                  );
                  setSelectedRequestForDonate(null);
                }}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors shadow-xs"
              >
                Confirm: I Am Ready to Donate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================
          MODAL: DIGITAL DONOR CARD
      ======================================================== */}
      {digitalCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setDigitalCardModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Card Header with BDS Brand Gradient */}
            <div className="bg-gradient-to-br from-[#7F1D1D] via-[#991B1B] to-[#C62828] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex items-center gap-3.5 relative z-10">
                <img
                  src={bdsLogoImg}
                  alt="BDS Logo"
                  className="w-12 h-12 rounded-full bg-white p-1 shadow-md object-contain shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-red-200 block">
                    BLOOD DONORS SOCIETY UET
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight">Verified Digital Donor Card</h3>
                  <span className="text-[10px] text-red-100/90 font-mono">BDS CLINICAL VERIFICATION LEDGER</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-5 bg-white">
              {/* Donor Core Identity & Blood Group */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Donor</span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{activeDonor.name}</h4>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs font-mono font-bold text-slate-600">ID: {activeDonor.id.toUpperCase()}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Big Blood Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C62828] to-[#7F1D1D] text-white flex flex-col items-center justify-center shadow-md shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 leading-none">BLOOD</span>
                  <span className="text-2xl font-black leading-none mt-0.5">{activeDonor.bloodGroup}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Campus</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate block">{activeDonor.campus || 'UET Narowal'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate block">{activeDonor.department || 'Computer Science'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Donations</span>
                  <span className="font-black text-[#C62828] text-sm block">{verifiedDonationCount} Units</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lives Impacted</span>
                  <span className="font-black text-emerald-600 text-sm block">~{estimatedLivesTouched} Lives</span>
                </div>
              </div>

              {/* QR Verification Code Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                    <QrCode className="w-4 h-4" />
                    <span>Quick Scan Verification</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Scan by hospital coordinators & BDS field volunteers to authenticate donor dispatch.
                  </p>
                </div>
                <div className="w-16 h-16 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Donor Card Saved', 'Your digital donor credential has been prepared for offline presentation.', 'success');
                    setDigitalCardModalOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#C62828] hover:bg-[#7F1D1D] text-white shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Save / Print Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDigitalCardModalOpen(false)}
                  className="py-3 px-5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
