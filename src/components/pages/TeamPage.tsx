import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Heart,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Sparkles,
  MapPin,
  GraduationCap,
  X
} from 'lucide-react';
import heartInHandsImg from '../../assets/images/heart_in_hands_1792059102193.jpg';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';
import uetBloodCampImg from '../../assets/images/uet_blood_camp_1792275956152.jpg';
import bdsVolunteersImg from '../../assets/images/bds_team_volunteers_1792275955213.jpg';
import uetAwarenessRallyImg from '../../assets/images/uet_awareness_rally_1792275976528.jpg';
import emergencyTransitImg from '../../assets/images/emergency_blood_transit_1792275977018.jpg';
import uetCampusTowerImg from '../../assets/images/uet_campus_tower_1792275186910.jpg';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  session: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  photo: string;
  activityPhoto1: string;
  activityPhoto2: string;
  haloColor: string;
  bio: string;
  email: string;
  phone: string;
  doodleType: 'rays' | 'heart' | 'sparkle';
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'areeba-khan',
    name: 'Areeba Khan',
    role: 'President',
    department: 'Department of Electrical Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'O+',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: uetBloodCampImg,
    activityPhoto2: heartInHandsImg,
    haloColor: 'bg-amber-200/80',
    doodleType: 'rays',
    bio: 'Oversees overall strategic vision, emergency hospital partnerships, campus donation camps, and volunteer welfare at BDS UET Narowal.',
    email: 'areeba.president@narowal.uet.edu.pk',
    phone: '+92 301 8456123',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'hassan-shah',
    name: 'Hassan Shah',
    role: 'Vice President',
    department: 'Department of Mechanical Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'B+',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: uetAwarenessRallyImg,
    activityPhoto2: uetCampusTowerImg,
    haloColor: 'bg-purple-200/80',
    doodleType: 'rays',
    bio: 'Leads internal cabinet operations, inter-departmental blood drive mobilization, and coordinator training programs.',
    email: 'hassan.vp@narowal.uet.edu.pk',
    phone: '+92 302 7654321',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'zainab-fatima',
    name: 'Zainab Fatima',
    role: 'Operations Lead',
    department: 'Department of Computer Science',
    session: 'Session 2023-2027',
    bloodGroup: 'A+',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: emergencyTransitImg,
    activityPhoto2: bloodDonorArmImg,
    haloColor: 'bg-sky-200/80',
    doodleType: 'rays',
    bio: 'Manages the 24/7 on-call emergency hospital dispatch desk, ensuring rapid donor cross-matching within 15–20 minutes.',
    email: 'zainab.ops@narowal.uet.edu.pk',
    phone: '+92 304 9876543',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'usama-raza',
    name: 'Usama Raza',
    role: 'Outreach Lead',
    department: 'Department of Civil Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'O-',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: bdsVolunteersImg,
    activityPhoto2: uetAwarenessRallyImg,
    haloColor: 'bg-rose-200/80',
    doodleType: 'rays',
    bio: 'Directs external relations with Punjab healthcare institutions, Rescue 1122, and regional blood transfusion services.',
    email: 'usama.outreach@narowal.uet.edu.pk',
    phone: '+92 300 4567890',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'hira-shah',
    name: 'Hira Shah',
    role: 'Media & Design Lead',
    department: 'Department of Computer Science',
    session: 'Session 2023-2027',
    bloodGroup: 'AB+',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: heartInHandsImg,
    activityPhoto2: bdsVolunteersImg,
    haloColor: 'bg-orange-200/80',
    doodleType: 'heart',
    bio: 'Creates the visual campaigns, donor recognition stories, social outreach graphics, and digital awareness drives across UET.',
    email: 'hira.media@narowal.uet.edu.pk',
    phone: '+92 305 1234567',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'talha-mehmood',
    name: 'Talha Mehmood',
    role: 'Logistics Lead',
    department: 'Department of Mechanical Engineering',
    session: 'Session 2022-2026',
    bloodGroup: 'B-',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: emergencyTransitImg,
    activityPhoto2: uetBloodCampImg,
    haloColor: 'bg-emerald-200/80',
    doodleType: 'heart',
    bio: 'Coordinates campus camp logistics, medical supplies, donor refreshments, and emergency transport vehicles for regional hospital cases.',
    email: 'talha.logistics@narowal.uet.edu.pk',
    phone: '+92 303 6549871',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'sana-iqbal',
    name: 'Sana Iqbal',
    role: 'Events Lead',
    department: 'Department of Electrical Engineering',
    session: 'Session 2023-2027',
    bloodGroup: 'A-',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: uetAwarenessRallyImg,
    activityPhoto2: uetCampusTowerImg,
    haloColor: 'bg-pink-200/80',
    doodleType: 'rays',
    bio: 'Organizes large-scale semester blood camps, Thalassemia awareness seminars, and community health screening workshops.',
    email: 'sana.events@narowal.uet.edu.pk',
    phone: '+92 306 7891234',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 'ahmed-raza',
    name: 'Ahmed Raza',
    role: 'IT & Website Lead',
    department: 'Department of Computer Science',
    session: 'Session 2022-2026',
    bloodGroup: 'O+',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=700&fit=crop&crop=faces',
    activityPhoto1: bdsVolunteersImg,
    activityPhoto2: bloodDonorArmImg,
    haloColor: 'bg-indigo-200/80',
    doodleType: 'heart',
    bio: 'Develops and maintains the BDS UET donor matching portal, verification engines, real-time inventory displays, and digital systems.',
    email: 'ahmed.it@narowal.uet.edu.pk',
    phone: '+92 307 2345678',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
];

