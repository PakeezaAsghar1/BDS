import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  BloodGroup,
  DonorAvailability,
  BloodRequest,
  RequestStatus,
  UrgencyLevel,
  Donor,
  DonationRecord
} from '../../types';
import { COMPATIBILITY_DATA, UET_CAMPUSES, MAJOR_HOSPITALS } from '../../data/mockData';
import bdsLogoImg from '../../assets/images/bds_logo.png';
import {
  Users,
  Droplet,
  Heart,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  Mail,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Radio,
  Megaphone,
  UserCheck,
  LayoutDashboard,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FileText,
  Award,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Check,
  Lock,
  ArrowRight,
  GraduationCap,
  Building2,
  FileCheck,
  Activity,
  HeartHandshake
} from 'lucide-react';

type TeamTab =
  | 'overview'
  | 'requests'
  | 'donors'
  | 'drives'
  | 'verifications'
  | 'volunteers'
  | 'notifications'
  | 'profile'
  | 'settings';

export const TeamDashboard: React.FC = () => {
  const {
    currentUser,
    donors,
    requests,
    campaigns,
    volunteers,
    donationRecords,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    updateRequestStatus,
    addBloodRequest,
    matchDonorsToRequest,
    addDonationRecord,
    createCampaign,
    showToast,
    refreshFromSupabase,
    logout,
    navigate,
  } = useApp();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TeamTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fallback Coordinator data
  const coordinatorInfo = useMemo(() => {
    return {
      id: currentUser?.id || 'BDS-COORD-2026',
      name: currentUser?.name || 'Fatima Noor',
      email: currentUser?.email || 'coordinator.emergency@narowal.uet.edu.pk',
      phone: currentUser?.phone || '+92 321 4458921',
      role: 'BDS Senior Emergency Coordinator',
      campus: currentUser?.campus || 'UET Narowal Campus',
      department: currentUser?.department || 'Computer Science, UET Narowal',
      station: 'Emergency Dispatch & Hospital Liaison Desk',
      shiftStatus: 'On Duty • 24/7 Hotline Active',
    };
  }, [currentUser]);

  // Modals state
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedRequestForDispatch, setSelectedRequestForDispatch] = useState<BloodRequest | null>(null);
  const [verifyDonationModalOpen, setVerifyDonationModalOpen] = useState(false);
  const [selectedDonationForVerification, setSelectedDonationForVerification] = useState<DonationRecord | null>(null);
  const [newCampModalOpen, setNewCampModalOpen] = useState(false);
  const [contactDonorModalOpen, setContactDonorModalOpen] = useState(false);
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<Donor | null>(null);

  // Filters for Requests tab
  const [requestSearch, setRequestSearch] = useState('');
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState<'All' | UrgencyLevel>('All');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'All' | RequestStatus>('All');

  // Filters for Donors tab
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState<'All' | BloodGroup>('All');
  const [donorAvailabilityFilter, setDonorAvailabilityFilter] = useState<'All' | DonorAvailability>('All');
  const [donorCampusFilter, setDonorCampusFilter] = useState<'All' | string>('All');
  const [compatibilityCheckGroup, setCompatibilityCheckGroup] = useState<BloodGroup | 'None'>('None');

  // New Request Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('32');
  const [newRequesterName, setNewRequesterName] = useState('');
  const [newRequesterPhone, setNewRequesterPhone] = useState('');
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>('O-');
  const [newUnits, setNewUnits] = useState(2);
  const [newHospital, setNewHospital] = useState(MAJOR_HOSPITALS[0]);
  const [newHospitalCity, setNewHospitalCity] = useState('Narowal');
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>('Critical');
  const [newRequiredDate, setNewRequiredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newRequiredTime, setNewRequiredTime] = useState('Immediate (Emergency Ward)');
  const [newCaseDesc, setNewCaseDesc] = useState('Trauma surgery patient, immediate units required.');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // New Blood Camp Form State
  const [campTitle, setCampTitle] = useState('');
  const [campVenue, setCampVenue] = useState('Main Auditorium Hall, Admin Block');
  const [campDate, setCampDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [campTargetUnits, setCampTargetUnits] = useState(150);
  const [campDescription, setCampDescription] = useState('');
  const [isSubmittingCamp, setIsSubmittingCamp] = useState(false);

  // Verification Form State
  const [verificationNotes, setVerificationNotes] = useState('Cross-checked with hospital transfusion record.');
  const [customCertificateId, setCustomCertificateId] = useState('');

  // Filtered Blood Requests
  const filteredRequests = useMemo(() => {
    return (requests || []).filter((r) => {
      const pName = (r.patientName || '').toLowerCase();
      const code = (r.requestCode || '').toLowerCase();
      const hosp = (r.hospitalName || '').toLowerCase();
      const city = (r.hospitalCity || '').toLowerCase();
      const query = (requestSearch || '').toLowerCase();

      const matchSearch =
        pName.includes(query) || code.includes(query) || hosp.includes(query) || city.includes(query);
      const matchUrgency = requestUrgencyFilter === 'All' ? true : r.urgency === requestUrgencyFilter;
      const matchStatus = requestStatusFilter === 'All' ? true : r.status === requestStatusFilter;
      return matchSearch && matchUrgency && matchStatus;
    });
  }, [requests, requestSearch, requestUrgencyFilter, requestStatusFilter]);

  // Critical Requests Count
  const criticalRequests = useMemo(() => {
    return (requests || []).filter(
      (r) =>
        r.urgency === 'Critical' &&
        r.status !== 'Completed' &&
        r.status !== 'Donation Confirmed' &&
        r.status !== 'Cancelled'
    );
  }, [requests]);

  // Active Emergency Requests
  const activeRequests = useMemo(() => {
    return (requests || []).filter(
      (r) => r.status !== 'Completed' && r.status !== 'Cancelled' && r.status !== 'Donation Confirmed'
    );
  }, [requests]);

  // Available Donors Count
  const availableDonors = useMemo(() => {
    return (donors || []).filter((d) => d.availabilityStatus === 'Available');
  }, [donors]);

  // Pending Donations Verification Queue
  const pendingDonationRecords = useMemo(() => {
    return (donationRecords || []).filter((d) => d.verificationStatus === 'Pending');
  }, [donationRecords]);

  // Filtered Donors for Directory
  const filteredDonors = useMemo(() => {
    return (donors || []).filter((d) => {
      const name = (d.name || '').toLowerCase();
      const phone = d.phone || '';
      const dept = (d.department || '').toLowerCase();
      const area = (d.area || '').toLowerCase();
      const id = (d.id || '').toLowerCase();
      const query = (donorSearch || '').toLowerCase();

      const matchSearch =
        name.includes(query) ||
        phone.includes(query) ||
        dept.includes(query) ||
        area.includes(query) ||
        id.includes(query);

      const matchGroup = donorGroupFilter === 'All' ? true : d.bloodGroup === donorGroupFilter;
      const matchAvail =
        donorAvailabilityFilter === 'All' ? true : d.availabilityStatus === donorAvailabilityFilter;
      const matchCampus = donorCampusFilter === 'All' ? true : d.campus === donorCampusFilter;

      // Compatibility check logic
      let matchCompatibility = true;
      if (compatibilityCheckGroup !== 'None') {
        const acceptableGroups = COMPATIBILITY_DATA[compatibilityCheckGroup]?.canReceiveFrom || [];
        matchCompatibility = acceptableGroups.includes(d.bloodGroup);
      }

      return matchSearch && matchGroup && matchAvail && matchCampus && matchCompatibility;
    });
  }, [
    donors,
    donorSearch,
    donorGroupFilter,
    donorAvailabilityFilter,
    donorCampusFilter,
    compatibilityCheckGroup,
  ]);

  // Handle Refresh from Supabase
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshFromSupabase();
      showToast('Data Synchronized', 'Emergency requests and donor database up to date.', 'info');
    } catch {
      showToast('Sync Failed', 'Could not refresh remote data. Displaying cached records.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Submit New Emergency Blood Request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newRequesterPhone.trim()) {
      showToast('Validation Error', 'Please enter patient name and contact phone.', 'error');
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const newReq = await addBloodRequest({
        patientName: newPatientName.trim(),
        patientAge: parseInt(newPatientAge, 10) || 30,
        requesterName: newRequesterName.trim() || 'Attendant',
        requesterPhone: newRequesterPhone.trim(),
        bloodGroup: newBloodGroup,
        unitsRequired: newUnits,
        hospitalName: newHospital,
        hospitalCity: newHospitalCity,
        hospitalCampusArea: 'Narowal District',
        urgency: newUrgency,
        requiredDate: newRequiredDate,
        requiredTime: newRequiredTime,
        caseDescription: newCaseDesc,
        status: 'Donor Search Active',
        assignedCoordinatorId: coordinatorInfo.id,
        assignedCoordinatorName: coordinatorInfo.name,
      });

      showToast(
        'Emergency Request Dispatched',
        `Request ${newReq.requestCode} logged. Matching ${newBloodGroup} donors found.`,
        'success'
      );
      setNewRequestModalOpen(false);
      // Reset
      setNewPatientName('');
      setNewRequesterPhone('');
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to dispatch request.', 'error');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Handle Verifying a Donation Record
  const handleVerifyDonation = async (record: DonationRecord) => {
    const cert =
      customCertificateId.trim() ||
      `BDS-CERT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      await addDonationRecord({
        ...record,
        verificationStatus: 'Verified',
        verifiedBy: `${coordinatorInfo.name} (BDS Coordinator)`,
        verifiedAt: new Date().toISOString(),
        certificateId: cert,
        notes: verificationNotes || record.notes,
      });

      showToast(
        'Donation Verified',
        `Official Certificate ${cert} issued for donor ${record.donorId.toUpperCase()}.`,
        'success'
      );
      setVerifyDonationModalOpen(false);
      setSelectedDonationForVerification(null);
    } catch {
      showToast('Verification Failed', 'Failed to update record in database.', 'error');
    }
  };

  // Generate WhatsApp message for donor dispatch
  const generateWhatsAppUrl = (phone: string, request: BloodRequest) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = `Assalam-o-Alaikum! BDS UET Narowal Emergency Dispatch Desk here. Critical request for ${request.bloodGroup} blood at ${request.hospitalName} (${request.unitsRequired} units needed). Are you available to save a life today? Please reply ASAP or call our emergency desk at +92 312 9901842. Case ID: ${request.requestCode}`;
    return `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900" id="bds-team-dashboard">
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
              <span className="text-[10px] bg-blue-100 text-blue-900 font-extrabold px-1.5 py-0.2 rounded">TEAM</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Team coordinator navigation">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            {
              id: 'requests',
              label: 'Blood Requests',
              icon: Droplet,
              badge: activeRequests.length > 0 ? activeRequests.length : undefined,
              badgeColor: criticalRequests.length > 0 ? 'bg-red-600 text-white' : undefined,
            },
            {
              id: 'donors',
              label: 'Donors Directory',
              icon: Users,
              badge: donors.length > 0 ? donors.length : undefined,
            },
            {
              id: 'drives',
              label: 'Blood Drives & Camps',
              icon: Megaphone,
              badge: campaigns.length > 0 ? campaigns.length : undefined,
            },
            {
              id: 'verifications',
              label: 'Donation Verifications',
              icon: FileCheck,
              badge: pendingDonationRecords.length > 0 ? pendingDonationRecords.length : undefined,
              badgeColor: 'bg-amber-500 text-white',
            },
            { id: 'volunteers', label: 'Volunteer Team', icon: HeartHandshake },
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
                onClick={() => setActiveTab(item.id as TeamTab)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-red-50 text-[#C62828] border-r-4 border-[#C62828] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id={`team-sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C62828]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-[#C62828] text-white' : 'bg-red-100 text-[#7F1D1D]')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Coordinator Profile Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
              {coordinatorInfo.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-900 truncate block">{coordinatorInfo.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-700 font-bold mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>BDS Coordinator</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors border border-slate-200/80 bg-white"
            id="team-sidebar-logout-btn"
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
                  <span className="text-[10px] text-blue-700 font-bold">Team Coordinator Desk</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
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
                  badge: activeRequests.length > 0 ? activeRequests.length : undefined,
                },
                { id: 'donors', label: 'Donors Directory', icon: Users, badge: donors.length },
                { id: 'drives', label: 'Blood Drives & Camps', icon: Megaphone },
                {
                  id: 'verifications',
                  label: 'Donation Verifications',
                  icon: FileCheck,
                  badge: pendingDonationRecords.length > 0 ? pendingDonationRecords.length : undefined,
                },
                { id: 'volunteers', label: 'Volunteer Team', icon: HeartHandshake },
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
                      setActiveTab(item.id as TeamTab);
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
                onClick={logout}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          B. MAIN CONTENT AREA
      ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Unauthenticated / Demo Notice */}
        {!currentUser && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 sm:px-8 py-2 text-xs flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Mode:</strong> You are exploring the BDS Team Dispatch Console with sample coordinator data.
              </span>
            </div>
            <button
              onClick={() => navigate('login')}
              className="font-bold underline text-amber-900 hover:text-black ml-3 shrink-0"
            >
              Sign In with Team ID
            </button>
          </div>
        )}

        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {activeTab === 'overview' && 'Team Dispatch Overview'}
                  {activeTab === 'requests' && 'Emergency Blood Requests'}
                  {activeTab === 'donors' && 'Campus Donors Directory'}
                  {activeTab === 'drives' && 'Blood Drives & Camps'}
                  {activeTab === 'verifications' && 'Donation Verification Desk'}
                  {activeTab === 'volunteers' && 'Volunteer Coordination'}
                  {activeTab === 'notifications' && 'Emergency Broadcasts'}
                  {activeTab === 'profile' && 'Coordinator Profile'}
                  {activeTab === 'settings' && 'Team Portal Settings'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Dispatcher Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                BDS UET Narowal • Emergency Dispatch & Clinical Liaison Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sync / Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#C62828]' : ''}`} />
            </button>



            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C62828] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Emergency Alerts</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-[#C62828] font-bold hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifDropdownOpen(false);
                          setActiveTab('notifications');
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer ${
                          !n.read ? 'bg-red-50/40 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        <p className="text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-900 text-white font-black text-xs flex items-center justify-center">
                  {coordinatorInfo.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{coordinatorInfo.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{coordinatorInfo.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-900">
                      BDS COORDINATOR
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('home');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Return to Website</span>
                  </button>
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
            TAB 1: TEAM OVERVIEW PAGE
        ======================================================== */}
        {activeTab === 'overview' && (
          <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* 1. DASHBOARD WELCOME & STATS (UNBOXED / NOT A CARD) */}
            <div className="pb-6 border-b border-slate-200/80">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back, {coordinatorInfo.name}!
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200/80 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>BDS Team Coordinator</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Coordinate live blood requests, mobilize university donors, and verify hospital transfusions across Narowal.
                  </p>

                  {/* Coordinator Information Row */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Coordinator ID: </span>
                      <strong className="font-mono text-slate-900">BDS-COORD-2026</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Station: </span>
                      <strong className="text-slate-900">{coordinatorInfo.campus}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Hotline Status: </span>
                      <strong className="text-emerald-700 font-bold inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        24/7 Helpline Active
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right side: Stats in text form + Quick Action buttons */}
                <div className="flex flex-col items-start lg:items-end gap-3.5 shrink-0 w-full sm:w-auto">
                  {/* Stats in text form matching donor dashboard format */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="text-left sm:text-right">
                      <div className="font-semibold text-slate-800 leading-tight">
                        Active Emergencies: <span className="font-black text-[#B4232C]">{criticalRequests.length}</span>
                      </div>
                      <div className="font-bold text-[#B4232C] text-xs">Critical Cases</div>
                    </div>

                    <span className="text-slate-400 font-black text-base select-none leading-none">•</span>

                    <div className="text-left">
                      <div className="font-semibold text-slate-800 leading-tight">Campus Donors</div>
                      <div className="leading-tight">
                        <span className="font-semibold text-slate-800">Available: </span>
                        <span className="font-black text-emerald-600">{availableDonors.length} Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('donors')}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-[#0F172A] hover:bg-slate-800 text-white shadow-sm transition-all"
                    >
                      <Users className="w-4 h-4 shrink-0 text-white" />
                      <span>Find Donor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewRequestModalOpen(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-[#B4232C] hover:bg-[#8F1D22] text-white shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4 shrink-0 fill-white" />
                      <span>Log Request</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO-COLUMN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Live Emergency Requests Board */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-[#C62828]" />
                        <span>Live Emergency Blood Cases</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Urgent transfusion requirements needing immediate donor pairing
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs font-bold text-[#C62828] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({requests.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeRequests.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                      No active blood requests currently pending. All cases fulfilled.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {activeRequests.slice(0, 4).map((req) => {
                        const matchingDonors = (donors || []).filter(
                          (d) =>
                            d.availabilityStatus === 'Available' &&
                            Boolean(COMPATIBILITY_DATA[req.bloodGroup]?.canReceiveFrom?.includes(d.bloodGroup))
                        );

                        return (
                          <div
                            key={req.id}
                            className={`p-4 rounded-xl border transition-all ${
                              req.urgency === 'Critical'
                                ? 'border-red-200 bg-red-50/30'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <BloodGroupBadge bloodGroup={req.bloodGroup} size="lg" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-slate-900">{req.patientName}</h4>
                                    <span
                                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                        req.urgency === 'Critical'
                                          ? 'bg-red-100 text-red-800 animate-pulse'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {req.urgency}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[220px]">{req.hospitalName}</span>
                                    <span>•</span>
                                    <span className="font-bold text-slate-900">{req.unitsRequired} Units</span>
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[11px] font-mono text-slate-400 block">{req.requestCode}</span>
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                  {matchingDonors.length} Donors Ready
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Needed: {req.requiredTime || 'Immediate'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedRequestForDispatch(req);
                                    setDispatchModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Dispatch Donor</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Live Blood Group Availability Matrix */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Real-Time Campus Donor Readiness</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Available active donors ready for emergency mobilization by blood type
                    </p>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((group) => {
                      const count = donors.filter(
                        (d) => d.bloodGroup === group && d.availabilityStatus === 'Available'
                      ).length;

                      return (
                        <button
                          key={group}
                          onClick={() => {
                            setDonorGroupFilter(group);
                            setActiveTab('donors');
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-[#C62828] bg-slate-50/50 hover:bg-red-50/30 transition-all text-center group cursor-pointer"
                        >
                          <span className="block font-black text-sm text-[#C62828] group-hover:scale-105 transition-transform">
                            {group}
                          </span>
                          <span className="block text-xs font-extrabold text-slate-900 mt-0.5">{count}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Ready</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Donation Verifications & Campaigns */}
              <div className="lg:col-span-5 space-y-6">
                {/* Donation Verification Queue Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-amber-500" />
                      <span>Pending Donation Verifications</span>
                    </h3>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {pendingDonationRecords.length} Pending
                    </span>
                  </div>

                  {pendingDonationRecords.length === 0 ? (
                    <div className="p-6 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                      All donor logged donations are verified and certified.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingDonationRecords.slice(0, 3).map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">Donor: {rec.donorId.toUpperCase()}</span>
                              <span className="text-[10px] bg-white border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                {rec.units} Unit
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">{rec.hospitalOrVenue}</p>
                            <span className="text-[10px] text-slate-400">{rec.donationDate}</span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedDonationForVerification(rec);
                              setVerifyDonationModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
                          >
                            Verify & Sign
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Blood Camp Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C62828]" />
                      <span>Upcoming Campus Blood Camp</span>
                    </h3>
                    <button
                      onClick={() => setNewCampModalOpen(true)}
                      className="text-xs font-bold text-[#C62828] hover:underline"
                    >
                      + Schedule Camp
                    </button>
                  </div>

                  {campaigns.length > 0 ? (
                    <div className="space-y-3 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{campaigns[0].title}</h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 shrink-0">
                            {campaigns[0].status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{campaigns[0].venue}</span>
                        </p>
                        <p className="text-slate-600 text-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {campaigns[0].date} • {campaigns[0].startTime} to {campaigns[0].endTime}
                          </span>
                        </p>

                        <div className="pt-2">
                          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                            <span>Donor Registrations</span>
                            <span>
                              {campaigns[0].registeredCount} / {campaigns[0].targetUnits} Units Target
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#C62828] h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((campaigns[0].registeredCount / (campaigns[0].targetUnits || 1)) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Emergency Hotline Info Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>24/7 BDS Emergency Desk</span>
                  </div>
                  <h4 className="text-lg font-black tracking-tight">Direct Narowal Emergency Line</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hospitals, attendants, and doctors reach this station directly. Keep your on-call phone active during your assigned shift.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="tel:+923129901842"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C62828] hover:bg-[#8F1D22] text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>+92 312 9901842</span>
                    </a>
                    <button
                      onClick={() => setActiveTab('volunteers')}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                    >
                      View Shift Roster
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: BLOOD REQUESTS MANAGEMENT
        ======================================================== */}
        {activeTab === 'requests' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Blood Requests Dispatch Center</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Monitor hospital emergencies, find matching campus donors, and confirm dispatches
                </p>
              </div>

              <button
                onClick={() => setNewRequestModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#C62828] hover:bg-[#7F1D1D] text-white shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Blood Request</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient, hospital, city or case code..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={requestUrgencyFilter}
                  onChange={(e) => setRequestUrgencyFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="All">All Urgencies</option>
                  <option value="Critical">Critical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Scheduled">Scheduled</option>
                </select>

                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Donor Search Active">Search Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Donor Found">Donor Found</option>
                  <option value="Donation Confirmed">Donation Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">{req.patientName}</h3>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              req.urgency === 'Critical'
                                ? 'bg-red-100 text-red-800'
                                : req.urgency === 'Urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {req.urgency}
                          </span>
                          <span className="text-xs font-bold text-slate-600">
                            ({req.unitsRequired} Units Required)
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.hospitalName} ({req.hospitalCity})</span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Required by: {req.requiredDate} {req.requiredTime}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-mono font-bold text-slate-500 block">{req.requestCode}</span>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-800">Clinical Case Note: </strong>
                    {req.caseDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-slate-600">
                      <span>
                        <strong className="text-slate-800">Attendant: </strong> {req.requesterName}
                      </span>
                      <span>
                        <strong className="text-slate-800">Phone: </strong>
                        <a href={`tel:${req.requesterPhone}`} className="text-[#C62828] hover:underline font-mono">
                          {req.requesterPhone}
                        </a>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.requesterPhone}`}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Call Attendant</span>
                      </a>

                      <button
                        onClick={() => {
                          setSelectedRequestForDispatch(req);
                          setDispatchModalOpen(true);
                        }}
                        className="py-1.5 px-4 rounded-lg bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Compatible Donors</span>
                      </button>

                      <select
                        value={req.status}
                        onChange={(e) => {
                          updateRequestStatus(req.id, e.target.value as RequestStatus, 'Status updated by coordinator.');
                          showToast('Status Updated', `Case ${req.requestCode} set to ${e.target.value}.`, 'info');
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Donor Search Active">Search Active</option>
                        <option value="Donor Found">Donor Found</option>
                        <option value="Donation Confirmed">Donation Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: DONORS DIRECTORY
        ======================================================== */}
        {activeTab === 'donors' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Campus Donors Directory</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Browse, search, and mobilize verified donors from UET Narowal and regional hostels
                </p>
              </div>

              {compatibilityCheckGroup !== 'None' && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl text-xs">
                  <span className="font-bold text-[#C62828]">Filtered for Patient: {compatibilityCheckGroup}</span>
                  <button
                    onClick={() => setCompatibilityCheckGroup('None')}
                    className="p-0.5 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by donor name, phone, department, area..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={donorGroupFilter}
                    onChange={(e) => setDonorGroupFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="All">All Blood Types</option>
                    <option value="O-">O- Negative</option>
                    <option value="O+">O+ Positive</option>
                    <option value="A-">A- Negative</option>
                    <option value="A+">A+ Positive</option>
                    <option value="B-">B- Negative</option>
                    <option value="B+">B+ Positive</option>
                    <option value="AB-">AB- Negative</option>
                    <option value="AB+">AB+ Positive</option>
                  </select>

                  <select
                    value={donorAvailabilityFilter}
                    onChange={(e) => setDonorAvailabilityFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available Only</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Temporarily Ineligible">Temporarily Ineligible</option>
                  </select>

                  <select
                    value={donorCampusFilter}
                    onChange={(e) => setDonorCampusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="All">All Campus Locations</option>
                    {UET_CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compatibility Filter Selector */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500">Quick Match Recipient:</span>
                {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((group) => (
                  <button
                    key={group}
                    onClick={() =>
                      setCompatibilityCheckGroup(compatibilityCheckGroup === group ? 'None' : group)
                    }
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                      compatibilityCheckGroup === group
                        ? 'bg-[#C62828] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Needs {group}
                  </button>
                ))}
              </div>
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge bloodGroup={donor.bloodGroup} size="md" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-900">{donor.name}</h4>
                            {donor.verificationStatus === 'Verified' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Donor" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-[160px]">
                            {donor.department || 'UET Narowal'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          donor.availabilityStatus === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {donor.availabilityStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{donor.area || donor.campus || 'UET Campus'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Last Donated: {donor.lastDonationDate || 'None on record'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Total Donations: <strong className="text-slate-900">{donor.donationCount || 0} Units</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${donor.phone}`}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedDonorForContact(donor);
                        setContactDonorModalOpen(true);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Contact / Dispatch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: BLOOD DRIVES & EVENTS
        ======================================================== */}
        {activeTab === 'drives' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Campus Blood Drives & Camps</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Organize, manage, and track donation campaigns across UET Narowal faculties and halls
                </p>
              </div>

              <button
                onClick={() => setNewCampModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#C62828] hover:bg-[#7F1D1D] text-white shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Camp</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div className="h-44 w-full relative bg-slate-900">
                    <img
                      src={camp.featuredImage}
                      alt={camp.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white text-slate-900 shadow-sm">
                        {camp.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-slate-900">{camp.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{camp.description}</p>
                      <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                          <span>{camp.date} ({camp.startTime} - {camp.endTime})</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
                          <span>{camp.venue}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Target Progress</span>
                        <span>{camp.registeredCount} / {camp.targetUnits} Units</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#C62828] h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((camp.registeredCount / (camp.targetUnits || 1)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: DONATION VERIFICATIONS
        ======================================================== */}
        {activeTab === 'verifications' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Donation Verification Desk</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Audit and certify blood units logged by donors with official BDS accreditation certificates
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Total Records: {donationRecords.length} ({pendingDonationRecords.length} awaiting verification)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Donor ID</th>
                      <th className="py-3 px-4">Donation Date</th>
                      <th className="py-3 px-4">Hospital / Venue</th>
                      <th className="py-3 px-4">Units</th>
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donationRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rec.donorId.toUpperCase()}</td>
                        <td className="py-3.5 px-4">{rec.donationDate}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{rec.hospitalOrVenue}</td>
                        <td className="py-3.5 px-4 font-black text-[#C62828]">{rec.units} Unit</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {rec.certificateId || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              rec.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {rec.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {rec.verificationStatus === 'Pending' ? (
                            <button
                              onClick={() => {
                                setSelectedDonationForVerification(rec);
                                setVerifyDonationModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C62828] hover:bg-[#7F1D1D] text-white transition-colors"
                            >
                              Verify & Issue Certificate
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: VOLUNTEER TEAM ROSTER
        ======================================================== */}
        {activeTab === 'volunteers' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Volunteer Team & Shift Roster</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                BDS Executive council members, hospital liaison leads, and student field volunteers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: 'Fatima Noor',
                  role: 'Lead Emergency Coordinator',
                  dept: 'Computer Science, UET Narowal',
                  shift: 'Morning & Emergency On-Call (08:00 - 16:00)',
                  phone: '+92 321 4458921',
                  status: 'Active On-Duty',
                },
                {
                  name: 'Muhammad Rehan',
                  role: 'Hospital Liaison Lead',
                  dept: 'Electrical Engineering, UET Narowal',
                  shift: 'Evening Transfusion Shift (16:00 - 00:00)',
                  phone: '+92 300 1234567',
                  status: 'On Shift',
                },
                {
                  name: 'Areeba Khan',
                  role: 'BDS President & Field Director',
                  dept: 'Electrical Engineering, UET Narowal',
                  shift: 'Executive Oversight & Red Crescent Coordination',
                  phone: '+92 312 9901842',
                  status: 'Active',
                },
              ].map((vol) => (
                <div
                  key={vol.name}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {vol.status}
                    </span>
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{vol.name}</h4>
                    <p className="text-xs font-bold text-[#C62828] mt-0.5">{vol.role}</p>
                    <p className="text-[11px] text-slate-500">{vol.dept}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{vol.shift}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${vol.phone}`} className="font-mono text-slate-800 hover:text-[#C62828]">
                        {vol.phone}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: NOTIFICATIONS
        ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Coordinator Alerts & Broadcasts</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Real-time alerts regarding emergency dispatches, donations, and campus blood requests
                </p>
              </div>

              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-bold text-[#C62828] hover:underline"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !notif.read
                      ? 'bg-red-50/40 border-red-200/80 shadow-2xs'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'emergency'
                            ? 'bg-red-100 text-[#C62828]'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{notif.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{notif.timestamp}</span>
                      </div>
                    </div>

                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C62828] shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: COORDINATOR PROFILE
        ======================================================== */}
        {activeTab === 'profile' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Coordinator Profile</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Your BDS team membership, station, and verified contact credentials
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-900 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                  {coordinatorInfo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{coordinatorInfo.name}</h3>
                  <p className="text-xs font-bold text-[#C62828]">{coordinatorInfo.role}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{coordinatorInfo.campus}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                  <p className="font-bold text-slate-800 text-sm">{coordinatorInfo.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Emergency Hotline Phone</span>
                  <p className="font-bold text-slate-800 text-sm font-mono">{coordinatorInfo.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Department</span>
                  <p className="font-bold text-slate-800 text-sm">{coordinatorInfo.department}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Shift Station</span>
                  <p className="font-bold text-slate-800 text-sm">{coordinatorInfo.station}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: SETTINGS
        ======================================================== */}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Coordinator Portal Settings</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Manage emergency dispatch threshold, notifications, and campus coverage
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 text-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Emergency SMS & WhatsApp Alerts</h4>
                    <p className="text-slate-500">Receive instant push notification when Critical requests are logged</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C62828]" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Automated Donor Recommendation</h4>
                    <p className="text-slate-500">Automatically filter and suggest available compatible campus donors</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C62828]" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Hospital Transfusion Sync</h4>
                    <p className="text-slate-500">Sync with DHQ Hospital and Red Crescent Narowal databases</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C62828]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: NEW EMERGENCY BLOOD REQUEST
      ======================================================== */}
      {newRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-[#C62828]" />
                  <span>Log Emergency Blood Request</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter case details to dispatch alerts to available compatible donors
                </p>
              </div>
              <button
                onClick={() => setNewRequestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group Required *</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828] font-bold text-[#C62828]"
                  >
                    {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Units Required *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newUnits}
                    onChange={(e) => setNewUnits(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Venue *</label>
                  <select
                    value={newHospital}
                    onChange={(e) => setNewHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  >
                    {MAJOR_HOSPITALS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level *</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828] font-bold text-red-700"
                  >
                    <option value="Critical">Critical (Immediate within 2h)</option>
                    <option value="Urgent">Urgent (Within 6-12h)</option>
                    <option value="Scheduled">Scheduled (Planned Transfusion)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendant Name</label>
                  <input
                    type="text"
                    value={newRequesterName}
                    onChange={(e) => setNewRequesterName(e.target.value)}
                    placeholder="e.g. Asif Ali (Brother)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendant Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRequesterPhone}
                    onChange={(e) => setNewRequesterPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Case Description</label>
                <textarea
                  rows={2}
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="px-5 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingRequest ? 'Dispatching...' : 'Dispatch Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: DISPATCH MATCHING DONORS
      ======================================================== */}
      {dispatchModalOpen && selectedRequestForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">Dispatch Compatible Donors</h3>
                  <BloodGroupBadge bloodGroup={selectedRequestForDispatch.bloodGroup} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Case: {selectedRequestForDispatch.requestCode} • {selectedRequestForDispatch.patientName} at {selectedRequestForDispatch.hospitalName}
                </p>
              </div>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Compatible Campus Donors Ready Right Now
              </h4>

              {(() => {
                const acceptableGroups =
                  (selectedRequestForDispatch?.bloodGroup &&
                    COMPATIBILITY_DATA[selectedRequestForDispatch.bloodGroup]?.canReceiveFrom) ||
                  [];
                const compatibleDonorsList = (donors || []).filter(
                  (d) => acceptableGroups.includes(d.bloodGroup) && d.availabilityStatus === 'Available'
                );

                if (compatibleDonorsList.length === 0) {
                  return (
                    <div className="p-6 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                      No active donors currently flagged as &quot;Available&quot; for {selectedRequestForDispatch.bloodGroup}. Try contacting emergency reserves.
                    </div>
                  );
                }

                return compatibleDonorsList.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge bloodGroup={d.bloodGroup} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900">{d.name}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                            Available
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{d.campus} • {d.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${d.phone}`}
                        className="py-1 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-white font-bold"
                      >
                        Call
                      </a>
                      <a
                        href={generateWhatsAppUrl(d.phone, selectedRequestForDispatch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Dispatch</span>
                      </a>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  matchDonorsToRequest(selectedRequestForDispatch.id, ['donor-101']);
                  updateRequestStatus(
                    selectedRequestForDispatch.id,
                    'Donor Found',
                    `Dispatched by ${coordinatorInfo.name}`
                  );
                  showToast('Dispatches Confirmed', 'Request updated to Donor Found status.', 'success');
                  setDispatchModalOpen(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Mark Donor Assigned
              </button>

              <button
                onClick={() => setDispatchModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: VERIFY DONATION RECORD
      ======================================================== */}
      {verifyDonationModalOpen && selectedDonationForVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" />
                  <span>Verify Blood Donation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm hospital transfusion record and issue official BDS certification
                </p>
              </div>
              <button
                onClick={() => setVerifyDonationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Donor ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedDonationForVerification.donorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Donation Date:</span>
                <span className="font-bold text-slate-900">{selectedDonationForVerification.donationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital / Center:</span>
                <span className="font-bold text-slate-900">{selectedDonationForVerification.hospitalOrVenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Units Transfused:</span>
                <span className="font-black text-[#C62828]">{selectedDonationForVerification.units} Whole Blood Unit</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official BDS Certificate ID</label>
                <input
                  type="text"
                  placeholder="e.g. BDS-CERT-2026-992 (Leave blank for auto-generate)"
                  value={customCertificateId}
                  onChange={(e) => setCustomCertificateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Clinical Notes</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setVerifyDonationModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyDonation(selectedDonationForVerification)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Verify Unit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: SCHEDULE BLOOD CAMP
      ======================================================== */}
      {newCampModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#C62828]" />
                  <span>Schedule Campus Blood Drive</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish a new blood donation camp for UET Narowal students and staff
                </p>
              </div>
              <button
                onClick={() => setNewCampModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmittingCamp(true);
                try {
                  await createCampaign({
                    title: campTitle,
                    slug: campTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    subtitle: 'Organized by BDS UET Narowal',
                    description: campDescription || 'University-wide voluntary blood drive.',
                    date: campDate,
                    venue: campVenue,
                    campus: 'UET Narowal Campus',
                    city: 'Narowal',
                    targetUnits: campTargetUnits,
                    collectedUnits: 0,
                    registeredCount: 0,
                    status: 'Upcoming',
                    startTime: '09:00 AM',
                    endTime: '05:00 PM',
                    featuredImage:
                      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
                  });
                  showToast('Blood Drive Scheduled', 'Camp published successfully.', 'success');
                  setNewCampModalOpen(false);
                } catch {
                  showToast('Error', 'Failed to create camp.', 'error');
                } finally {
                  setIsSubmittingCamp(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Camp Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UET Narowal Autumn Mega Blood Camp 2026"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Units *</label>
                  <input
                    type="number"
                    required
                    value={campTargetUnits}
                    onChange={(e) => setCampTargetUnits(parseInt(e.target.value, 10) || 100)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Venue *</label>
                <input
                  type="text"
                  required
                  value={campVenue}
                  onChange={(e) => setCampVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewCampModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCamp}
                  className="px-5 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingCamp ? 'Saving...' : 'Publish Camp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: CONTACT DONOR MODAL
      ======================================================== */}
      {contactDonorModalOpen && selectedDonorForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <BloodGroupBadge bloodGroup={selectedDonorForContact.bloodGroup} size="sm" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedDonorForContact.name}</h3>
                  <span className="text-xs text-slate-500">{selectedDonorForContact.campus}</span>
                </div>
              </div>
              <button
                onClick={() => setContactDonorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Contact</span>
                <p className="font-mono font-bold text-slate-900 text-sm">{selectedDonorForContact.phone}</p>
                <p className="text-slate-600">{selectedDonorForContact.email}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5 text-xs">
              <a
                href={`tel:${selectedDonorForContact.phone}`}
                className="w-full py-3 px-4 rounded-xl bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Donor Directly</span>
              </a>

              <a
                href={`https://wa.me/${selectedDonorForContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum ${selectedDonorForContact.name}! BDS UET Narowal Emergency Dispatch Desk here. Are you available for a blood donation inquiry?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <button
                onClick={() => setContactDonorModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
