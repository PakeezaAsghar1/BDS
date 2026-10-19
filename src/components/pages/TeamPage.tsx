import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { Modal } from '../common/Modal';
import {
  Users,
  Shield,
  Heart,
  Phone,
  Mail,
  Award,
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  GraduationCap,
  Layers,
  MapPin,
  Clock,
  UserCheck
} from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';
import teamPhotoImg from '../../assets/images/bds_team_volunteers_1792275955213.jpg';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'advisors' | 'cabinet' | 'emergency' | 'camps' | 'media' | 'tech';
  categoryLabel: string;
  department: string;
  session?: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  avatarInitials: string;
  avatarColor: string;
  email: string;
  phone?: string;
  bio: string;
  achievements?: string[];
  donationsCount?: number;
  isOnEmergencyDuty?: boolean;
  dutyHours?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  // 1. Advisors & Patrons
  {
    id: 'zafar-patron',
    name: 'Prof. Dr. Muhammad Zafar',
    role: 'Patron-in-Chief & Campus Director',
    category: 'advisors',
    categoryLabel: 'Faculty Advisory Council',
    department: 'Office of the Campus Director, UET Narowal',
    bloodGroup: 'B+',
    avatarInitials: 'MZ',
    avatarColor: 'from-amber-600 to-amber-900',
    email: 'director@narowal.uet.edu.pk',
    phone: '+92 542 920051',
    bio: 'Championing institutional humanitarian outreach and patronizing student volunteer leadership across all engineering disciplines at UET Narowal.',
    achievements: [
      'Institutional founder and sponsor of BDS UET Narowal',
      'Established campus emergency transport protocol for blood donors',
      'Institutional patronage of annual Thalassemia relief drives'
    ],
    donationsCount: 18,
    dutyHours: 'Administrative Hours (Campus Directorate)'
  },
  {
    id: 'hamza-advisor',
    name: 'Dr. Engr. Hamza Farooq',
    role: 'Faculty Staff Advisor',
    category: 'advisors',
    categoryLabel: 'Faculty Advisory Council',
    department: 'Department of Electrical Engineering',
    bloodGroup: 'O+',
    avatarInitials: 'HF',
    avatarColor: 'from-red-700 to-red-950',
    email: 'hamza.farooq@narowal.uet.edu.pk',
    phone: '+92 300 5412890',
    bio: 'Overseeing society governance, student cabinet mentoring, hospital coordination policies, and ethical standards across all official activities.',
    achievements: [
      '5+ years continuous faculty advisory leadership for BDS UET',
      'Authored the society standard operating procedure (SOP) manual',
      'Active voluntary whole-blood donor for over a decade'
    ],
    donationsCount: 24,
    dutyHours: 'Academic Faculty Advising'
  },
  {
    id: 'ayesha-medical',
    name: 'Dr. Ayesha Siddiqua',
    role: 'Chief Clinical Medical Advisor',
    category: 'advisors',
    categoryLabel: 'Faculty Advisory Council',
    department: 'Consultant Hematologist, DHQ Hospital Narowal',
    bloodGroup: 'A+',
    avatarInitials: 'AS',
    avatarColor: 'from-emerald-700 to-emerald-950',
    email: 'medical.desk@bdsuet.org',
    phone: '+92 542 920078',
    bio: 'Guiding clinical screening protocols, safe transfusion intervals, donor recovery standards, and Thalassemia cross-matching compliance.',
    achievements: [
      'Medical Lead, DHQ Hospital Narowal Blood Transfusion Unit',
      'Clinical supervisor for all BDS UET on-campus donation camps',
      'Regular contributor to the BDS UET Clinical Donation Guide'
    ],
    donationsCount: 14,
    dutyHours: 'Hospital Shift & 24/7 Clinical Consultation'
  },

  // 2. Executive Cabinet
  {
    id: 'bilal-president',
    name: 'Muhammad Bilal Arshad',
    role: 'President, BDS UET',
    category: 'cabinet',
    categoryLabel: 'Executive Cabinet',
    department: 'Electrical Engineering',
    session: 'Session 2021-2025',
    bloodGroup: 'O-',
    avatarInitials: 'BA',
    avatarColor: 'from-rose-600 to-[#8F1D25]',
    email: 'president@bdsuet.org',
    phone: '+92 301 7654321',
    bio: 'Leading overall operations, strategic hospital MOUs, student mobilization, and emergency blood dispatch response across UET Narowal.',
    achievements: [
      'Coordinated 350+ urgent live emergency donor dispatches',
      'Organized the landmark 2024 & 2025 Grand Campus Blood Camps',
      'Universal O- donor on active high-priority hospital call'
    ],
    donationsCount: 9,
    isOnEmergencyDuty: true,
    dutyHours: 'Available 24/7 for Critical Trauma Cases'
  },
  {
    id: 'fatima-vp',
    name: 'Syeda Fatima Zahra',
    role: 'Vice President',
    category: 'cabinet',
    categoryLabel: 'Executive Cabinet',
    department: 'Computer Science',
    session: 'Session 2021-2025',
    bloodGroup: 'B+',
    avatarInitials: 'FZ',
    avatarColor: 'from-purple-700 to-purple-950',
    email: 'vp@bdsuet.org',
    phone: '+92 302 8765432',
    bio: 'Spearheading female donor engagement, awareness drives across girls hostels, society internal operations, and donor wellness monitoring.',
    achievements: [
      'Pioneered the UET Female Donor Awareness Initiative',
      'Expanded voluntary female donor registration by 140%',
      'Directed 4 major seminar workshops on iron health & Thalassemia'
    ],
    donationsCount: 6,
    dutyHours: 'Hostel & Campus Coordination'
  },
  {
    id: 'abdullah-gs',
    name: 'Muhammad Abdullah',
    role: 'General Secretary',
    category: 'cabinet',
    categoryLabel: 'Executive Cabinet',
    department: 'Mechanical Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'A+',
    avatarInitials: 'MA',
    avatarColor: 'from-slate-700 to-slate-950',
    email: 'gs@bdsuet.org',
    phone: '+92 303 9876543',
    bio: 'Managing formal correspondence with university administrative bodies, hospital permissions, event scheduling, and general membership logs.',
    achievements: [
      'Maintains official society registry of 1,200+ active donors',
      'Liaison for UET security and district administration permissions',
      'Coordinated with Red Crescent Punjab for logistical equipment'
    ],
    donationsCount: 7,
    dutyHours: 'Executive Secretariat Desk'
  },
  {
    id: 'areeba-js',
    name: 'Areeba Noor',
    role: 'Joint Secretary',
    category: 'cabinet',
    categoryLabel: 'Executive Cabinet',
    department: 'Civil Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'AB+',
    avatarInitials: 'AN',
    avatarColor: 'from-teal-700 to-teal-950',
    email: 'jointsec@bdsuet.org',
    phone: '+92 304 1234567',
    bio: 'Overseeing volunteer wing deployments, post-camp refreshments, donor appreciation certifications, and internal society meetings.',
    achievements: [
      'Mentors 40+ junior student volunteers in event handling',
      'Led the post-donation clinical care and wellness monitoring wing',
      'Organized 6 inter-departmental blood drive campaigns'
    ],
    donationsCount: 5,
    dutyHours: 'Volunteer Wing Liaison'
  },
  {
    id: 'usama-finance',
    name: 'Usama Tariq',
    role: 'Finance Secretary',
    category: 'cabinet',
    categoryLabel: 'Executive Cabinet',
    department: 'Computer Science',
    session: 'Session 2022-2026',
    bloodGroup: 'O+',
    avatarInitials: 'UT',
    avatarColor: 'from-blue-700 to-blue-950',
    email: 'finance@bdsuet.org',
    phone: '+92 305 2345678',
    bio: 'Maintaining non-commercial financial transparency, emergency donor travel reimbursements, camp refreshment budgets, and verified audits.',
    achievements: [
      '100% auditable record of all volunteer welfare and camp funds',
      'Zero commercial charges or profit policy enforcement',
      'Established the Emergency Donor Fuel Subsidy reserve'
    ],
    donationsCount: 8,
    dutyHours: 'Treasury & Audit Verification'
  },

  // 3. Emergency Response & Hospital Dispatch
  {
    id: 'ali-dispatch',
    name: 'Ali Raza',
    role: 'Head of Emergency Dispatch (Live Desk)',
    category: 'emergency',
    categoryLabel: 'Emergency Response & Dispatch',
    department: 'Computer Science',
    session: 'Session 2023-2027',
    bloodGroup: 'O+',
    avatarInitials: 'AR',
    avatarColor: 'from-red-600 to-red-900',
    email: 'dispatch@bdsuet.org',
    phone: '+92 300 8472910',
    bio: 'Operating the 24/7 BDS Emergency Helpline, verifying hospital emergency cases, matching compatible donors, and tracking live donor arrival.',
    achievements: [
      'Responded to 280+ midnight emergency calls across Narowal',
      'Average response time under 12 minutes for ICU patients',
      'Direct link with Mayo, DHQ Narowal, and Al-Hadi blood banks'
    ],
    donationsCount: 6,
    isOnEmergencyDuty: true,
    dutyHours: '24/7 Emergency Dispatch Helpline'
  },
  {
    id: 'saad-liaison',
    name: 'Saad Munir',
    role: 'Hospital Liaison Coordinator',
    category: 'emergency',
    categoryLabel: 'Emergency Response & Dispatch',
    department: 'Mechanical Engineering',
    session: 'Session 2023-2027',
    bloodGroup: 'B-',
    avatarInitials: 'SM',
    avatarColor: 'from-indigo-700 to-indigo-950',
    email: 'liaison@bdsuet.org',
    phone: '+92 306 3456789',
    bio: 'Hospital-based coordinator connecting incoming student donors with ward staff, assisting in blood cross-matching, and verification.',
    achievements: [
      'Facilitated 150+ hospital ward handoffs',
      'Supervised rare negative blood group calls across campus',
      'Trained in patient intake and transfusion logistics'
    ],
    donationsCount: 7,
    isOnEmergencyDuty: true,
    dutyHours: 'Night & Emergency Rotations'
  },
  {
    id: 'khadija-thalassemia',
    name: 'Khadija Imran',
    role: 'Pediatric & Thalassemia Coordinator',
    category: 'emergency',
    categoryLabel: 'Emergency Response & Dispatch',
    department: 'Biomedical / CS',
    session: 'Session 2023-2027',
    bloodGroup: 'A-',
    avatarInitials: 'KI',
    avatarColor: 'from-rose-700 to-rose-950',
    email: 'thalassemia@bdsuet.org',
    phone: '+92 307 4567890',
    bio: 'Managing recurring monthly voluntary donation schedules for 60+ registered children fighting Thalassemia Major in Narowal district.',
    achievements: [
      'Maintains recurring donor rota for 60+ children with Thalassemia',
      'Zero missed transfusion cycles recorded for registered patients',
      'Organizes Thalassemia awareness sessions in campus halls'
    ],
    donationsCount: 4,
    dutyHours: 'Thalassemia Patient Registry Roster'
  },

  // 4. Camps & Logistics
  {
    id: 'hamza-camps',
    name: 'Hamza Tahir',
    role: 'Director of Blood Camps & Drives',
    category: 'camps',
    categoryLabel: 'Blood Camps & Logistics',
    department: 'Mechanical Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'B+',
    avatarInitials: 'HT',
    avatarColor: 'from-amber-700 to-amber-950',
    email: 'camps@bdsuet.org',
    phone: '+92 308 5678901',
    bio: 'Overseeing venue setup, medical bed positioning, clean flow, hydration zones, and paramedic safety arrangements on camp days.',
    achievements: [
      'Executed 8 major campus-wide donation drives without incident',
      'Managed 200+ unit collection record in single-day camp',
      'Certified in campus first response and crowd logistics'
    ],
    donationsCount: 8,
    dutyHours: 'Field Campaigns & Event Days'
  },
  {
    id: 'zohaib-logistics',
    name: 'Zohaib Hassan',
    role: 'Logistics & Supply Manager',
    category: 'camps',
    categoryLabel: 'Blood Camps & Logistics',
    department: 'Civil Engineering',
    session: 'Session 2023-2027',
    bloodGroup: 'AB-',
    avatarInitials: 'ZH',
    avatarColor: 'from-slate-700 to-slate-900',
    email: 'logistics@bdsuet.org',
    phone: '+92 309 6789012',
    bio: 'Coordinating blood bag inventory, sterile needle disposal, donor badges, refreshments, and emergency transport arrangements.',
    achievements: [
      'Procurement and stock management for medical camp supplies',
      'Zero medical contamination or protocol breaches recorded',
      'Maintains vehicle emergency fleet for donor pickup'
    ],
    donationsCount: 5,
    dutyHours: 'Camp Logistics Scheduling'
  },

  // 5. Media, PR & Outreach
  {
    id: 'daniyal-media',
    name: 'Daniyal Hassan',
    role: 'Head of Media & Creative Design',
    category: 'media',
    categoryLabel: 'Media, PR & Creative Wing',
    department: 'Computer Science',
    session: 'Session 2023-2027',
    bloodGroup: 'A+',
    avatarInitials: 'DH',
    avatarColor: 'from-sky-700 to-sky-950',
    email: 'media@bdsuet.org',
    phone: '+92 310 7890123',
    bio: 'Directing visual storytelling, video documentaries of Thalassemia survivors, campaign posters, social media alerts, and photo galleries.',
    achievements: [
      'Produced 40+ high-engagement visual campaigns and posters',
      'Director of the BDS UET Annual Documentary film',
      'Manages social broadcasting with over 15k student reach'
    ],
    donationsCount: 4,
    dutyHours: 'Media & Communications Wing'
  },
  {
    id: 'zunaira-pr',
    name: 'Zunaira Malik',
    role: 'Director of Public Relations & Outreach',
    category: 'media',
    categoryLabel: 'Media, PR & Creative Wing',
    department: 'Electrical Engineering',
    session: 'Session 2023-2027',
    bloodGroup: 'O+',
    avatarInitials: 'ZM',
    avatarColor: 'from-pink-700 to-pink-950',
    email: 'pr@bdsuet.org',
    phone: '+92 311 8901234',
    bio: 'Fostering inter-departmental collaborations, organizing orientation lectures for first-year students, and debunking common blood donation myths.',
    achievements: [
      'Delivered orientation talks to 1,500+ incoming engineering students',
      'Formed partnerships with 5 university clubs for joint blood drives',
      'Authored student health awareness leaflets'
    ],
    donationsCount: 5,
    dutyHours: 'Outreach & Campus Engagement'
  },

  // 6. Technical & IT Wing
  {
    id: 'zainab-tech',
    name: 'Zainab Tariq',
    role: 'Lead Web & Software Architect',
    category: 'tech',
    categoryLabel: 'Technical & Platform Wing',
    department: 'Computer Science',
    session: 'Session 2022-2026',
    bloodGroup: 'B+',
    avatarInitials: 'ZT',
    avatarColor: 'from-cyan-700 to-cyan-950',
    email: 'tech@bdsuet.org',
    phone: '+92 312 9012345',
    bio: 'Architect of the BDS UET web application, automated donor matching algorithms, emergency SMS gateway, and privacy security controls.',
    achievements: [
      'Engineered the BDS digital platform with 99.9% uptime',
      'Implemented end-to-end donor anonymization and privacy safeguards',
      'Built automated blood group compatibility matrix filters'
    ],
    donationsCount: 6,
    dutyHours: 'Software Systems Architecture'
  },
  {
    id: 'fahad-data',
    name: 'Fahad Mehmood',
    role: 'Systems Security & Data Officer',
    category: 'tech',
    categoryLabel: 'Technical & Platform Wing',
    department: 'Computer Science',
    session: 'Session 2023-2027',
    bloodGroup: 'O-',
    avatarInitials: 'FM',
    avatarColor: 'from-slate-700 to-zinc-950',
    email: 'security@bdsuet.org',
    phone: '+92 313 0123456',
    bio: 'Ensuring strict compliance with user confidentiality, verifiable donation audit trails, system backups, and emergency alert bots.',
    achievements: [
      'Maintains automated database backup systems and zero data leaks',
      'Configured emergency hospital WhatsApp and SMS broadcast pipelines',
      'Universal donor on high-priority hospital call'
    ],
    donationsCount: 5,
    isOnEmergencyDuty: true,
    dutyHours: 'Infrastructure Monitoring'
  }
];

