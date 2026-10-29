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
  DonationRecord,
  VerificationStatus,
  Article,
} from '../../types';
import { SupabaseContactMessage } from '../../services/supabaseService';
import { COMPATIBILITY_DATA, UET_CAMPUSES, MAJOR_HOSPITALS } from '../../data/mockData';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../../lib/supabase';
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
  HeartHandshake,
  Database,
  History,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Save,
  CheckCircle,
  Server,
  ToggleLeft,
  ToggleRight,
  BookOpen,
} from 'lucide-react';

export type TeamTab =
  | 'overview'
  | 'donor-management'
  | 'donor-verification'
  | 'requests'
  | 'emergency-matching'
  | 'donors-directory'
  | 'donation-record'
  | 'drives'
  | 'donation-verifications'
  | 'volunteers'
  | 'team-management'
  | 'guide-approvals'
  | 'contact-inquiries'
  | 'notifications'
  | 'profile'
  | 'supabase-database'
  | 'settings';

export interface SocietyTeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  session: string;
  campus: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  shiftStatus: 'On Duty' | 'Off Duty' | 'On Leave';
  station: string;
  avatarBg: string;
}

export const INITIAL_SOCIETY_TEAM: SocietyTeamMember[] = [
  {
    id: 'tm-1',
    name: 'Areeba Khan',
    role: 'President',
    department: 'Department of Electrical Engineering',
    session: 'Session 2022-2026',
    campus: 'UET Narowal Campus',
    bloodGroup: 'O+',
    phone: '+92 301 8456123',
    email: 'areeba.president@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'Executive Cabinet & Red Crescent Liaison Desk',
    avatarBg: 'from-amber-600 to-amber-800',
  },
  {
    id: 'tm-2',
    name: 'Hassan Shah',
    role: 'Vice President',
    department: 'Department of Mechanical Engineering',
    session: 'Session 2022-2026',
    campus: 'UET Narowal Campus',
    bloodGroup: 'B+',
    phone: '+92 302 7654321',
    email: 'hassan.vp@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'Internal Operations & Campus Blood Drives Desk',
    avatarBg: 'from-purple-600 to-indigo-900',
  },
  {
    id: 'tm-3',
    name: 'Fatima Noor',
    role: 'Emergency Dispatch Lead',
    department: 'Department of Computer Science',
    session: 'Session 2022-2026',
    campus: 'UET Narowal Campus',
    bloodGroup: 'A+',
    phone: '+92 321 4458921',
    email: 'coordinator.emergency@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'DHQ Hospital Narowal Liaison Desk (24/7 Helpline)',
    avatarBg: 'from-red-600 to-rose-900',
  },
  {
    id: 'tm-4',
    name: 'Zainab Fatima',
    role: 'Operations Lead',
    department: 'Department of Computer Science',
    session: 'Session 2023-2027',
    campus: 'UET Narowal Campus',
    bloodGroup: 'A+',
    phone: '+92 304 9876543',
    email: 'zainab.ops@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'Fast Donor Matching & Transportation Desk',
    avatarBg: 'from-sky-600 to-cyan-900',
  },
  {
    id: 'tm-5',
    name: 'Usama Raza',
    role: 'Outreach & Hospital Liaison Lead',
    department: 'Department of Civil Engineering',
    session: 'Session 2022-2026',
    campus: 'UET Narowal Campus',
    bloodGroup: 'O-',
    phone: '+92 300 4567890',
    email: 'usama.outreach@narowal.uet.edu.pk',
    shiftStatus: 'Off Duty',
    station: 'Sughra Shafi Complex & Rescue 1122 Coordination',
    avatarBg: 'from-rose-600 to-pink-900',
  },
  {
    id: 'tm-6',
    name: 'Hira Shah',
    role: 'Media & Awareness Lead',
    department: 'Department of Computer Science',
    session: 'Session 2023-2027',
    campus: 'UET Narowal Campus',
    bloodGroup: 'AB+',
    phone: '+92 305 1234567',
    email: 'hira.media@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'Public Awareness & Digital Outreach Bureau',
    avatarBg: 'from-orange-600 to-amber-900',
  },
  {
    id: 'tm-7',
    name: 'Engr. Haris Tariq',
    role: 'Society Patron / Faculty Advisor',
    department: 'Department of Electrical Engineering',
    session: 'Faculty Executive',
    campus: 'UET Narowal Campus',
    bloodGroup: 'O+',
    phone: '+92 300 8472910',
    email: 'president.bds@narowal.uet.edu.pk',
    shiftStatus: 'On Duty',
    station: 'Executive Council Oversight Desk',
    avatarBg: 'from-slate-800 to-slate-950',
  },
];

