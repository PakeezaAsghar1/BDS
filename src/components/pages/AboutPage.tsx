import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  ShieldCheck,
  Target,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Activity,
  Calendar,
  BookOpen,
  Zap,
  Leaf,
  Users
} from 'lucide-react';
import heartImage from '../../assets/images/about_hero_heart.jpg';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';
import { ImpactBar } from '../home/ImpactBar';
import { ScrollReveal } from '../common/ScrollReveal';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="bg-[#FAF9F7] min-h-screen" id="about-page">
      {/* Top Hero Section with Dark Maroon Background spanning full-width */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2D0609] via-[#480C12] to-[#1E0305] text-white border-b border-red-900/50 py-12 sm:py-16 lg:py-20">
        {/* Heartbeat ECG Line Background SVG */}
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

        {/* Ambient red lighting glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal direction="up" duration={600}>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    About Blood Donor Society <span className="text-red-400 block sm:inline">UET Narowal</span>
                  </h1>
                  <p className="text-base sm:text-lg text-red-100/90 leading-relaxed max-w-2xl font-normal">
                    The premier student-led humanitarian society at the University of Engineering & Technology (UET Narowal Campus),
                    dedicated to providing rapid, voluntary blood assistance to critically ill patients and Thalassemia
                    warriors across Narowal district.
                  </p>
                </div>
              </ScrollReveal>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => navigate('become-donor')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-150 shadow-lg shadow-red-950/60 btn-subtle-lift"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Register as Blood Donor</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => navigate('emergency-request')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all duration-150 backdrop-blur-sm btn-subtle-lift"
                >
                  <PhoneCall className="w-4 h-4 text-red-300" />
                  <span>Emergency Blood Request</span>
                </button>
              </div>
            </div>

            {/* Right Visual: Glowing 3D Heart in Hands */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                {/* Glowing ambient ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 opacity-40 blur-xl group-hover:opacity-60 transition duration-500" />
                
                {/* Image container */}
                <div className="relative rounded-2xl overflow-hidden border border-red-500/30 bg-black/40 shadow-2xl">
                  <img
                    src={heartImage}
                    alt="BDS UET - Caring hands holding a glowing heart with pulse"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Overlay vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating caption chip */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-600/30 flex items-center justify-center text-red-400">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">Every Drop Matters</p>
                        <p className="text-[11px] text-red-200/80">UET Engineering Altruism</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      24/7 Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Content Body - Mission & Vision with pure white background */}
      <div className="w-full bg-white border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mission & Vision Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF9F7] rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B4232C] flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To ensure that no patient in emergency wards, neonatal care units, or Thalassemia treatment centers across
                Narowal district suffers or loses their life due to the unavailability of compatible, safe blood. We mobilize the
                boundless energy and altruism of UET Narowal's engineering student body and faculty to bridge urgent clinical gaps.
              </p>
            </div>

            <div className="bg-[#FAF9F7] rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To create an entirely voluntary, replacement-free blood donation culture throughout higher education
                institutions, upholding gold-standard privacy, swift clinical coordination, and lifelong civic
                responsibility among future engineers and technologists.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section - Background styled to match Our Gallery */}
      <section
        id="what-we-do-section"
        className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] border-y border-slate-200/80 overflow-hidden"
      >
        {/* Decorative ambient background blurs matching Our Gallery */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-100/35 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
          {/* Eyebrow & Headline matching reference */}
          <ScrollReveal direction="up" duration={600}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#B4232C]" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B4232C]">
                  WHAT WE DO
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                From Urgent Need to Scalable Impact
              </h2>
            </div>
          </ScrollReveal>

          {/* 4 Feature Pillars Grid matching reference layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* 1. Organizing Blood Drives */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-white text-[#B4232C] border border-red-200/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-[#B4232C] text-white text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  01
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight group-hover:text-[#B4232C] transition-colors">
                  Organizing Blood Drives
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Regular on-campus donation camps in UET Narowal faculties and hostels in collaboration with accredited
                  transfusion centers like DHQ Hospital Narowal, gathering hundreds of safe blood units.
                </p>
              </div>
            </div>

            {/* 2. Managing Emergency Requests */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-white text-[#B4232C] border border-red-200/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Activity className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-[#B4232C] text-white text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  02
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight group-hover:text-[#B4232C] transition-colors">
                  Emergency Response
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  24/7 dedicated dispatch team rapidly verifying hospital emergency cases and immediately connecting verified
                  matched donors directly to emergency trauma wards.
                </p>
              </div>
            </div>

            {/* 3. Maintaining a Donor Database */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-white text-[#B4232C] border border-red-200/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-[#B4232C] text-white text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  03
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight group-hover:text-[#B4232C] transition-colors">
                  Verified Donor Database
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Maintaining a secure, encrypted, and privacy-shielded registry of thousands of volunteer engineering students
                  and alumni, organized by blood group and donation intervals.
                </p>
              </div>
            </div>

            {/* 4. Promoting Awareness */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-white text-[#B4232C] border border-red-200/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <BookOpen className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-[#B4232C] text-white text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  04
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight group-hover:text-[#B4232C] transition-colors">
                  Promoting Awareness
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Active educational campaigns, Thalassemia screening awareness seminars, and community workshops to dispel
                  misconceptions and foster voluntary giving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Impact Stats Cards - Replacing previous metric strip with same stats cards */}
      <ImpactBar id="about-impact-statistics-section" className="bg-white" />

      {/* Our Values Section - "What Drives Us" */}
      <section className="py-16 sm:py-24 bg-[#FAF9F7]" id="our-values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-10 sm:space-y-12">
            
            {/* Left/Top Column: Eyebrow, Heading, Narrative */}
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#B4232C]" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B4232C]">
                  OUR VALUES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                What Drives Us
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-1">
                At Blood Donor Society UET Narowal Campus, our mission is anchored by unwavering humanitarian principles.
                Every donation request, awareness drive, and student volunteer effort is powered by the values that define our community.
              </p>
            </div>

            {/* Cards Container: Single line on desktop (4 cols) and 2 by 2 on mobile (2 cols) */}
            <div className="w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                
                {/* 1. Compassion */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-[#B4232C] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">Compassion</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-1.5 leading-relaxed">
                      Empathy at our core. Every unit saves a life.
                    </p>
                  </div>
                </div>

                {/* 2. Urgency */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">Urgency</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-1.5 leading-relaxed">
                      Speed preserves life. 24/7 emergency response.
                    </p>
                  </div>
                </div>

                {/* 3. Integrity */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">Integrity</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-1.5 leading-relaxed">
                      Safe, transparent and professional processes.
                    </p>
                  </div>
                </div>

                {/* 4. Service */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-[#B4232C] flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">Service</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-1.5 leading-relaxed">
                      Because giving is caring.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner - "JOIN OUR MISSION: Be a Part of Something Bigger" matching reference image */}
      <section className="pb-16 sm:pb-24 bg-[#FAF9F7]" id="join-mission-section">
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
                  className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-xl transition-all shadow-md shadow-red-900/15 hover:gap-3 active:scale-95 group"
                  id="about-get-involved-btn"
                >
                  <span>Get Involved</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('team')}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 transition-all active:scale-95"
                  id="about-meet-team-btn"
                >
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Meet Our Team</span>
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
    </div>
  );
};