export const TeamPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const categories = [
    { id: 'all', label: 'All Team Members' },
    { id: 'advisors', label: 'Advisors & Patrons' },
    { id: 'cabinet', label: 'Executive Cabinet' },
    { id: 'emergency', label: 'Emergency & Dispatch' },
    { id: 'camps', label: 'Camps & Logistics' },
    { id: 'media', label: 'Media & Outreach' },
    { id: 'tech', label: 'Tech & Platform' }
  ];

  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.bloodGroup.toLowerCase().includes(q) ||
        (m.session && m.session.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const copyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `${label}: ${text}`, 'info');
  };

  return (
    <div className="bg-[#FAF9F7] min-h-screen pb-16" id="team-page-container">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2D0609] via-[#480C12] to-[#1E0305] text-white border-b border-red-900/50 py-14 sm:py-18 lg:py-20">
        {/* Subtle Heartbeat ECG Line Background SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex items-center">
          <svg
            className="w-full h-48 stroke-red-400 fill-none"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,60 L250,60 L270,60 L280,20 L295,100 L310,10 L325,85 L340,60 L500,60 L520,60 L530,25 L545,95 L560,15 L575,80 L590,60 L850,60 L870,60 L880,20 L895,100 L910,10 L925,85 L940,60 L1200,60"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-red-400" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
                  OUR EXECUTIVE TEAM & LEADERSHIP
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                The Guardians Behind <span className="text-red-400">BDS UET Narowal</span>
              </h1>

              <p className="text-base sm:text-lg text-red-100/90 leading-relaxed font-normal max-w-2xl">
                Meet the faculty patrons, student executive officers, on-call hospital dispatchers, and campus leads who
                work tirelessly 24/7 to ensure no patient in Narowal suffers due to blood scarcity.
              </p>

              {/* Quick Stat Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                  <span className="block text-2xl font-black text-white">45+</span>
                  <span className="text-[11px] text-red-200 uppercase font-medium">Cabinet Officers</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                  <span className="block text-2xl font-black text-emerald-400">24/7</span>
                  <span className="text-[11px] text-red-200 uppercase font-medium">Emergency Desk</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                  <span className="block text-2xl font-black text-white">6</span>
                  <span className="text-[11px] text-red-200 uppercase font-medium">Specialized Wings</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                  <span className="block text-2xl font-black text-red-400">100%</span>
                  <span className="text-[11px] text-red-200 uppercase font-medium">Voluntary Service</span>
                </div>
              </div>
            </div>

            {/* Right Group Photo Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 opacity-40 blur-xl group-hover:opacity-60 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden border border-red-500/30 bg-black/40 shadow-2xl">
                  <img
                    src={teamPhotoImg}
                    alt="BDS UET Volunteer Officers and Leadership"
                    className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Session 2024-2025 Cabinet</p>
                      <p className="text-[10px] text-slate-300">University of Engineering & Technology, Narowal</p>
                    </div>
                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 font-bold px-2 py-0.5 rounded-full">
                      Annual Rota
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-10">
        {/* Controls Bar: Category Filters & Search */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md shadow-slate-200/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const count = cat.id === 'all'
                ? TEAM_MEMBERS.length
                : TEAM_MEMBERS.filter((m) => m.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#B4232C] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                  }`}
                  id={`team-cat-${cat.id}`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4232C] bg-slate-50/50 focus:bg-white transition-all"
              id="team-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 24/7 Emergency Dispatch Helpline Notice */}
        <div className="bg-gradient-to-r from-red-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-red-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/40 text-red-300 flex items-center justify-center shrink-0 border border-red-500/40">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  Critical Trauma Ward Priority
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Dispatch Active
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                Facing an Urgent Hospital Blood Emergency in Narowal?
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Our on-duty coordination cabinet dispatches verified donors to DHQ Narowal and surrounding emergency rooms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="tel:03008472910"
              className="inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
              id="team-emergency-call-btn"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline: 0300-8472910</span>
            </a>
            <button
              onClick={() => navigate('emergency-request')}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition-all active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 text-red-400" />
              <span>Post Case Online</span>
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <div>
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No team members found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or clearing category filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-red-300 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  id={`team-card-${member.id}`}
                >
                  {/* Card Header & Avatar */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Avatar with Initials and Gradient */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.avatarColor} text-white font-black text-lg flex items-center justify-center shadow-md shadow-black/15 shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          {member.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {member.categoryLabel}
                            </span>
                            {member.isOnEmergencyDuty && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                On Duty
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-[#B4232C] transition-colors leading-tight">
                            {member.name}
                          </h3>
                          <p className="text-xs font-bold text-[#B4232C] mt-0.5">{member.role}</p>
                        </div>
                      </div>

                      {/* Blood Group Badge */}
                      <div className="shrink-0 text-right">
                        <BloodGroupBadge group={member.bloodGroup} size="sm" />
                        <span className="text-[9px] text-slate-400 block font-mono mt-0.5">Verified</span>
                      </div>
                    </div>

                    {/* Department & Session */}
                    <div className="pt-2 text-[11px] text-slate-500 space-y-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{member.department}</span>
                      </div>
                      {member.session && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.session}</span>
                        </div>
                      )}
                    </div>

                    {/* Short Bio */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Card Bottom Footer: Contact Actions & View Profile Button */}
                  <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {member.phone && (
                        <button
                          type="button"
                          onClick={() => copyContact(member.phone!, `${member.name}'s Phone`)}
                          title={`Copy Phone: ${member.phone}`}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#B4232C] hover:bg-white hover:shadow-xs transition-colors border border-transparent hover:border-slate-200"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => copyContact(member.email, `${member.name}'s Email`)}
                        title={`Copy Email: ${member.email}`}
                        className="p-2 rounded-xl text-slate-500 hover:text-[#B4232C] hover:bg-white hover:shadow-xs transition-colors border border-transparent hover:border-slate-200"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B4232C] hover:text-[#8F1D25] hover:underline px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>View Bio & Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Banner - Matching "Join our mission in About Us page" */}
        <section
          className="rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-stretch min-h-[300px]"
          id="join-team-banner"
        >
          {/* Left Photo Area with "Real People. Real Impact." cursive overlay */}
          <div className="relative md:w-5/12 lg:w-5/12 min-h-[240px] sm:min-h-[280px] md:min-h-[320px] overflow-hidden shrink-0">
            <img
              src={bloodDonorArmImg}
              alt="Blood donor arm with red stress ball and IV tubing"
              className="w-full h-full object-cover object-[25%_center]"
            />
            {/* Soft dark vignette on the left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
            {/* Seamless fade to white towards the content on the right (desktop) */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-28 lg:w-40 bg-gradient-to-r from-transparent via-white/80 to-white pointer-events-none" />
            {/* Fade to white on mobile bottom */}
            <div className="md:hidden absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />

            {/* Handwritten script overlay: "Real People. Real Impact." with heart flourish */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center pl-6 sm:pl-8 lg:pl-10 text-white select-none pointer-events-none z-10">
              <div className="-rotate-6 transform origin-bottom-left space-y-0.5">
                <span className="block font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-none">
                  Real People.
                </span>
                <span className="block font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-none">
                  Real Impact.
                </span>

                {/* Underline flourish leading to delicate heart */}
                <div className="flex items-center gap-1.5 pt-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                  <svg
                    className="w-16 sm:w-20 h-4 text-white"
                    viewBox="0 0 70 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M 4 12 C 22 17, 45 14, 66 5" />
                  </svg>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Content Column */}
          <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-start text-left relative z-10 space-y-3 sm:space-y-4 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#B4232C]">
              JOIN OUR MISSION
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Be a Part of Something Bigger
            </h3>
            <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal">
              Whether you donate, volunteer or simply spread the word — you help us save lives. Together, we can build a healthier and stronger community.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('volunteers')}
                className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-xl transition-all shadow-md shadow-red-900/15 hover:gap-3 active:scale-95 group cursor-pointer"
                id="team-join-volunteer-btn"
              >
                <span>Get Involved</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                id="team-contact-desk-btn"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Contact Society Desk</span>
              </button>
            </div>
          </div>

          {/* Right Ribbon Heart Artistic Graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-40 sm:w-64 lg:w-80 pointer-events-none opacity-85 sm:opacity-95 flex items-center justify-end overflow-hidden z-0">
            <svg
              viewBox="0 0 280 200"
              className="w-full h-full text-[#E11D48] translate-x-4 sm:translate-x-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 0 170 C 50 185, 95 180, 135 155 C 160 140, 172 118, 176 90 C 182 60, 168 40, 148 44 C 128 48, 122 70, 130 96 C 144 135, 182 165, 208 155 C 230 146, 248 120, 245 88 C 242 58, 222 44, 202 48 C 188 52, 178 70, 180 92 C 183 124, 208 160, 242 168 C 265 174, 280 155, 300 130" />
            </svg>
          </div>
        </section>
      </div>

      {/* Member Full Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Team Member Details'}
        subtitle={selectedMember ? `${selectedMember.role} • ${selectedMember.categoryLabel}` : ''}
        maxWidth="lg"
      >
        {selectedMember && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Header Identity Row */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedMember.avatarColor} text-white font-black text-xl flex items-center justify-center shadow-md`}
                >
                  {selectedMember.avatarInitials}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">{selectedMember.name}</h4>
                  <p className="text-xs font-bold text-[#B4232C]">{selectedMember.role}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedMember.department}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <BloodGroupBadge group={selectedMember.bloodGroup} size="lg" />
                <span className="text-[10px] text-slate-400 block font-mono mt-1">Verified Donor</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Role & Contribution</h5>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-3.5 rounded-xl">
                {selectedMember.bio}
              </p>
            </div>

            {/* Key Achievements & Responsibilities */}
            {selectedMember.achievements && selectedMember.achievements.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Key Society Contributions
                </h5>
                <div className="space-y-1.5">
                  {selectedMember.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status & Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Emergency Availability</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B4232C]" />
                  <span>{selectedMember.dutyHours || 'Standard Society Shift'}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Personal Donations Record</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#B4232C] fill-current" />
                  <span>{selectedMember.donationsCount ? `${selectedMember.donationsCount} Blood Units Donated` : 'Regular Active Donor'}</span>
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedMember.phone && (
                  <a
                    href={`tel:${selectedMember.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Directly</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