// X (formerly Twitter) Icon SVG
const XIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const TeamPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 selection:bg-red-100 selection:text-red-900 overflow-hidden" id="bds-meet-our-team-page">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Exactly Matching Reference Image 2)     */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        
        {/* Soft Organic Background Pastel Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FDECE8]/70 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-[#FDF0EC]/80 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#FDECE8]/40 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Heading, Subtitle & Hand-Drawn Scribbles */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Handwritten Note + Heart Scribble */}
              <div className="inline-flex items-center gap-2 text-slate-700 select-none">
                <span className="font-['Caveat',cursive] text-xl sm:text-2xl text-slate-800 -rotate-2 inline-block">
                  Behind every drop, there's a team.
                </span>
                {/* Hand-drawn Outline Heart SVG */}
                <svg className="w-6 h-6 text-[#B4232C] rotate-12 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              {/* Main Title: "Meet Our Team" with Red Brush-Style "Team" */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Meet Our{' '}
                <span className="relative inline-block font-['Caveat',cursive] text-[#B4232C] text-5xl sm:text-6xl lg:text-7xl font-bold align-baseline ml-1">
                  Team
                  {/* Red Brush Underline Curve */}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 text-[#B4232C] overflow-visible"
                    viewBox="0 0 120 12"
                    fill="none"
                  >
                    <path
                      d="M 2 8 C 30 2, 80 1, 118 6"
                      stroke="#B4232C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A passionate group of students, volunteers and change makers working together for a healthier
                and kinder community across UET Narowal and beyond.
              </p>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B4232C]" />
                  <span>Official Society Cabinet</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#B4232C]" />
                  <span>UET Narowal Campus</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>24/7 On-Call Desk</span>
                </div>
              </div>

            </div>

            {/* Right Column: Organic Pebble Blob with Hands Holding Heart */}
            <div className="lg:col-span-5 flex justify-center relative select-none">
              
              {/* Floating Doodle Sparks & Heart */}
              <div className="absolute -top-4 right-10 z-20 pointer-events-none">
                <svg className="w-8 h-8 text-[#B4232C] rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              {/* Little red rays/sparks */}
              <div className="absolute -top-2 left-12 z-20 pointer-events-none">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="5" y1="5" x2="8" y2="8" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                </svg>
              </div>

              {/* Organic Pebble Container with Soft Shadow */}
              <div
                className="relative w-72 sm:w-88 h-72 sm:h-88 shadow-[0_20px_50px_-15px_rgba(180,35,44,0.22)] overflow-hidden border-4 border-white"
                style={{
                  borderRadius: '62% 38% 54% 46% / 44% 56% 44% 56%',
                }}
              >
                <img
                  src={heartInHandsImg}
                  alt="Hands holding red heart - BDS UET Blood Donation Society"
                  className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* 2. HEARTBEAT PULSE DIVIDER WITH HEART                    */}
      {/* ======================================================== */}
      <div className="max-w-2xl mx-auto px-4 my-2 flex items-center justify-center gap-3 select-none">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-red-200 to-red-400" />
        <div className="flex items-center gap-2">
          {/* Heart pulse left line */}
          <svg className="w-10 h-4 text-red-400 overflow-visible" viewBox="0 0 40 16" fill="none">
            <path d="M 0 8 L 16 8 L 20 2 L 24 14 L 28 8 L 40 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Center Heart Icon */}
          <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#B4232C] shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#B4232C]" />
          </div>
          {/* Heart pulse right line */}
          <svg className="w-10 h-4 text-red-400 overflow-visible" viewBox="0 0 40 16" fill="none">
            <path d="M 0 8 L 12 8 L 16 2 L 20 14 L 24 8 L 40 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-red-200 to-red-400" />
      </div>

      {/* ======================================================== */}
      {/* 3. SECTION TITLE: "Our Team" & SUBTITLE                  */}
      {/* ======================================================== */}
      <section className="py-8 sm:py-12" id="our-team-grid-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
              Different roles. Same goal — to save lives.
            </p>
          </div>

          {/* ======================================================== */}
          {/* 4A. MOBILE PHONE VIEW: Staggered Organic Trefoils        */}
          {/* (Matching Reference 1000073069_bdc955df.jpg)             */}
          {/* ======================================================== */}
          <div className="md:hidden flex flex-col space-y-12 sm:space-y-14 py-4 px-2 overflow-hidden select-none" id="team-mobile-trefoil-stream">
            {TEAM_MEMBERS.map((member, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={`mobile-trefoil-${member.id}`}
                  onClick={() => setSelectedMember(member)}
                  className={`w-fit cursor-pointer group transition-all duration-300 active:scale-95 ${
                    isEven
                      ? 'self-start ml-2 sm:ml-8 text-center'
                      : 'self-end mr-2 sm:mr-8 text-center'
                  }`}
                  id={`mobile-team-cluster-${member.id}`}
                >
                  {/* The Trefoil Cluster Container with Organic Pastel Halo Cloud */}
                  <div className="relative w-[190px] h-[170px] mx-auto">
                    {/* Glowing Trefoil Halo matching reference image */}
                    <div className="absolute inset-0 pointer-events-none -z-10">
                      {/* Top halo disc */}
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full ${member.haloColor} blur-xl opacity-75 group-hover:opacity-95 transition-opacity`}
                      />
                      {/* Bottom-left halo disc */}
                      <div
                        className={`absolute -bottom-3 -left-3 w-28 h-28 rounded-full ${member.haloColor} blur-xl opacity-75 group-hover:opacity-95 transition-opacity`}
                      />
                      {/* Bottom-right halo disc */}
                      <div
                        className={`absolute -bottom-3 -right-3 w-28 h-28 rounded-full ${member.haloColor} blur-xl opacity-75 group-hover:opacity-95 transition-opacity`}
                      />
                      {/* Ambient center cloud */}
                      <div
                        className={`absolute inset-0 rounded-[40px] ${member.haloColor} blur-2xl opacity-60`}
                      />
                    </div>

                    {/* 1. Top Center Circle: Member Portrait */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-[2.5px] border-white shadow-md z-20 group-hover:scale-105 transition-transform duration-300 bg-white">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>

                    {/* 2. Bottom-Left Circle: Activity Photo 1 */}
                    <div className="absolute bottom-0 left-1 w-20 h-20 rounded-full overflow-hidden border-[2.5px] border-white shadow-md z-10 group-hover:scale-105 transition-transform duration-300 bg-white">
                      <img
                        src={member.activityPhoto1}
                        alt={`${member.name} activity`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* 3. Bottom-Right Circle: Activity Photo 2 */}
                    <div className="absolute bottom-0 right-1 w-20 h-20 rounded-full overflow-hidden border-[2.5px] border-white shadow-md z-10 group-hover:scale-105 transition-transform duration-300 bg-white">
                      <img
                        src={member.activityPhoto2}
                        alt={`${member.name} activity`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Text Details Underneath Cluster (Exact typography from reference) */}
                  <div className="text-center mt-3.5 space-y-0.5">
                    <h3 className="font-bold text-base text-slate-900 tracking-tight leading-snug group-hover:text-[#B4232C] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {member.role}
                    </p>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B4232C] bg-red-50/90 border border-red-200/60 px-2 py-0.5 rounded-full shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B4232C]" />
                        <span>{member.bloodGroup}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 4B. DESKTOP VIEW: The 8 Team Members Grid (4x2)          */}
          {/* (Matching Reference 1000073062_b8184775.png)             */}
          {/* ======================================================== */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="group relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.02)] border border-slate-200/80 hover:border-red-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center cursor-pointer overflow-hidden"
                id={`team-card-${member.id}`}
              >
                
                {/* Top Subtle Hover Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B4232C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Member Portrait in Organic Warm Peach Blob Backdrop */}
                <div className="relative w-full aspect-[4/4] rounded-2xl overflow-hidden mb-4 bg-gradient-to-b from-[#FDEEE9] to-[#FDF4F0] flex items-end justify-center select-none">
                  
                  {/* Red Doodle Sparks/Heart accent in top right of photo */}
                  <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none opacity-85 group-hover:scale-110 group-hover:opacity-100 transition-transform">
                    {member.doodleType === 'heart' ? (
                      <svg className="w-5 h-5 text-[#B4232C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#B4232C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="3" x2="12" y2="7" />
                        <line x1="6" y1="6" x2="9" y2="9" />
                        <line x1="3" y1="12" x2="7" y2="12" />
                      </svg>
                    )}
                  </div>

                  {/* Portrait Photo */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle vignette shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Member Details */}
                <div className="w-full">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-[#B4232C] transition-colors leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    {member.role}
                  </p>
                </div>

                {/* Social Media Link Buttons (in, ig, x) matching Image 2 */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100 w-full" onClick={(e) => e.stopPropagation()}>
                  {/* LinkedIn */}
                  <a
                    href={member.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Connect with ${member.name} on LinkedIn`}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-[#0077B5] text-slate-400 hover:text-white border border-slate-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={member.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Follow ${member.name} on Instagram`}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-400 hover:text-white border border-slate-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={member.twitter || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Follow ${member.name} on X`}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. JOIN OUR MISSION SECTION (From About Page)            */}
      {/* ======================================================== */}
      <section className="pb-16 sm:pb-24 pt-6 bg-[#FAF9F7]" id="join-mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-stretch min-h-[300px]">
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
                  id="team-get-involved-btn"
                >
                  <span>Get Involved</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('become-donor')}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                  id="team-become-donor-btn"
                >
                  <Heart className="w-4 h-4 text-[#B4232C] fill-[#B4232C]" />
                  <span>Become a Donor</span>
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
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TEAM MEMBER PROFILE MODAL                            */}
      {/* ======================================================== */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={selectedMember.name}
          size="md"
        >
          <div className="space-y-5 text-left">
            {/* Header with Photo and Quick Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedMember.photo}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-100 shadow-sm shrink-0"
              />
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">
                  {selectedMember.name}
                </h4>
                <p className="text-xs font-semibold text-[#B4232C] mt-0.5">
                  {selectedMember.role}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <BloodGroupBadge group={selectedMember.bloodGroup} size="sm" variant="solid" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedMember.session}
                  </span>
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <GraduationCap className="w-4 h-4 text-[#B4232C] shrink-0" />
              <span>{selectedMember.department}</span>
            </div>

            {/* Bio */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Executive Responsibilities
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedMember.bio}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <a
                href={`mailto:${selectedMember.email}`}
                className="flex items-center gap-2 text-slate-700 hover:text-[#B4232C] transition-colors p-2 rounded-lg hover:bg-red-50/50"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{selectedMember.email}</span>
              </a>

              <a
                href={`tel:${selectedMember.phone}`}
                className="flex items-center gap-2 text-slate-700 hover:text-[#B4232C] transition-colors p-2 rounded-lg hover:bg-red-50/50"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedMember.phone}</span>
              </a>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMember(null);
                  navigate('volunteers');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Work with {selectedMember.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