export interface TeamDashboardProps {
  isAdmin?: boolean;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ isAdmin = false }) => {
  const {
    currentUser,
    donors,
    requests,
    campaigns,
    volunteers,
    donationRecords,
    articles,
    approveArticle,
    rejectArticle,
    deleteArticle,
    contactMessages,
    updateContactMessageStatus,
    notifications,
    auditLogs,
    supabaseStatus,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    updateRequestStatus,
    addBloodRequest,
    matchDonorsToRequest,
    addDonationRecord,
    createCampaign,
    verifyDonor,
    toggleDonorAvailability,
    toggleDonorEmergency,
    updateDonorProfile,
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

  // Profile default data
  const defaultAdminName = 'Engr. Haris Tariq';
  const defaultCoordName = 'Fatima Noor';
  const defaultAdminEmail = 'president.bds@narowal.uet.edu.pk';
  const defaultCoordEmail = 'coordinator.emergency@narowal.uet.edu.pk';
  const defaultAdminPhone = '+92 300 8472910';
  const defaultCoordPhone = '+92 321 4458921';
  const defaultAdminDept = 'Electrical Engineering, UET Narowal';
  const defaultCoordDept = 'Computer Science, UET Narowal';
  const defaultAdminStation = 'Executive Administration & Oversight Council';
  const defaultCoordStation = 'Emergency Dispatch & Hospital Liaison Desk';

  // Profile editable state (authority to update)
  const [profileName, setProfileName] = useState(
    currentUser?.name || (isAdmin ? defaultAdminName : defaultCoordName)
  );
  const [profileEmail, setProfileEmail] = useState(
    currentUser?.email || (isAdmin ? defaultAdminEmail : defaultCoordEmail)
  );
  const [profilePhone, setProfilePhone] = useState(
    currentUser?.phone || (isAdmin ? defaultAdminPhone : defaultCoordPhone)
  );
  const [profileAltPhone, setProfileAltPhone] = useState('+92 300 9876543');
  const [profileCampus, setProfileCampus] = useState(currentUser?.campus || 'UET Narowal Campus');
  const [profileDepartment, setProfileDepartment] = useState(
    currentUser?.department || (isAdmin ? defaultAdminDept : defaultCoordDept)
  );
  const [profileStation, setProfileStation] = useState(
    isAdmin ? defaultAdminStation : defaultCoordStation
  );
  const [profileIsOnDuty, setProfileIsOnDuty] = useState(true);
  const [profileHotlineActive, setProfileHotlineActive] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fallback Coordinator/Admin data
  const coordinatorInfo = useMemo(() => {
    return {
      id: currentUser?.id || (isAdmin ? 'BDS-PATRON-01' : 'BDS-COORD-2026'),
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      altPhone: profileAltPhone,
      role: isAdmin ? 'BDS Administrator / Executive Patron' : 'BDS Senior Emergency Coordinator',
      campus: profileCampus,
      department: profileDepartment,
      station: profileStation,
      shiftStatus: profileIsOnDuty ? 'On Duty • 24/7 Hotline Active' : 'Off Duty / On Call',
    };
  }, [
    currentUser,
    isAdmin,
    profileName,
    profileEmail,
    profilePhone,
    profileAltPhone,
    profileCampus,
    profileDepartment,
    profileStation,
    profileIsOnDuty,
  ]);

  // Modals state
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedRequestForDispatch, setSelectedRequestForDispatch] = useState<BloodRequest | null>(null);
  const [verifyDonationModalOpen, setVerifyDonationModalOpen] = useState(false);
  const [selectedDonationForVerification, setSelectedDonationForVerification] = useState<DonationRecord | null>(null);
  const [newCampModalOpen, setNewCampModalOpen] = useState(false);
  const [contactDonorModalOpen, setContactDonorModalOpen] = useState(false);
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<Donor | null>(null);
  const [editDonorModalOpen, setEditDonorModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  // Filters for Requests tab
  const [requestSearch, setRequestSearch] = useState('');
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState<'All' | UrgencyLevel>('All');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'All' | RequestStatus>('All');

  // Filters for Donors Directory tab
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState<'All' | BloodGroup>('All');
  const [donorAvailabilityFilter, setDonorAvailabilityFilter] = useState<'All' | DonorAvailability>('All');
  const [donorCampusFilter, setDonorCampusFilter] = useState<'All' | string>('All');
  const [compatibilityCheckGroup, setCompatibilityCheckGroup] = useState<BloodGroup | 'None'>('None');

  // Filters for Donor Management tab
  const [manageSearch, setManageSearch] = useState('');
  const [manageGroupFilter, setManageGroupFilter] = useState<'All' | BloodGroup>('All');
  const [manageAvailFilter, setManageAvailFilter] = useState<'All' | DonorAvailability>('All');

  // Filters for Donor Verification tab
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<'All' | VerificationStatus>('Pending');

  // Filters for Donation Records tab
  const [recordSearch, setRecordSearch] = useState('');
  const [recordHospitalFilter, setRecordHospitalFilter] = useState('All');

  // State for Emergency Matching tab
  const [matchingSelectedRequest, setMatchingSelectedRequest] = useState<string>('custom');
  const [matchingTargetBloodGroup, setMatchingTargetBloodGroup] = useState<BloodGroup>('O-');
  const [matchingTargetHospital, setMatchingTargetHospital] = useState(MAJOR_HOSPITALS[0]);
  const [matchingUnitsNeeded, setMatchingUnitsNeeded] = useState(2);

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

  // Filters & State for Guide Approvals tab
  const [guideSearch, setGuideSearch] = useState('');
  const [guideStatusFilter, setGuideStatusFilter] = useState<'All' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedArticleForView, setSelectedArticleForView] = useState<Article | null>(null);
  const [articleRejectModalOpen, setArticleRejectModalOpen] = useState(false);
  const [articleToReject, setArticleToReject] = useState<Article | null>(null);
  const [articleRejectionReason, setArticleRejectionReason] = useState('Requires further verification of clinical claims.');

  // Filters & State for Contact Inquiries tab
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState<'All' | 'New' | 'In Review' | 'Resolved'>('All');
  const [selectedContactMessage, setSelectedContactMessage] = useState<SupabaseContactMessage | null>(null);

  // Filters & State for Team Management tab
  const [teamMembers, setTeamMembers] = useState<SocietyTeamMember[]>(INITIAL_SOCIETY_TEAM);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamRoleFilter, setTeamRoleFilter] = useState('All');
  const [teamShiftFilter, setTeamShiftFilter] = useState('All');
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SocietyTeamMember | null>(null);

  // Form states for add/edit team member
  const [formMemberName, setFormMemberName] = useState('');
  const [formMemberRole, setFormMemberRole] = useState('Emergency Coordinator');
  const [formMemberDept, setFormMemberDept] = useState('Department of Computer Science');
  const [formMemberSession, setFormMemberSession] = useState('Session 2023-2027');
  const [formMemberBloodGroup, setFormMemberBloodGroup] = useState<BloodGroup>('O+');
  const [formMemberPhone, setFormMemberPhone] = useState('+92 300 ');
  const [formMemberEmail, setFormMemberEmail] = useState('');
  const [formMemberStation, setFormMemberStation] = useState('Emergency Dispatch & Campus Coordination Desk');
  const [formMemberShift, setFormMemberShift] = useState<'On Duty' | 'Off Duty' | 'On Leave'>('On Duty');

  // ALL USEMEMO HOOKS (placed at top to strictly uphold React Hook order)
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

  const criticalRequests = useMemo(() => {
    return (requests || []).filter(
      (r) =>
        r.urgency === 'Critical' &&
        r.status !== 'Completed' &&
        r.status !== 'Donation Confirmed' &&
        r.status !== 'Cancelled'
    );
  }, [requests]);

  const activeRequests = useMemo(() => {
    return (requests || []).filter(
      (r) => r.status !== 'Completed' && r.status !== 'Cancelled' && r.status !== 'Donation Confirmed'
    );
  }, [requests]);

  const availableDonors = useMemo(() => {
    return (donors || []).filter((d) => d.availabilityStatus === 'Available');
  }, [donors]);

  const pendingDonors = useMemo(() => {
    return (donors || []).filter((d) => d.verificationStatus === 'Pending');
  }, [donors]);

  const pendingDonationRecords = useMemo(() => {
    return (donationRecords || []).filter((d) => d.verificationStatus === 'Pending');
  }, [donationRecords]);

  // Donors Directory
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

  // Donor Management list
  const managedDonors = useMemo(() => {
    return (donors || []).filter((d) => {
      const name = (d.name || '').toLowerCase();
      const phone = d.phone || '';
      const id = (d.id || '').toLowerCase();
      const query = (manageSearch || '').toLowerCase();
      const matchSearch = name.includes(query) || phone.includes(query) || id.includes(query);
      const matchGroup = manageGroupFilter === 'All' ? true : d.bloodGroup === manageGroupFilter;
      const matchAvail = manageAvailFilter === 'All' ? true : d.availabilityStatus === manageAvailFilter;
      return matchSearch && matchGroup && matchAvail;
    });
  }, [donors, manageSearch, manageGroupFilter, manageAvailFilter]);

  // Donor Verification list
  const verificationDonors = useMemo(() => {
    return (donors || []).filter((d) => {
      const name = (d.name || '').toLowerCase();
      const id = (d.id || '').toLowerCase();
      const query = (verificationSearch || '').toLowerCase();
      const matchSearch = name.includes(query) || id.includes(query);
      const matchStatus =
        verificationStatusFilter === 'All' ? true : d.verificationStatus === verificationStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [donors, verificationSearch, verificationStatusFilter]);

  // Donation Records list
  const filteredDonationRecords = useMemo(() => {
    return (donationRecords || []).filter((rec) => {
      const dId = (rec.donorId || '').toLowerCase();
      const cert = (rec.certificateId || '').toLowerCase();
      const hosp = (rec.hospitalOrVenue || '').toLowerCase();
      const query = (recordSearch || '').toLowerCase();
      const matchSearch = dId.includes(query) || cert.includes(query) || hosp.includes(query);
      const matchHosp =
        recordHospitalFilter === 'All' ? true : rec.hospitalOrVenue.includes(recordHospitalFilter);
      return matchSearch && matchHosp;
    });
  }, [donationRecords, recordSearch, recordHospitalFilter]);

  // Emergency Matching Results
  const matchingCompatibleDonors = useMemo(() => {
    const targetGroup =
      matchingSelectedRequest === 'custom'
        ? matchingTargetBloodGroup
        : requests.find((r) => r.id === matchingSelectedRequest)?.bloodGroup || 'O-';

    const acceptableGroups = COMPATIBILITY_DATA[targetGroup]?.canReceiveFrom || [];
    return (donors || []).filter(
      (d) => acceptableGroups.includes(d.bloodGroup) && d.availabilityStatus === 'Available'
    );
  }, [matchingSelectedRequest, matchingTargetBloodGroup, requests, donors]);

  // Guide (Article) Approval memo
  const pendingArticles = useMemo(() => {
    return (articles || []).filter((a) => (a.approvalStatus || 'approved') === 'pending');
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return (articles || []).filter((a) => {
      const status = a.approvalStatus || 'approved';
      const matchStatus = guideStatusFilter === 'All' ? true : status === guideStatusFilter;
      const query = (guideSearch || '').toLowerCase();
      const matchSearch =
        !guideSearch ||
        (a.title || '').toLowerCase().includes(query) ||
        (a.author || '').toLowerCase().includes(query) ||
        (a.category || '').toLowerCase().includes(query) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(query)));
      return matchStatus && matchSearch;
    });
  }, [articles, guideStatusFilter, guideSearch]);

  // Contact Inquiries memo
  const newContactMessagesCount = useMemo(() => {
    return (contactMessages || []).filter((m) => m.status === 'New').length;
  }, [contactMessages]);

  const filteredContactMessages = useMemo(() => {
    return (contactMessages || []).filter((m) => {
      const matchStatus = contactStatusFilter === 'All' ? true : m.status === contactStatusFilter;
      const query = (contactSearch || '').toLowerCase();
      const matchSearch =
        !contactSearch ||
        (m.name || '').toLowerCase().includes(query) ||
        (m.subject || '').toLowerCase().includes(query) ||
        (m.message || '').toLowerCase().includes(query) ||
        (m.email || '').toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  }, [contactMessages, contactStatusFilter, contactSearch]);

  // Team Management Memo
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      if (teamRoleFilter !== 'All' && !m.role.toLowerCase().includes(teamRoleFilter.toLowerCase())) {
        return false;
      }
      if (teamShiftFilter !== 'All' && m.shiftStatus !== teamShiftFilter) {
        return false;
      }
      if (!teamSearch.trim()) return true;
      const q = teamSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.bloodGroup.toLowerCase().includes(q) ||
        m.station.toLowerCase().includes(q)
      );
    });
  }, [teamMembers, teamSearch, teamRoleFilter, teamShiftFilter]);

  // Team Management Handlers
  const handleOpenAddMemberModal = () => {
    setEditingMember(null);
    setFormMemberName('');
    setFormMemberRole('Emergency Coordinator');
    setFormMemberDept('Department of Computer Science');
    setFormMemberSession('Session 2023-2027');
    setFormMemberBloodGroup('O+');
    setFormMemberPhone('+92 300 ');
    setFormMemberEmail('');
    setFormMemberStation('Emergency Dispatch & Hospital Liaison Desk');
    setFormMemberShift('On Duty');
    setMemberModalOpen(true);
  };

  const handleOpenEditMemberModal = (member: SocietyTeamMember) => {
    setEditingMember(member);
    setFormMemberName(member.name);
    setFormMemberRole(member.role);
    setFormMemberDept(member.department);
    setFormMemberSession(member.session);
    setFormMemberBloodGroup(member.bloodGroup);
    setFormMemberPhone(member.phone);
    setFormMemberEmail(member.email);
    setFormMemberStation(member.station);
    setFormMemberShift(member.shiftStatus);
    setMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMemberName.trim()) {
      showToast('Validation Error', 'Please enter the member full name.', 'error');
      return;
    }

    if (editingMember) {
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formMemberName,
                role: formMemberRole,
                department: formMemberDept,
                session: formMemberSession,
                bloodGroup: formMemberBloodGroup,
                phone: formMemberPhone,
                email: formMemberEmail,
                station: formMemberStation,
                shiftStatus: formMemberShift,
              }
            : m
        )
      );
      showToast('Team Member Updated', `${formMemberName}'s profile and duty shift updated.`, 'success');
    } else {
      const newMember: SocietyTeamMember = {
        id: `tm-${Date.now()}`,
        name: formMemberName,
        role: formMemberRole,
        department: formMemberDept,
        session: formMemberSession,
        campus: 'UET Narowal Campus',
        bloodGroup: formMemberBloodGroup,
        phone: formMemberPhone,
        email: formMemberEmail || `${formMemberName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`,
        shiftStatus: formMemberShift,
        station: formMemberStation,
        avatarBg: 'from-red-600 to-rose-900',
      };
      setTeamMembers((prev) => [newMember, ...prev]);
      showToast('Team Member Added', `${formMemberName} registered into society team leadership.`, 'success');
    }
    setMemberModalOpen(false);
  };

  const handleToggleMemberShift = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const nextShift = m.shiftStatus === 'On Duty' ? 'Off Duty' : 'On Duty';
          showToast(
            'Shift Status Toggled',
            `${m.name} is now marked ${nextShift}.`,
            nextShift === 'On Duty' ? 'success' : 'info'
          );
          return { ...m, shiftStatus: nextShift };
        }
        return m;
      })
    );
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('Member Removed', `${memberName} removed from active team roster.`, 'info');
  };

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

  // Handle Saving Coordinator Profile with Authority to Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      showToast(
        'Profile Authority Updated',
        `Coordinator identity, dispatch station, and contact hotline updated successfully.`,
        'success'
      );
    }, 400);
  };

  // Generate WhatsApp message for donor dispatch
  const generateWhatsAppUrl = (phone: string, requestInfo?: { bloodGroup: string; hospital: string; units: number; code?: string }) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const bg = requestInfo?.bloodGroup || 'Blood';
    const hosp = requestInfo?.hospital || 'DHQ Hospital Narowal';
    const units = requestInfo?.units || 1;
    const message = `Assalam-o-Alaikum! BDS UET Narowal Emergency Dispatch Desk here. Critical requirement for ${bg} blood at ${hosp} (${units} units). Are you available to donate today? Please reply ASAP or call our emergency desk at +92 312 9901842. Case ID: ${requestInfo?.code || 'BDS-EMERGENCY'}`;
    return `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
      message
    )}`;
  };

  // Exact 14 navigation items requested by the user
  const navItems = [
    { id: 'overview' as TeamTab, label: 'Overview', icon: LayoutDashboard },
    {
      id: 'donor-management' as TeamTab,
      label: 'Donor management',
      icon: SlidersHorizontal,
      badge: donors.length > 0 ? donors.length : undefined,
    },
    {
      id: 'donor-verification' as TeamTab,
      label: 'Donor verification',
      icon: UserCheck,
      badge: pendingDonors.length > 0 ? pendingDonors.length : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'requests' as TeamTab,
      label: 'Blood Requests',
      icon: Droplet,
      badge: activeRequests.length > 0 ? activeRequests.length : undefined,
      badgeColor: criticalRequests.length > 0 ? 'bg-red-600 text-white' : undefined,
    },
    {
      id: 'emergency-matching' as TeamTab,
      label: 'Emergency Matching',
      icon: Activity,
    },
    {
      id: 'donors-directory' as TeamTab,
      label: 'Donors Directory',
      icon: Users,
    },
    {
      id: 'donation-record' as TeamTab,
      label: 'Donation record',
      icon: History,
      badge: donationRecords.length > 0 ? donationRecords.length : undefined,
    },
    {
      id: 'drives' as TeamTab,
      label: 'Blood Drives & Events',
      icon: Megaphone,
      badge: campaigns.length > 0 ? campaigns.length : undefined,
    },
    {
      id: 'donation-verifications' as TeamTab,
      label: 'Donation Verifications',
      icon: FileCheck,
      badge: pendingDonationRecords.length > 0 ? pendingDonationRecords.length : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'volunteers' as TeamTab, label: 'Volunteer Team', icon: HeartHandshake },
    {
      id: 'team-management' as TeamTab,
      label: 'Team management',
      icon: Users,
      badge: teamMembers.length > 0 ? teamMembers.length : undefined,
    },
    {
      id: 'guide-approvals' as TeamTab,
      label: 'Guide (article) approval',
      icon: BookOpen,
      badge: pendingArticles.length > 0 ? pendingArticles.length : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'contact-inquiries' as TeamTab,
      label: 'Contact inquiries',
      icon: Mail,
      badge: newContactMessagesCount > 0 ? newContactMessagesCount : undefined,
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'notifications' as TeamTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    {
      id: 'profile' as TeamTab,
      label: 'My Profile (authority to update)',
      icon: User,
    },
    {
      id: 'supabase-database' as TeamTab,
      label: 'Supabase database',
      icon: Database,
    },
    { id: 'settings' as TeamTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900" id={isAdmin ? "bds-admin-dashboard" : "bds-team-dashboard"}>
      {/* ========================================================
          A. FIXED / STICKY LEFT SIDEBAR (DESKTOP)
      ======================================================== */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/90 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full p-0.5 bg-white border border-slate-200 shadow-sm shrink-0 overflow-hidden">
            <img src={bdsLogoImg} alt="BDS UET Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              Blood Donors Society
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider">UET Narowal</span>
              <span className="text-[10px] bg-red-100 text-[#C62828] font-extrabold px-1.5 py-0.2 rounded">
                {isAdmin ? 'ADMIN' : 'TEAM'}
              </span>
            </div>
          </div>
        </div>

        {/* 14 Navigation Items List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Team coordinator navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-red-50 text-[#C62828] border-r-4 border-[#C62828] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id={`team-sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5 truncate mr-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C62828]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ${
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
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {coordinatorInfo.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-900 truncate block">{coordinatorInfo.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#C62828] font-bold">
                <ShieldCheck className="w-3 h-3 shrink-0 text-[#C62828]" />
                <span>{isAdmin ? 'BDS Administrator' : 'BDS Coordinator'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors border border-slate-200/80 bg-white"
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
          <div className="relative w-72 max-w-[85%] bg-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                  <img src={bdsLogoImg} alt="BDS Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-none">BDS UET</h3>
                  <span className="text-[10px] text-[#C62828] font-bold">
                    {isAdmin ? 'Admin Executive Console' : 'Team Coordinator Desk'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-red-50 text-[#C62828] border-r-4 border-[#C62828]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C62828]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-[#7F1D1D] shrink-0">
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
                className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-2"
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
                <strong>Demo Mode:</strong> You are exploring the BDS {isAdmin ? 'Admin Console' : 'Team Dispatch Console'} with sample {isAdmin ? 'administrator' : 'coordinator'} data.
              </span>
            </div>
            <button
              onClick={() => navigate('login')}
              className="font-bold underline text-amber-900 hover:text-black ml-3 shrink-0"
            >
              Sign In with {isAdmin ? 'Admin ID' : 'Team ID'}
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
                  {activeTab === 'overview' && (isAdmin ? 'Admin Executive Overview' : 'Team Dispatch Overview')}
                  {activeTab === 'donor-management' && 'Donor Management'}
                  {activeTab === 'donor-verification' && 'Donor Account Verification'}
                  {activeTab === 'requests' && 'Emergency Blood Requests'}
                  {activeTab === 'emergency-matching' && 'Emergency Blood Matching Engine'}
                  {activeTab === 'donors-directory' && 'Campus Donors Directory'}
                  {activeTab === 'donation-record' && 'Donation Records History'}
                  {activeTab === 'drives' && 'Blood Drives & Camps'}
                  {activeTab === 'donation-verifications' && 'Donation Verification Desk'}
                  {activeTab === 'volunteers' && 'Volunteer Team & Shifts'}
                  {activeTab === 'team-management' && 'Executive Team & Council Management'}
                  {activeTab === 'guide-approvals' && 'Guide (Article) Approvals Desk'}
                  {activeTab === 'contact-inquiries' && 'Public Contact Inquiries & Feedback'}
                  {activeTab === 'notifications' && 'Emergency Broadcasts'}
                  {activeTab === 'profile' && 'My Profile (Authority to Update)'}
                  {activeTab === 'supabase-database' && 'Supabase Cloud Database Console'}
                  {activeTab === 'settings' && (isAdmin ? 'Admin Portal Settings' : 'Team Portal Settings')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isAdmin ? 'Executive Live' : 'Dispatcher Live'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                {isAdmin
                  ? 'BDS UET Narowal • Executive Administration & Clinical Oversight Desk'
                  : 'BDS UET Narowal • Emergency Dispatch & Clinical Liaison Desk'}
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
                <div className="w-7 h-7 rounded-lg bg-[#C62828] text-white font-black text-xs flex items-center justify-center shadow-xs shadow-red-500/20">
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
                    <span>My Profile (Authority)</span>
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
            TAB 1: OVERVIEW
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
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAdmin ? 'BDS Administrator' : 'BDS Team Coordinator'}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {isAdmin
                      ? 'Executive administration, policy controls, clinical verifications, and blood safety oversight across Narowal.'
                      : 'Coordinate live blood requests, mobilize university donors, and verify hospital transfusions across Narowal.'}
                  </p>

                  {/* Coordinator Information Row */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">{isAdmin ? 'Admin ID: ' : 'Coordinator ID: '}</span>
                      <strong className="font-mono text-slate-900">{isAdmin ? 'BDS-PATRON-01' : 'BDS-COORD-2026'}</strong>
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

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('emergency-matching')}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-[#B4232C] hover:bg-[#8F1D22] text-white shadow-sm transition-all"
                    >
                      <Activity className="w-4 h-4 shrink-0 text-white" />
                      <span>Emergency Match</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('donors-directory')}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-[#0F172A] hover:bg-slate-800 text-white shadow-sm transition-all"
                    >
                      <Users className="w-4 h-4 shrink-0 text-white" />
                      <span>Donors Directory</span>
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
                            className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                              req.urgency === 'Critical'
                                ? 'border-red-200 bg-red-50/30'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="shrink-0 pt-0.5">
                                  <BloodGroupBadge bloodGroup={req.bloodGroup} size="lg" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h4 className="font-bold text-sm text-slate-900 break-words">{req.patientName}</h4>
                                    <span
                                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                        req.urgency === 'Critical'
                                          ? 'bg-red-100 text-red-800 animate-pulse'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {req.urgency}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="break-words">{req.hospitalName}</span>
                                    </span>
                                    <span className="text-slate-300 hidden sm:inline">•</span>
                                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                      <Droplet className="w-3 h-3 text-[#C62828] shrink-0" />
                                      {req.unitsRequired} {req.unitsRequired === 1 ? 'Unit' : 'Units'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                                <span className="text-[11px] font-mono text-slate-500 font-semibold">{req.requestCode}</span>
                                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  {matchingDonors.length} Donors Ready
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                              <div className="text-slate-600 text-[11px] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Needed: <strong className="text-slate-800">{req.requiredTime || 'Immediate'}</strong></span>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRequestForDispatch(req);
                                    setDispatchModalOpen(true);
                                  }}
                                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#C62828] hover:bg-[#8F1D22] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
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
                      const count = (donors || []).filter(
                        (d) => d.bloodGroup === group && d.availabilityStatus === 'Available'
                      ).length;

                      return (
                        <button
                          key={group}
                          onClick={() => {
                            setDonorGroupFilter(group);
                            setActiveTab('donors-directory');
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
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DONOR MANAGEMENT
        ======================================================== */}
        {activeTab === 'donor-management' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Donor Management</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage active donor profiles, adjust emergency mobilization willingness, and update statuses
                </p>
              </div>

              <button
                onClick={() => setActiveTab('donor-verification')}
                className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Pending Verifications ({pendingDonors.length})</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by donor name, ID, or phone number..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={manageGroupFilter}
                  onChange={(e) => setManageGroupFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="All">All Blood Types</option>
                  {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>

                <select
                  value={manageAvailFilter}
                  onChange={(e) => setManageAvailFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="All">All Availabilities</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Temporarily Ineligible">Temporarily Ineligible</option>
                </select>
              </div>
            </div>

            {/* Donors Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Donor Name & ID</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Campus & Dept</th>
                      <th className="py-3 px-4">Current Availability</th>
                      <th className="py-3 px-4">Emergency Alert</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4 text-right">Management Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {managedDonors.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{d.name}</strong>
                          <span className="font-mono text-[11px] text-slate-400">{d.id.toUpperCase()}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <BloodGroupBadge bloodGroup={d.bloodGroup} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="block font-medium text-slate-800">{d.department || 'UET'}</span>
                          <span className="text-[11px] text-slate-400">{d.campus}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={d.availabilityStatus}
                            onChange={(e) => {
                              toggleDonorAvailability(d.id, e.target.value as DonorAvailability);
                              showToast('Availability Updated', `${d.name} set to ${e.target.value}`, 'success');
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                              d.availabilityStatus === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Temporarily Ineligible">Temporarily Ineligible</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              toggleDonorEmergency(d.id, !d.emergencyAvailable);
                              showToast(
                                'Emergency Alerts Toggled',
                                `${d.name} alerts ${!d.emergencyAvailable ? 'Enabled' : 'Disabled'}`,
                                'info'
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                              d.emergencyAvailable
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Radio className={`w-3 h-3 ${d.emergencyAvailable ? 'animate-pulse text-red-600' : ''}`} />
                            <span>{d.emergencyAvailable ? 'Active On-Call' : 'Disabled'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              d.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700'
                                : d.verificationStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {d.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingDonor(d);
                              setEditDonorModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Details</span>
                          </button>
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
            TAB 3: DONOR VERIFICATION
        ======================================================== */}
        {activeTab === 'donor-verification' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Donor Verification Desk</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Review student roll numbers, CNIC records, and grant verified status to university donors
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVerificationStatusFilter('Pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    verificationStatusFilter === 'Pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Pending Review ({pendingDonors.length})
                </button>
                <button
                  onClick={() => setVerificationStatusFilter('Verified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    verificationStatusFilter === 'Verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Verified Donors
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {verificationDonors.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge bloodGroup={d.bloodGroup} size="md" />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{d.name}</h4>
                          <span className="font-mono text-[11px] text-slate-400 block">{d.id.toUpperCase()}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          d.verificationStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.verificationStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {d.verificationStatus}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-800">Department: </strong>
                        {d.department || 'Computer Science'}
                      </p>
                      <p>
                        <strong className="text-slate-800">Campus: </strong>
                        {d.campus}
                      </p>
                      <p>
                        <strong className="text-slate-800">Phone: </strong>
                        <span className="font-mono">{d.phone}</span>
                      </p>
                      {d.studentBatch && (
                        <p>
                          <strong className="text-slate-800">Session/Batch: </strong>
                          {d.studentBatch}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs">
                    {d.verificationStatus === 'Pending' ? (
                      <>
                        <button
                          onClick={() => {
                            verifyDonor(d.id, 'Verified');
                            showToast('Donor Verified', `${d.name} is now certified in the system.`, 'success');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => {
                            verifyDonor(d.id, 'Rejected');
                            showToast('Donor Rejected', `${d.name} verification rejected.`, 'error');
                          }}
                          className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center py-1 text-emerald-700 font-bold flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified Account Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: BLOOD REQUESTS
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
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
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
                          <span>
                            {req.hospitalName} ({req.hospitalCity})
                          </span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Required by: {req.requiredDate} {req.requiredTime}
                          </span>
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
            TAB 5: EMERGENCY MATCHING
        ======================================================== */}
        {activeTab === 'emergency-matching' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#C62828]" />
                <span>Emergency Blood Matching Engine</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Real-time recipient-donor compatibility algorithm for trauma cases and urgent surgeries
              </p>
            </div>

            {/* Matching Criteria Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-slate-400">
                1. Select Emergency Case or Custom Patient Blood Group
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Active Request</label>
                  <select
                    value={matchingSelectedRequest}
                    onChange={(e) => setMatchingSelectedRequest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="custom">Manual Emergency Simulation</option>
                    {requests.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.requestCode}: {r.patientName} ({r.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {matchingSelectedRequest === 'custom' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Blood Group Needed</label>
                    <select
                      value={matchingTargetBloodGroup}
                      onChange={(e) => setMatchingTargetBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-[#C62828]"
                    >
                      {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Hospital</label>
                  <select
                    value={matchingTargetHospital}
                    onChange={(e) => setMatchingTargetHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    {MAJOR_HOSPITALS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compatibility Guide Banner */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-extrabold block">Transfusion Compatibility Rule:</span>
                  <span className="text-[11px] text-red-800">
                    Patient requires red blood cells from compatible donors ({
                      COMPATIBILITY_DATA[
                        matchingSelectedRequest === 'custom'
                          ? matchingTargetBloodGroup
                          : requests.find((r) => r.id === matchingSelectedRequest)?.bloodGroup || 'O-'
                      ]?.canReceiveFrom.join(', ')
                    })
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#C62828]">
                    {matchingCompatibleDonors.length} Compatible Donors Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Compatible Donors Dispatch List */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                Compatible Campus Donors Mobilization Queue ({matchingCompatibleDonors.length})
              </h3>

              {matchingCompatibleDonors.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  No donors currently flagged as Available for this blood group. Please reach out to volunteer reserves.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingCompatibleDonors.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <BloodGroupBadge bloodGroup={d.bloodGroup} size="sm" />
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Immediate Available
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{d.name}</h4>
                          <p className="text-xs text-slate-500">{d.department || 'UET Narowal'}</p>
                          <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{d.phone}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <a
                          href={`tel:${d.phone}`}
                          className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>Call</span>
                        </a>

                        <a
                          href={generateWhatsAppUrl(d.phone, {
                            bloodGroup: matchingTargetBloodGroup,
                            hospital: matchingTargetHospital,
                            units: matchingUnitsNeeded,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: DONORS DIRECTORY
        ======================================================== */}
        {activeTab === 'donors-directory' && (
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
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={donorGroupFilter}
                    onChange={(e) => setDonorGroupFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="All">All Blood Types</option>
                    {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
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
                        <span>
                          Total Donations:{' '}
                          <strong className="text-slate-900">{donor.donationCount || 0} Units</strong>
                        </span>
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
            TAB 7: DONATION RECORD
        ======================================================== */}
        {activeTab === 'donation-record' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <History className="w-6 h-6 text-[#C62828]" />
                <span>Donation Records Log</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Complete audit trail of all blood donations recorded, verified, and certified across campus
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-slate-400 text-xs font-bold uppercase">Total Units Logged</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {donationRecords.reduce((sum, r) => sum + (r.units || 1), 0)} Units
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-slate-400 text-xs font-bold uppercase">Verified Certifications</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {donationRecords.filter((r) => r.verificationStatus === 'Verified').length} Issued
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-slate-400 text-xs font-bold uppercase">Awaiting Verification</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{pendingDonationRecords.length} Pending</p>
              </div>
            </div>

            {/* Records Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Donor ID, Certificate Number, or Hospital..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <select
                value={recordHospitalFilter}
                onChange={(e) => setRecordHospitalFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Hospital Venues</option>
                {MAJOR_HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Donor ID</th>
                      <th className="py-3 px-4">Hospital / Transfusion Center</th>
                      <th className="py-3 px-4">Type & Units</th>
                      <th className="py-3 px-4">Official Certificate</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDonationRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono">{rec.donationDate}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rec.donorId.toUpperCase()}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{rec.hospitalOrVenue}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#C62828]">{rec.units} Unit</span> ({rec.donationType || 'Whole Blood'})
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {rec.certificateId || 'Pending Issue'}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: BLOOD DRIVES & EVENTS
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
                          <span>
                            {camp.date} ({camp.startTime} - {camp.endTime})
                          </span>
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
                        <span>
                          {camp.registeredCount} / {camp.targetUnits} Units
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#C62828] h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((camp.registeredCount / (camp.targetUnits || 1)) * 100)
                            )}%`,
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
            TAB 9: DONATION VERIFICATIONS
        ======================================================== */}
        {activeTab === 'donation-verifications' && (
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
            TAB 10: VOLUNTEER TEAM
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
                <div key={vol.name} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
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
            TAB: TEAM MANAGEMENT
        ======================================================== */}
        {activeTab === 'team-management' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Executive Team & Council Management
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-[#C62828] border border-red-300">
                    {teamMembers.length} Leaders
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Society leadership, executive coordinators, shift duties, and authority privileges across UET Narowal
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenAddMemberModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C62828] hover:bg-[#8F1D22] text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Council</span>
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">{teamMembers.length}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">BDS leadership & leads</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-xs font-bold uppercase tracking-wider">On-Duty Active</span>
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-2">
                  {teamMembers.filter((m) => m.shiftStatus === 'On Duty').length} Active
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Dispatch & helpline responsive</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Departments</span>
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {new Set(teamMembers.map((m) => m.department)).size} Facets
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">CS, EE, ME, Civil & Basic Sci</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-blue-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Helpline Station</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">24/7 Live</div>
                <p className="text-[11px] text-blue-700 font-semibold mt-0.5">Clinical Liaison active</p>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Role Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'President', 'Operations', 'Outreach', 'Coordinator'].map((rf) => (
                    <button
                      key={rf}
                      onClick={() => setTeamRoleFilter(rf)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        teamRoleFilter === rf
                          ? 'bg-[#C62828] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {rf === 'All' ? `All Members (${teamMembers.length})` : rf}
                    </button>
                  ))}
                </div>

                {/* Duty status filter & search */}
                <div className="flex items-center gap-2">
                  <select
                    value={teamShiftFilter}
                    onChange={(e) => setTeamShiftFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none"
                  >
                    <option value="All">All Shifts</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search leader, role, dept..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-[#C62828] outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            {filteredTeamMembers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-800 text-base">No team members match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting search query or selecting "All Members".
                </p>
                <button
                  onClick={() => {
                    setTeamRoleFilter('All');
                    setTeamShiftFilter('All');
                    setTeamSearch('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Avatar + Name + Blood Group */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.avatarBg} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-base text-slate-900 leading-tight truncate">
                              {member.name}
                            </h4>
                            <span className="inline-block mt-0.5 text-xs font-bold text-[#C62828] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <BloodGroupBadge bloodGroup={member.bloodGroup} size="sm" />
                      </div>

                      {/* Department & Academic Session */}
                      <div className="text-xs text-slate-600 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{member.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.session} • {member.campus}</span>
                        </div>
                      </div>

                      {/* Station Desk Assignment */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Assigned Station Desk
                        </span>
                        <p className="font-semibold text-slate-800 text-[11px] mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{member.station}</span>
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone:
                          </span>
                          <a
                            href={`tel:${member.phone}`}
                            className="font-mono text-slate-900 font-bold hover:text-[#C62828]"
                          >
                            {member.phone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Email:
                          </span>
                          <a
                            href={`mailto:${member.email}`}
                            className="text-slate-700 font-medium hover:text-[#C62828] truncate max-w-[170px]"
                          >
                            {member.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleMemberShift(member.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          member.shiftStatus === 'On Duty'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to toggle on-duty / off-duty shift"
                      >
                        <Radio
                          className={`w-3 h-3 ${
                            member.shiftStatus === 'On Duty' ? 'text-emerald-600 animate-pulse' : 'text-slate-400'
                          }`}
                        />
                        <span>{member.shiftStatus}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditMemberModal(member)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Edit member details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
                          title="Remove from leadership council"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: GUIDE (ARTICLE) APPROVAL
        ======================================================== */}
        {activeTab === 'guide-approvals' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Guide (Article) Approvals & Editorial Desk
                  </h2>
                  {pendingArticles.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                      {pendingArticles.length} Pending
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Clinical review, author credentials verification, and publishing workflow for community donation guides
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <BookOpen className="w-4 h-4 text-[#C62828]" />
                <span>{articles.length} total educational guides</span>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setGuideStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      guideStatusFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Pending Review</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        guideStatusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      {pendingArticles.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setGuideStatusFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      guideStatusFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Approved & Live</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        guideStatusFilter === 'approved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {articles.filter((a) => (a.approvalStatus || 'approved') === 'approved').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setGuideStatusFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      guideStatusFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Rejected</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        guideStatusFilter === 'rejected' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {articles.filter((a) => a.approvalStatus === 'rejected').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setGuideStatusFilter('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      guideStatusFilter === 'All'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Submissions ({articles.length})
                  </button>
                </div>

                {/* Search */}
                <div className="relative sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, author, topic..."
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-[#C62828] outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Articles List */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-800 text-base">No guides found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {guideStatusFilter === 'pending'
                    ? 'No submissions are currently pending clinical verification.'
                    : 'Try clearing your search query or selecting a different filter tab.'}
                </p>
                {guideStatusFilter !== 'pending' && (
                  <button
                    onClick={() => {
                      setGuideStatusFilter('pending');
                      setGuideSearch('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    View Pending Queue
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredArticles.map((article) => {
                  const status = article.approvalStatus || 'approved';
                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col md:flex-row gap-5"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full md:w-44 h-32 md:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                        <img
                          src={
                            article.featuredImage ||
                            'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-xs">
                          {article.category}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Pending Editorial Review</span>
                              </span>
                            )}
                            {status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Approved & Published Live</span>
                              </span>
                            )}
                            {status === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Rejected</span>
                              </span>
                            )}

                            <span className="text-[11px] text-slate-500 font-medium">
                              {article.readTime || '4 min read'} • Published: {article.publishedDate}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 leading-snug hover:text-[#C62828] transition-colors">
                            {article.title}
                          </h3>

                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {article.summary || article.content.slice(0, 180)}...
                          </p>

                          {/* Rejection notice if present */}
                          {status === 'rejected' && article.rejectionReason && (
                            <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold">Rejection Note:</strong> {article.rejectionReason}
                              </div>
                            </div>
                          )}

                          {/* Author credentials card */}
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Author & Title
                              </span>
                              <span className="font-extrabold text-slate-800">{article.author}</span>
                              <span className="text-[11px] text-slate-500 block">{article.authorRole}</span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Verification Credentials
                              </span>
                              <span className="font-semibold text-slate-700">
                                {article.authorCnicOrRoll || article.authorAffiliation || 'UET Community Contributor'}
                              </span>
                              {article.authorPhone && (
                                <span className="text-[11px] text-slate-500 block font-mono">
                                  {article.authorPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions bar */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                          <button
                            onClick={() => setSelectedArticleForView(article)}
                            className="text-xs font-bold text-[#C62828] hover:text-[#7F1D1D] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-red-50"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Preview Full Article</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    setArticleToReject(article);
                                    setArticleRejectModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                                >
                                  Reject...
                                </button>
                                <button
                                  onClick={() => approveArticle(article.id)}
                                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve & Publish</span>
                                </button>
                              </>
                            )}

                            {status === 'approved' && (
                              <button
                                onClick={() => {
                                  setArticleToReject(article);
                                  setArticleRejectModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                              >
                                Revoke Approval
                              </button>
                            )}

                            {status === 'rejected' && (
                              <button
                                onClick={() => approveArticle(article.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              >
                                Re-Approve Article
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
                                  deleteArticle(article.id);
                                }
                              }}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Article"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: CONTACT INQUIRIES
        ======================================================== */}
        {activeTab === 'contact-inquiries' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Contact Inquiries & Public Feedback Desk
                  </h2>
                  {newContactMessagesCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-[#C62828] border border-red-300">
                      {newContactMessagesCount} New
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Messages, community partnership queries, and blood bank inquiries received via the contact portal
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Mail className="w-4 h-4 text-[#C62828]" />
                <span>{contactMessages.length} total received inquiries</span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setContactStatusFilter('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      contactStatusFilter === 'All'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Inquiries ({contactMessages.length})
                  </button>

                  <button
                    onClick={() => setContactStatusFilter('New')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      contactStatusFilter === 'New'
                        ? 'bg-[#C62828] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>New Inquiries</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        contactStatusFilter === 'New' ? 'bg-[#7F1D1D] text-white' : 'bg-red-200 text-[#7F1D1D]'
                      }`}
                    >
                      {newContactMessagesCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setContactStatusFilter('In Review')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      contactStatusFilter === 'In Review'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>In Review</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        contactStatusFilter === 'In Review' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {contactMessages.filter((m) => m.status === 'In Review').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setContactStatusFilter('Resolved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      contactStatusFilter === 'Resolved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Resolved</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        contactStatusFilter === 'Resolved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {contactMessages.filter((m) => m.status === 'Resolved').length}
                    </span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by sender, subject, text..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-[#C62828] outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Inquiries List */}
            {filteredContactMessages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-800 text-base">No contact inquiries found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {contactStatusFilter === 'New'
                    ? 'All incoming contact inquiries have been addressed or reviewed.'
                    : 'No messages match your selected filter or search keyword.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContactMessages.map((msg) => {
                  return (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-2xl border transition-all p-5 space-y-4 shadow-2xs ${
                        msg.status === 'New'
                          ? 'border-red-200/90 bg-red-50/10 shadow-xs'
                          : 'border-slate-200/90'
                      }`}
                    >
                      {/* Top Row: Sender Info & Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0 shadow-xs ${
                              msg.status === 'New'
                                ? 'bg-[#C62828]'
                                : msg.status === 'In Review'
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                          >
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{msg.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">#{msg.id}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                              <a
                                href={`mailto:${msg.email}`}
                                className="hover:text-[#C62828] font-medium flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{msg.email}</span>
                              </a>
                              {msg.phone && (
                                <a
                                  href={`tel:${msg.phone}`}
                                  className="hover:text-[#C62828] font-mono flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{msg.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 ${
                              msg.status === 'New'
                                ? 'bg-red-50 text-[#C62828] border-red-200'
                                : msg.status === 'In Review'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                msg.status === 'New'
                                  ? 'bg-[#C62828] animate-pulse'
                                  : msg.status === 'In Review'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-600'
                              }`}
                            />
                            <span>{msg.status}</span>
                          </span>

                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(msg.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Subject & Body */}
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 mb-1.5 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{msg.subject}</span>
                        </h5>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>

                      {/* Resolved By Info */}
                      {msg.resolved_by && (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Handled by: {msg.resolved_by}</span>
                        </div>
                      )}

                      {/* Coordinator Actions */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">Update Status:</span>
                          {msg.status !== 'In Review' && (
                            <button
                              onClick={() => updateContactMessageStatus(msg.id, 'In Review')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                            >
                              Mark In Review
                            </button>
                          )}
                          {msg.status !== 'Resolved' && (
                            <button
                              onClick={() => updateContactMessageStatus(msg.id, 'Resolved')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark Resolved</span>
                            </button>
                          )}
                          {msg.status === 'Resolved' && (
                            <button
                              onClick={() => updateContactMessageStatus(msg.id, 'New')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                              Reopen Inquiry
                            </button>
                          )}
                        </div>

                        {/* Direct Responder Links */}
                        <div className="flex items-center gap-2">
                          {msg.phone && (
                            <>
                              <a
                                href={generateWhatsAppUrl(
                                  msg.phone,
                                  {
                                    bloodGroup: 'Inquiry',
                                    hospital: 'BDS Helpdesk',
                                    units: 1,
                                    code: `INQ-${msg.id.slice(-4)}`,
                                  }
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>WhatsApp Reply</span>
                              </a>
                              <a
                                href={`tel:${msg.phone}`}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>
                            </>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(
                              `Re: ${msg.subject} - BDS UET Narowal`
                            )}`}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#C62828] bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Response</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 11: NOTIFICATIONS
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

              <button onClick={markAllNotificationsRead} className="text-xs font-bold text-[#C62828] hover:underline">
                Mark all read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !notif.read ? 'bg-red-50/40 border-red-200/80 shadow-2xs' : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'emergency' ? 'bg-red-100 text-[#C62828]' : 'bg-blue-100 text-blue-700'
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

                    {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-[#C62828] shrink-0 mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 12: MY PROFILE (AUTHORITY TO UPDATE)
        ======================================================== */}
        {activeTab === 'profile' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <User className="w-6 h-6 text-[#C62828]" />
                <span>My Profile (Authority to Update)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Official coordinator identity, emergency hotline contact numbers, and campus dispatch station
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 text-xs">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#C62828] text-white font-black text-2xl flex items-center justify-center shadow-md shadow-red-500/20">
                  {profileName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{profileName}</h3>
                  <p className="text-xs font-bold text-[#C62828]">BDS Senior Emergency Coordinator</p>
                  <p className="text-xs text-slate-500 mt-0.5">BDS-COORD-2026 • Verified Officer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coordinator Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Hotline Phone *</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alternate / WhatsApp Hotline</label>
                  <input
                    type="tel"
                    value={profileAltPhone}
                    onChange={(e) => setProfileAltPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">University Department</label>
                  <input
                    type="text"
                    value={profileDepartment}
                    onChange={(e) => setProfileDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Dispatch Station</label>
                  <input
                    type="text"
                    value={profileStation}
                    onChange={(e) => setProfileStation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Active Shift Dispatch Status</h4>
                    <p className="text-slate-500">Flag yourself as actively answering emergency blood calls right now</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileIsOnDuty(!profileIsOnDuty)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                      profileIsOnDuty ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{profileIsOnDuty ? 'On-Duty Dispatcher' : 'Off-Duty'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save & Update Profile Authority'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 13: SUPABASE DATABASE
        ======================================================== */}
        {activeTab === 'supabase-database' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#C62828]" />
                <span>Supabase Cloud Database Console</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Inspect PostgreSQL schema tables, audit synchronization, and monitor database health
              </p>
            </div>

            {/* Connection Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                      Cloud Database Connected
                    </span>
                  </div>
                  <h3 className="text-xl font-black">Project: {SUPABASE_PROJECT_ID}</h3>
                  <p className="text-xs text-slate-400 font-mono">{SUPABASE_URL}</p>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Sync Live Records</span>
                </button>
              </div>
            </div>

            {/* Tables Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">donors</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{donors.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">blood_requests</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{requests.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">donation_records</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{donationRecords.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">campaigns</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{campaigns.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">volunteers</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{volunteers.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">audit_logs</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">{auditLogs.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Records Synced</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 14: SETTINGS
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
                        href={generateWhatsAppUrl(d.phone, {
                          bloodGroup: selectedRequestForDispatch.bloodGroup,
                          hospital: selectedRequestForDispatch.hospitalName,
                          units: selectedRequestForDispatch.unitsRequired,
                          code: selectedRequestForDispatch.requestCode,
                        })}
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

      {/* ========================================================
          MODAL 6: EDIT DONOR PROFILE
      ======================================================== */}
      {editDonorModalOpen && editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#C62828]" />
                  <span>Edit Donor Record</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update donor contact details, availability status, and clinical notes
                </p>
              </div>
              <button
                onClick={() => setEditDonorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateDonorProfile(editingDonor.id, {
                    phone: editingDonor.phone,
                    campus: editingDonor.campus,
                    department: editingDonor.department,
                    availabilityStatus: editingDonor.availabilityStatus,
                    emergencyAvailable: editingDonor.emergencyAvailable,
                    notes: editingDonor.notes,
                  });
                  showToast('Donor Updated', `${editingDonor.name}'s record saved.`, 'success');
                  setEditDonorModalOpen(false);
                } catch {
                  showToast('Error', 'Failed to update donor record.', 'error');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editingDonor.phone}
                    onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={editingDonor.availabilityStatus}
                    onChange={(e) =>
                      setEditingDonor({
                        ...editingDonor,
                        availabilityStatus: e.target.value as DonorAvailability,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Temporarily Ineligible">Temporarily Ineligible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus / Location</label>
                <input
                  type="text"
                  value={editingDonor.campus}
                  onChange={(e) => setEditingDonor({ ...editingDonor, campus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Deferral / Notes</label>
                <textarea
                  rows={2}
                  value={editingDonor.notes || ''}
                  onChange={(e) => setEditingDonor({ ...editingDonor, notes: e.target.value })}
                  placeholder="Medical conditions, screening observations, or travel availability..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditDonorModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#7F1D1D] text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 7: FULL ARTICLE PREVIEW FOR EDITORIAL DESK
      ======================================================== */}
      {selectedArticleForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#C62828] text-white">
                    {selectedArticleForView.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedArticleForView.readTime || '4 min read'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {selectedArticleForView.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticleForView(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Credential Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted By</span>
                <span className="font-extrabold text-slate-900 text-sm block">{selectedArticleForView.author}</span>
                <span className="text-slate-500 block">{selectedArticleForView.authorRole}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credentials / Contact</span>
                <span className="font-semibold text-slate-800 block">
                  {selectedArticleForView.authorCnicOrRoll || selectedArticleForView.authorAffiliation || 'Contributor'}
                </span>
                <span className="text-slate-500 font-mono block">
                  {[selectedArticleForView.authorEmail, selectedArticleForView.authorPhone].filter(Boolean).join(' • ')}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-slate-700 text-sm leading-relaxed border-b border-slate-100 pb-4">
              {selectedArticleForView.summary && (
                <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-[#7F1D1D] font-medium text-xs italic">
                  <strong>Summary:</strong> {selectedArticleForView.summary}
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 space-y-2">
                {selectedArticleForView.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 shrink-0">
              <span className="text-xs text-slate-500">
                Status:{' '}
                <strong className="text-slate-900 capitalize">
                  {selectedArticleForView.approvalStatus || 'approved'}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedArticleForView(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                >
                  Close
                </button>
                {selectedArticleForView.approvalStatus === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setArticleToReject(selectedArticleForView);
                        setSelectedArticleForView(null);
                        setArticleRejectModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                    >
                      Reject Submission
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        approveArticle(selectedArticleForView.id);
                        setSelectedArticleForView(null);
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 8: REJECT ARTICLE REASON MODAL
      ======================================================== */}
      {articleRejectModalOpen && articleToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Reject Guide Submission</span>
              </h3>
              <button
                onClick={() => setArticleRejectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide constructive feedback for <strong>{articleToReject.author}</strong> regarding{' '}
              <em>"{articleToReject.title}"</em>:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Rejection / Deferral</label>
              <textarea
                rows={3}
                value={articleRejectionReason}
                onChange={(e) => setArticleRejectionReason(e.target.value)}
                placeholder="e.g., Unverified medical statistics, references required, or formatting needs revision..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setArticleRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectArticle(articleToReject.id, articleRejectionReason);
                  setArticleRejectModalOpen(false);
                  setArticleToReject(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 9: ADD / EDIT TEAM MEMBER
      ======================================================== */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C62828]" />
                  <span>{editingMember ? 'Edit Team Member' : 'Add Executive Team Member'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update society leadership, designation, and campus dispatch desk assignment
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formMemberName}
                  onChange={(e) => setFormMemberName(e.target.value)}
                  placeholder="e.g. Areeba Khan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formMemberRole}
                    onChange={(e) => setFormMemberRole(e.target.value)}
                    placeholder="e.g. Operations Lead"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={formMemberBloodGroup}
                    onChange={(e) => setFormMemberBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828] font-bold text-[#C62828]"
                  >
                    {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={formMemberDept}
                    onChange={(e) => setFormMemberDept(e.target.value)}
                    placeholder="e.g. Department of Electrical Engineering"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session / Batch</label>
                  <input
                    type="text"
                    value={formMemberSession}
                    onChange={(e) => setFormMemberSession(e.target.value)}
                    placeholder="e.g. Session 2022-2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={formMemberPhone}
                    onChange={(e) => setFormMemberPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formMemberEmail}
                    onChange={(e) => setFormMemberEmail(e.target.value)}
                    placeholder="name@narowal.uet.edu.pk"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Station Desk</label>
                <input
                  type="text"
                  value={formMemberStation}
                  onChange={(e) => setFormMemberStation(e.target.value)}
                  placeholder="e.g. Emergency Dispatch & Hospital Liaison Desk"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#C62828]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift / Duty Status</label>
                <div className="flex items-center gap-4">
                  {(['On Duty', 'Off Duty', 'On Leave'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name="memberShift"
                        checked={formMemberShift === st}
                        onChange={() => setFormMemberShift(st)}
                        className="accent-[#C62828]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#C62828] hover:bg-[#8F1D22] text-white shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMember ? 'Save Changes' : 'Register Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
