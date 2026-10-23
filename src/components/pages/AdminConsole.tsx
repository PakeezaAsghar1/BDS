import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodRequest, RequestStatus, BloodGroup, Donor, UET_CAMPUSES, Article } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  Activity,
  Users,
  Calendar,
  HeartHandshake,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  AlertCircle,
  FileText,
  UserCheck,
  MessageSquare,
  Sparkles,
  PhoneCall,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Trash2,
  Mail,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  Bell,
  Database,
  RefreshCw,
  Copy,
  Check,
  Server,
} from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../../lib/supabase';

export const AdminConsole: React.FC = () => {
  const {
    requests,
    donors,
    campaigns,
    campaignRegistrations,
    volunteers,
    articles,
    stories,
    auditLogs,
    notifications,
    contactMessages,
    supabaseStatus,
    refreshFromSupabase,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    updateRequestStatus,
    approveArticle,
    rejectArticle,
    deleteArticle,
    showToast,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'requests' | 'donors' | 'campaigns' | 'volunteers' | 'articles' | 'logs' | 'notifications' | 'contact' | 'database'
  >('requests');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Request Management State
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>('Donor Search Active');
  const [statusNote, setStatusNote] = useState('');

  // Article Approval State
  const [articleFilter, setArticleFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [rejectModalArticle, setRejectModalArticle] = useState<Article | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvingArticle, setApprovingArticle] = useState<Article | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('Ali Raza (BDS Lead)');
  const [requestSearch, setRequestSearch] = useState('');

  // Donor Search State
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('all');

  const filteredRequests = requests.filter((r) => {
    if (!requestSearch) return true;
    const q = requestSearch.toLowerCase();
    return (
      r.requestCode.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.hospitalName.toLowerCase().includes(q) ||
      r.bloodGroup.toLowerCase().includes(q)
    );
  });

  const filteredDonors = donors.filter((d) => {
    if (donorGroupFilter !== 'all' && d.bloodGroup !== donorGroupFilter) return false;
    if (!donorSearch) return true;
    const q = donorSearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.campus.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    );
  });

  const pendingArticles = articles.filter((a) => a.approvalStatus === 'pending');
  const approvedArticles = articles.filter((a) => !a.approvalStatus || a.approvalStatus === 'approved');
  const rejectedArticles = articles.filter((a) => a.approvalStatus === 'rejected');

  const filteredArticles = articles.filter((art) => {
    if (articleFilter === 'pending' && art.approvalStatus !== 'pending') return false;
    if (articleFilter === 'approved' && (art.approvalStatus && art.approvalStatus !== 'approved')) return false;
    if (articleFilter === 'rejected' && art.approvalStatus !== 'rejected') return false;

    if (!articleSearch.trim()) return true;
    const q = articleSearch.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q) ||
      (art.authorAffiliation && art.authorAffiliation.toLowerCase().includes(q)) ||
      (art.authorEmail && art.authorEmail.toLowerCase().includes(q)) ||
      art.category.toLowerCase().includes(q)
    );
  });

  const handleApproveArticle = (art: Article) => {
    approveArticle(art.id, approvalNote || 'Verified medical accuracy and contributor credentials.');
    setApprovingArticle(null);
    setApprovalNote('');
  };

  const handleRejectArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalArticle) return;
    rejectArticle(rejectModalArticle.id, rejectionReason || 'Information requires clinical revision.');
    setRejectModalArticle(null);
    setRejectionReason('');
  };

  const handleOpenStatusModal = (req: BloodRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setStatusNote('');
    setStatusModalOpen(true);
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    updateRequestStatus(
      selectedRequest.id,
      newStatus,
      statusNote || `Status changed to ${newStatus} by coordinator`,
      coordinatorName
    );

    setStatusModalOpen(false);
  };

  const handleBroadcastAlert = (req: BloodRequest) => {
    showToast(
      'Broadcast Dispatched',
      `Simulated broadcast sent to all verified ${req.bloodGroup} donors in ${req.hospitalCity} area.`,
      'success'
    );
  };

  const navItems = [
    {
      id: 'requests' as const,
      label: 'Blood Requests',
      sublabel: 'Live Dispatch Desk',
      icon: Activity,
      count: requests.length,
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
      btnId: 'tab-requests-btn',
    },
    {
      id: 'donors' as const,
      label: 'Donor Directory',
      sublabel: 'Verified Donors',
      icon: Users,
      count: donors.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-donors-btn',
    },
    {
      id: 'campaigns' as const,
      label: 'Donation Camps',
      sublabel: 'Campus Drives',
      icon: Calendar,
      count: campaigns.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-campaigns-btn',
    },
    {
      id: 'volunteers' as const,
      label: 'Volunteers',
      sublabel: 'Student Wing',
      icon: HeartHandshake,
      count: volunteers.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-volunteers-btn',
    },
    {
      id: 'articles' as const,
      label: 'Guide & Approvals',
      sublabel: 'Health Knowledge',
      icon: BookOpen,
      count: articles.length,
      pendingCount: pendingArticles.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-articles-btn',
    },
    {
      id: 'logs' as const,
      label: 'Audit History',
      sublabel: 'Security & Activity',
      icon: FileText,
      count: auditLogs.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-logs-btn',
    },
    {
      id: 'notifications' as const,
      label: 'Dispatch Alerts',
      sublabel: 'Live Notifications',
      icon: Bell,
      count: notifications.length,
      pendingCount: unreadNotificationCount,
      badgeColor: unreadNotificationCount > 0 ? 'bg-red-500 text-white font-extrabold' : 'bg-slate-800 text-slate-300',
      btnId: 'tab-notifications-btn',
    },
    {
      id: 'contact' as const,
      label: 'Contact Inquiries',
      sublabel: 'User Messages',
      icon: Mail,
      count: contactMessages.length,
      badgeColor: 'bg-slate-800 text-slate-300',
      btnId: 'tab-contact-btn',
    },
    {
      id: 'database' as const,
      label: 'Supabase Database',
      sublabel: 'Cloud Sync & Schema',
      icon: Database,
      count: supabaseStatus.connected ? 1 : 0,
      badgeColor: supabaseStatus.connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300',
      btnId: 'tab-database-btn',
    },
  ];

  const handleSyncSupabase = async () => {
    setIsRefreshing(true);
    try {
      await refreshFromSupabase();
      showToast('Database Synchronized', 'Live state fetched from Supabase cloud database.', 'success');
    } catch {
      showToast('Sync Notice', 'Could not refresh from Supabase.', 'warning');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopySchema = () => {
    const schemaSql = `-- BDS UET Narowal - Supabase Database Schema
-- Project: zrmajldxzdkokgayhsbg
-- See full schema file at /supabase-schema.sql in the codebase.`;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    showToast('Schema Copied!', 'Pasted SQL schema. You can run it in Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="py-6 sm:py-8 bg-[#FAF9F7] min-h-screen" id="admin-console-page">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full p-0.5 bg-white shadow-md overflow-hidden shrink-0 hidden sm:flex items-center justify-center">
              <img
                src={bdsLogoImg}
                alt="BDS UET Narowal Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800">
                  BDS UET Operations Desk
                </span>
                <span className="text-xs text-slate-400 font-mono">Live Dispatch Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Emergency Coordination & Administration
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Real-time request dispatching, donor management, and campaign analytics across UET Narowal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'database'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              id="admin-header-supabase-btn"
              title="Supabase live cloud database status & sync"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'notifications'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              id="admin-header-notifications-btn"
              title="View account dispatch alerts and notifications"
            >
              <Bell className="w-4 h-4 text-red-400" />
              <span>Notifications</span>
              {unreadNotificationCount > 0 ? (
                <span className="bg-[#B4232C] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-slate-900">
                  {unreadNotificationCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">({notifications.length})</span>
              )}
            </button>


            <div className="text-right pl-2 border-l border-slate-800 hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-medium">Hospital Liaison</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <strong className="text-sm text-emerald-400 font-mono font-bold">24/7 ONLINE</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide Bar Trigger Bar */}
        <div className="lg:hidden bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            id="mobile-open-sidebar-btn"
          >
            <Menu className="w-4 h-4 text-red-400" />
            <span>Open Slide Bar</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Current Section</span>
            <span className="text-xs font-bold text-slate-900">
              {navItems.find((i) => i.id === activeTab)?.label}
            </span>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Slide Bar Panel */}
            <div className="relative w-80 max-w-[85vw] bg-slate-900 text-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300 border-r border-slate-800">
              <div>
                <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full p-0.5 bg-white shadow-md overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={bdsLogoImg}
                        alt="BDS Logo"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                        BDS Operations
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">Admin Slide Bar</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close slide bar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <nav className="space-y-1.5 mt-5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        id={`${item.btnId}-mobile`}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#B4232C] text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Hospital Liaison</span>
                    <span className="text-emerald-400 text-[10px] font-mono font-bold">ONLINE</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    DHQ Hospital & Sughra Shafi Complex dispatch active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Flex Container: Left Slide Bar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Left Slide Bar */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md sticky top-24 min-h-[580px] justify-between">
            <div>
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full p-0.5 bg-white shadow-md overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={bdsLogoImg}
                    alt="BDS Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    Operations Desk
                  </span>
                  <h3 className="text-sm font-extrabold text-white mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Admin Slide Bar</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">UET Narowal Hub</p>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="space-y-1.5 mt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      id={item.btnId}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left group cursor-pointer ${
                        isActive
                          ? 'bg-[#B4232C] text-white shadow-md shadow-red-950/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isActive ? 'bg-white/15 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-bold text-xs">{item.label}</span>
                          <span
                            className={`block text-[10px] truncate ${isActive ? 'text-red-100' : 'text-slate-400'}`}
                          >
                            {item.sublabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.pendingCount && item.pendingCount > 0 ? (
                          <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-2xs">
                            {item.pendingCount}
                          </span>
                        ) : (
                          <span
                            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : item.badgeColor
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Widgets */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Hospital Liaison</span>
                  <span className="text-emerald-400 text-[10px] font-mono font-bold">ONLINE</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  DHQ Hospital Narowal & Sughra Shafi Complex dispatch active.
                </p>
              </div>

              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                  AR
                </div>
                <div className="min-w-0 text-left">
                  <span className="block text-xs font-bold text-white truncate">Ali Raza</span>
                  <span className="block text-[10px] text-slate-400 truncate">BDS Operations Lead</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-6">

        {/* TAB 1: Blood Requests Management */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search code, patient, hospital..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                />
              </div>

              <div className="text-xs text-slate-500">
                Displaying <strong>{filteredRequests.length}</strong> active coordination cases
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">Code</th>
                      <th className="py-3 px-4 font-bold">Patient & Hospital</th>
                      <th className="py-3 px-4 font-bold">Group & Units</th>
                      <th className="py-3 px-4 font-bold">Urgency</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Attendant Contact</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.requestCode}</td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{req.patientName}</strong>
                          <span className="text-slate-500 text-[11px]">
                            {req.hospitalName} ({req.hospitalCity})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <BloodGroupBadge group={req.bloodGroup} size="sm" />
                            <span className="font-semibold">{req.unitsRequired} Bag(s)</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={req.urgency} type="urgency" />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={req.status} type="request" />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-800">{req.requesterPhone}</div>
                          <span className="text-[10px] text-slate-400">{req.requesterName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBroadcastAlert(req)}
                              title="Broadcast alert to matching donors"
                              className="p-1.5 rounded-lg bg-red-50 text-[#B4232C] hover:bg-red-100 border border-red-200 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenStatusModal(req)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                            >
                              Update Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Donor Management */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, campus, ID..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                <select
                  value={donorGroupFilter}
                  onChange={(e) => setDonorGroupFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                >
                  <option value="all">All Blood Groups</option>
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-500">
                <strong>{filteredDonors.length}</strong> registered donors in database
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">Donor ID</th>
                      <th className="py-3 px-4 font-bold">Name & Campus</th>
                      <th className="py-3 px-4 font-bold">Blood Group</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Emergency On-Call</th>
                      <th className="py-3 px-4 font-bold">Past Donations</th>
                      <th className="py-3 px-4 font-bold">Contact (Protected)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredDonors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{donor.id.toUpperCase()}</td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{donor.name}</strong>
                          <span className="text-slate-500 text-[11px]">
                            {donor.campus} • {donor.area}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={donor.availabilityStatus} type="availability" />
                        </td>
                        <td className="py-3.5 px-4">
                          {donor.emergencyAvailable ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              Yes (On-Call)
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{donor.donationCount} Units</td>
                        <td className="py-3.5 px-4 font-mono text-slate-800">
                          {donor.phone.slice(0, 4)}****{donor.phone.slice(-3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Campaigns Management */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#B4232C] uppercase">{camp.campus}</span>
                      <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {camp.venue} • {camp.date}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {camp.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Registered Donors</span>
                      <strong className="text-slate-900 font-bold">
                        {camp.registeredCount} / {camp.capacity} ({Math.round((camp.registeredCount / camp.capacity) * 100)}%)
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-[#B4232C]"
                        style={{ width: `${(camp.registeredCount / camp.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => navigate('campaign-detail', { campaignSlug: camp.slug })}
                      className="text-xs font-bold text-[#B4232C] hover:underline"
                    >
                      View Public Drive Page →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Volunteer Applications */}
        {activeTab === 'volunteers' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Student Volunteer Applications</h3>
              <span className="text-xs text-slate-500">{volunteers.length} total applicant(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Applicant Name</th>
                    <th className="py-3 px-4 font-bold">Campus & Dept</th>
                    <th className="py-3 px-4 font-bold">Preferred Wing</th>
                    <th className="py-3 px-4 font-bold">Skills</th>
                    <th className="py-3 px-4 font-bold">Contact</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {volunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{vol.name}</td>
                      <td className="py-3.5 px-4">
                        {vol.campus} ({vol.department} {vol.batch})
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{vol.preferredRole}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {vol.skills.slice(0, 2).map((s) => (
                            <span key={s} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{vol.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                          {vol.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Guide & Article Approvals Management */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 text-xs font-medium block">Total Guides</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{articles.length}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">In medical library</span>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-xs">
                <span className="text-amber-800 text-xs font-bold block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Verification</span>
                </span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">{pendingArticles.length}</span>
                <span className="text-[11px] text-amber-700 mt-0.5 block">Requires coordinator review</span>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-xs">
                <span className="text-emerald-800 text-xs font-bold block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Published & Live</span>
                </span>
                <span className="text-2xl font-black text-emerald-900 mt-1 block">{approvedArticles.length}</span>
                <span className="text-[11px] text-emerald-700 mt-0.5 block">Active for readers</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 text-xs font-medium block">Community Submissions</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {articles.filter((a) => a.isCommunitySubmission).length}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Submitted via form</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setArticleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    articleFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({articles.length})
                </button>
                <button
                  onClick={() => setArticleFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    articleFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <span>Pending ({pendingArticles.length})</span>
                </button>
                <button
                  onClick={() => setArticleFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    articleFilter === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Published ({approvedArticles.length})
                </button>
                <button
                  onClick={() => setArticleFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    articleFilter === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Rejected ({rejectedArticles.length})
                </button>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, author, affiliation..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                />
              </div>
            </div>

            {/* Articles List */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No Articles Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No submissions match your selected filter &ldquo;{articleFilter}&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((art) => {
                  const isPending = art.approvalStatus === 'pending';
                  const isApproved = !art.approvalStatus || art.approvalStatus === 'approved';
                  const isRejected = art.approvalStatus === 'rejected';

                  return (
                    <div
                      key={art.id}
                      className={`bg-white rounded-3xl border p-6 transition-all space-y-4 shadow-xs ${
                        isPending
                          ? 'border-amber-200 ring-2 ring-amber-100/50'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-[11px] text-[#8F1D25] bg-red-100/80 px-2.5 py-0.5 rounded-lg">
                              {art.category}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500 font-medium">{art.readTime}</span>
                            {art.isCommunitySubmission && (
                              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                                Community Contributor Form
                              </span>
                            )}
                          </div>

                          <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                            {art.title}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Verification</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified & Published</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Author & Verification Card */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 text-xs space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-red-100 text-[#8F1D25] font-bold flex items-center justify-center shrink-0">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-slate-900 block text-xs">{art.author}</strong>
                              <span className="text-slate-500 text-[11px]">
                                {art.authorRole} {art.authorAffiliation ? `• ${art.authorAffiliation}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-600 text-[11px] flex-wrap">
                            {art.authorEmail && (
                              <a
                                href={`mailto:${art.authorEmail}`}
                                className="inline-flex items-center gap-1 text-[#B4232C] hover:underline"
                              >
                                <Mail className="w-3 h-3" />
                                <span>{art.authorEmail}</span>
                              </a>
                            )}
                            {art.authorPhone && (
                              <a
                                href={`tel:${art.authorPhone}`}
                                className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-mono"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>{art.authorPhone}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Credential Notes */}
                        {(art.authorCnicOrRoll || art.authorVerificationNotes) && (
                          <div className="text-[11px] text-slate-600 space-y-1">
                            {art.authorCnicOrRoll && (
                              <div>
                                <strong className="text-slate-800">Verification Ref: </strong>
                                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {art.authorCnicOrRoll}
                                </span>
                              </div>
                            )}
                            {art.authorVerificationNotes && (
                              <div>
                                <strong className="text-slate-800">Contributor Note: </strong>
                                <span>{art.authorVerificationNotes}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {art.reviewedBy && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Approved by <strong>{art.reviewedBy}</strong> on{' '}
                              {art.reviewedAt ? new Date(art.reviewedAt).toLocaleDateString() : 'recent review'}
                            </span>
                          </div>
                        )}

                        {art.rejectionReason && (
                          <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200">
                            <strong>Rejection Feedback: </strong>
                            <span>{art.rejectionReason}</span>
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 leading-relaxed">{art.summary}</p>

                      {/* Action Bar */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewArticle(art)}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Full Content</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectModalArticle(art);
                                  setRejectionReason('');
                                }}
                                className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>

                              <button
                                onClick={() => {
                                  setApprovingArticle(art);
                                  setApprovalNote('');
                                }}
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verify & Approve Content</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <button
                                onClick={() => navigate('article-detail', { articleSlug: art.slug })}
                                className="inline-flex items-center gap-1 text-[#B4232C] hover:bg-red-50 border border-red-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>View Live</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                                    deleteArticle(art.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isRejected && (
                            <>
                              <button
                                onClick={() => {
                                  setApprovingArticle(art);
                                  setApprovalNote('');
                                }}
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Re-evaluate & Approve</span>
                              </button>
                              <button
                                onClick={() => deleteArticle(art.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Audit Activity Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">System Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable record of donor requests, status transitions, and actions.</p>

            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="bg-slate-100 text-slate-600 font-mono text-[10px] px-1.5 py-0.5 rounded">
                        {log.entityType}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <span className="text-[10px] text-slate-400">By: {log.performedBy}</span>
                  </div>

                  <span className="font-mono text-slate-400 text-[11px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Notifications & Dispatch Alerts */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6" id="admin-notifications-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">Live Dispatch & System Alerts</h3>
                  {unreadNotificationCount > 0 && (
                    <span className="text-xs bg-red-100 text-[#B4232C] font-bold px-2 py-0.5 rounded-full">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time incoming emergency alerts, donor commitments, and system operation logs.
                </p>
              </div>

              {unreadNotificationCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-[#B4232C] font-bold text-xs rounded-xl border border-red-200 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark All as Read</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-600">No active dispatch notifications</p>
                <p className="text-xs text-slate-400 mt-1">All hospital blood requests and donor dispatch alerts are cleared.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionLink) {
                        if (n.actionLink === 'admin') setActiveTab('requests');
                        else navigate(n.actionLink);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      !n.read
                        ? 'bg-red-50/40 border-red-200 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        !n.read ? 'bg-[#B4232C] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#B4232C] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 inline-block font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          {new Date(n.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {!n.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(n.id);
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
                        >
                          Mark read
                        </button>
                      )}
                      {n.actionLink && (
                        <span className="text-xs font-bold text-[#B4232C] flex items-center gap-1 hover:underline">
                          <span>View Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: Contact Inquiries */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Public Contact Inquiries</h3>
                <p className="text-xs text-slate-500">
                  Messages submitted via the Contact BDS UET Narowal Desk. Saved in Supabase `contact_messages` table.
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Total Inquiries: <strong>{contactMessages.length}</strong>
              </div>
            </div>

            {contactMessages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 text-slate-400 space-y-3">
                <Mail className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700">No contact messages received yet</p>
                <p className="text-xs text-slate-500">
                  When visitors submit inquiries on the Contact Us page, they will appear here and be stored in Supabase.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-bold">Sender</th>
                        <th className="py-3 px-4 font-bold">Subject</th>
                        <th className="py-3 px-4 font-bold">Message</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Date</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {contactMessages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <strong className="text-slate-900 block">{msg.name}</strong>
                            <span className="text-slate-500 text-[11px] font-mono">{msg.email}</span>
                            {msg.phone && <div className="text-slate-400 text-[10px] font-mono">{msg.phone}</div>}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{msg.subject}</td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-2 text-slate-600 text-[11px] leading-relaxed">{msg.message}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {msg.status || 'New'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)} - BDS UET Narowal`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Supabase Database Sync & SQL Setup */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Live Connection Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                      Supabase Cloud Database Connected
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    PostgreSQL Live Database Synchronization
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Connected to Supabase project <code className="text-emerald-300 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">{SUPABASE_PROJECT_ID}</code>. 
                    All data including user registration/login, donors, blood requests, emergency dispatch, contact inquiries, guides, events, and audit logs are synchronized.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSyncSupabase}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Syncing...' : 'Sync Live Cloud Data'}</span>
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Open Supabase SQL Editor</span>
                  </a>
                </div>
              </div>

              {/* Status Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Project ID</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm truncate block">{SUPABASE_PROJECT_ID}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cloud Endpoint</span>
                  <span className="font-mono text-emerald-300 text-xs truncate block">{SUPABASE_URL}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Authentication</span>
                  <span className="text-emerald-400 font-bold block">Anonymous API Key Active</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Synchronized</span>
                  <span className="text-white font-mono text-xs block">{supabaseStatus.lastSyncedAt || 'Live Auto-Sync'}</span>
                </div>
              </div>
            </div>

            {/* Managed Database Tables Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Configured Cloud Tables & Entities</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-world schema mapping across all application features
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySchema}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#8F1D25] border border-red-200 rounded-xl text-xs font-bold transition-all"
                  >
                    {copiedSchema ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSchema ? 'SQL Copied!' : 'Copy Schema (supabase-schema.sql)'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    table: 'donors',
                    label: 'Donors & Public Search',
                    count: `${donors.length} Donors`,
                    desc: 'Searchable blood donor directory, blood groups, campus affiliations & availability.',
                  },
                  {
                    table: 'blood_requests',
                    label: 'Blood Requests & Tracking',
                    count: `${requests.length} Requests`,
                    desc: 'Intake tickets, patient details, hospital requirements, and coordinator dispatches.',
                  },
                  {
                    table: 'emergency_alerts',
                    label: 'Emergency Alerts',
                    count: `${requests.filter((r) => r.urgency === 'Critical').length} Critical Cases`,
                    desc: 'High-priority emergency alerts broadcasted across UET Narowal network.',
                  },
                  {
                    table: 'users',
                    label: 'User Accounts & Roles',
                    count: 'Admin / Team / Donor',
                    desc: 'Role-based access credentials (BDS Patron, Coordinators, Donors, Requesters).',
                  },
                  {
                    table: 'contact_messages',
                    label: 'Contact Messages',
                    count: `${contactMessages.length} Messages`,
                    desc: 'Public inquiries, hospital partnership requests, and awareness questions.',
                  },
                  {
                    table: 'articles',
                    label: 'Knowledge Articles & Guides',
                    count: `${articles.length} Articles`,
                    desc: 'Clinical donation guides, community submissions, and editorial approvals.',
                  },
                  {
                    table: 'events_campaigns',
                    label: 'Events & Blood Camps',
                    count: `${campaigns.length} Camps`,
                    desc: 'Campus blood donation drives with target vs collected units tracking.',
                  },
                  {
                    table: 'campaign_registrations',
                    label: 'Camp Registrations',
                    count: `${campaignRegistrations.length} Registrations`,
                    desc: 'Donor slot bookings, check-in status, and digital pass generation.',
                  },
                  {
                    table: 'volunteers',
                    label: 'Student Volunteers',
                    count: `${volunteers.length} Applicants`,
                    desc: 'BDS student wing registrations, skill inventories, and coordinator reviews.',
                  },
                  {
                    table: 'success_stories',
                    label: 'Success Stories',
                    count: `${stories.length} Stories`,
                    desc: 'Life-saving narratives, patient references, and verified quotes.',
                  },
                  {
                    table: 'audit_logs',
                    label: 'Audit & Security Trails',
                    count: `${auditLogs.length} Records`,
                    desc: 'Every status update, approval, and verification event logged with actor.',
                  },
                  {
                    table: 'notifications',
                    label: 'Notifications & Alerts',
                    count: `${notifications.length} Alerts`,
                    desc: 'In-app notification items and dispatch reminders.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200/60">
                        {item.table}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">{item.count}</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 pt-1">{item.label}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick SQL Editor Instructions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">One-Time Supabase Database Setup</h3>
                  <p className="text-xs text-slate-500">
                    How to initialize or refresh all tables in your Supabase dashboard in 30 seconds
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900">Copy Schema File</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    The root file <code className="font-mono text-red-700 bg-red-50 px-1 py-0.5 rounded">/supabase-schema.sql</code> contains the complete PostgreSQL DDL with RLS policies and seed data.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900">Paste in SQL Editor</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Open <a href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`} target="_blank" rel="noreferrer" className="text-red-700 font-bold underline">Supabase SQL Editor</a>, paste the SQL statements, and click <strong>Run</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900">Click Sync Live Data</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Click "Sync Live Cloud Data" at top. All donor requests, camps, articles, and accounts will seamlessly persist directly in your Supabase database!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="Update Blood Request Status"
          subtitle={selectedRequest ? `Case: ${selectedRequest.requestCode} (${selectedRequest.patientName})` : ''}
        >
          <form onSubmit={handleSaveStatusUpdate} className="space-y-4 text-xs" id="update-status-form">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">New Workflow Stage *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#B4232C] bg-white"
              >
                <option value="Submitted">Submitted (Pending Review)</option>
                <option value="Under Review">Under Review (Verifying Hospital)</option>
                <option value="Donor Search Active">Donor Search Active (Dispatching calls)</option>
                <option value="Donor Found">Donor Found (Cross-matching in progress)</option>
                <option value="Donation Confirmed">Donation Confirmed (Donor arrived at blood bank)</option>
                <option value="Completed">Completed (Donation successfully fulfilled)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Coordinator Name</label>
              <input
                type="text"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Coordination Update Note / Hospital Slip Reference *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Spoke with Mayo Blood Bank Dr. Naveed. Contacted 2 O- donors from Zubair Hall hostel..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold px-5 py-2 rounded-xl shadow-xs"
              >
                Save & Broadcast Note
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: Full Article Reader & Verification Preview */}
        <Modal
          isOpen={Boolean(previewArticle)}
          onClose={() => setPreviewArticle(null)}
          title={previewArticle?.title || 'Guide Content Preview'}
          subtitle={`Category: ${previewArticle?.category} • Contributor: ${previewArticle?.author}`}
          maxWidth="3xl"
        >
          {previewArticle && (
            <div className="space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
              {/* Contributor Verification Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#8F1D25] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">{previewArticle.author}</h5>
                    <p className="text-[11px] text-slate-500">
                      {previewArticle.authorRole} • {previewArticle.authorAffiliation || 'Contributor'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  {previewArticle.authorEmail && <div>{previewArticle.authorEmail}</div>}
                  {previewArticle.authorPhone && <div className="font-mono">{previewArticle.authorPhone}</div>}
                </div>
              </div>

              {previewArticle.authorVerificationNotes && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900">
                  <strong>Verification Reference & Background: </strong>
                  <span>{previewArticle.authorVerificationNotes}</span>
                  {previewArticle.authorCnicOrRoll && (
                    <span className="block mt-1 font-mono font-bold text-amber-950">
                      Ref ID: {previewArticle.authorCnicOrRoll}
                    </span>
                  )}
                </div>
              )}

              {/* Cover Image & Abstract */}
              <div className="space-y-3">
                {previewArticle.featuredImage && (
                  <div className="h-48 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={previewArticle.featuredImage}
                      alt={previewArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="bg-red-50/60 border-l-4 border-[#B4232C] p-3.5 rounded-r-xl text-slate-700 font-medium leading-relaxed">
                  {previewArticle.summary}
                </div>
              </div>

              {/* Content Body */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-slate-800 text-xs sm:text-sm leading-relaxed">
                {previewArticle.content.split('\n\n').map((para, idx) => {
                  if (para.startsWith('###')) {
                    return (
                      <h4 key={idx} className="text-base font-extrabold text-slate-900 pt-3">
                        {para.replace('###', '').trim()}
                      </h4>
                    );
                  }
                  if (para.startsWith('##')) {
                    return (
                      <h3 key={idx} className="text-lg font-black text-slate-900 pt-4">
                        {para.replace('##', '').trim()}
                      </h3>
                    );
                  }
                  if (para.startsWith('-')) {
                    const bullets = para.split('\n').map((b) => b.replace('-', '').trim());
                    return (
                      <ul key={idx} className="space-y-1.5 list-disc pl-5 text-slate-700">
                        {bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx}>{para}</p>;
                })}
              </div>

              {/* Modal Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewArticle(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close Preview
                </button>

                {previewArticle.approvalStatus === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = previewArticle;
                        setPreviewArticle(null);
                        setRejectModalArticle(target);
                        setRejectionReason('');
                      }}
                      className="px-3.5 py-2 font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = previewArticle;
                        setPreviewArticle(null);
                        setApprovingArticle(target);
                        setApprovalNote('');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Publish Guide</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Verification & Approval Confirmation */}
        <Modal
          isOpen={Boolean(approvingArticle)}
          onClose={() => setApprovingArticle(null)}
          title="Verify & Publish Guide"
          subtitle={approvingArticle ? `"${approvingArticle.title}" by ${approvingArticle.author}` : ''}
          maxWidth="md"
        >
          {approvingArticle && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Medical Review & Approval Checklist</span>
                </div>
                <ul className="space-y-1 text-emerald-800 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contributor credentials and contact verified</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Content audited for clinical safety & accuracy</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Immediate publication to public Donation Guide</span>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Optional Reviewer Note / Clinical Endorsement
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Verified by BDS UET Medical Advisory Board. Approved for community clinical literacy."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApprovingArticle(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveArticle(approvingArticle)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Publish Now</span>
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Rejection Reason */}
        <Modal
          isOpen={Boolean(rejectModalArticle)}
          onClose={() => setRejectModalArticle(null)}
          title="Reject Article Submission"
          subtitle={rejectModalArticle ? `"${rejectModalArticle.title}"` : ''}
          maxWidth="md"
        >
          {rejectModalArticle && (
            <form onSubmit={handleRejectArticle} className="space-y-4 text-xs text-slate-700">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-rose-800 text-[11px]">
                Please explain why this submission cannot be approved so the contributor or medical board can address
                any issues.
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Reason for Rejection / Revision Request *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Please provide specific clinical references or PMDC registration number. Content contains unsubstantiated statements regarding donor waiting times..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B4232C]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalArticle(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          )}
        </Modal>
          </main>
        </div>
      </div>
    </div>
  );
};
