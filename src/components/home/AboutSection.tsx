import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Activity,
  Calendar,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import heartImage from '../../assets/images/about_hero_heart.jpg';

export const AboutSection: React.FC = () => {
  const { navigate, stats } = useApp();

  return (
    <section className="bg-white relative overflow-hidden" id="about-us-section">
      {/* Full-width Maroon Hero Background Band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2D0609] via-[#480C12] to-[#1E0305] text-white border-y border-red-900/50 py-12 sm:py-16 lg:py-20">
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

        {/* Radial light flare */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  About Blood Donor Society <span className="text-red-400 block sm:inline">UET Lahore</span>
                </h2>
                <p className="text-base sm:text-lg text-red-100/90 leading-relaxed max-w-2xl font-normal">
                  The premier student-led humanitarian society at the University of Engineering & Technology Lahore.
                  Dedicated to eradicating blood shortages through voluntary donation drives, 24/7 rapid emergency matching,
                  and life-saving support for critically ill patients and Thalassemia warriors across Pakistan.
                </p>
              </div>

              {/* Value proposition badges */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-medium text-slate-200">
                  <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
                  <span>100% Free & Non-Profit</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-medium text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Safe Donors</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-medium text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>18-Min Dispatch Speed</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => navigate('become-donor')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all duration-150 shadow-lg shadow-red-950/60 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Become a Blood Donor</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => navigate('emergency-request')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all duration-150 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 space-y-16">

        {/* Impact Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-slate-200/80 hover:border-red-200 transition-colors">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">15,000+</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Lives Saved Across Punjab</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Emergency & Thalassemia care</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-slate-200/80 hover:border-red-200 transition-colors">
            <span className="text-3xl sm:text-4xl font-black text-[#B4232C] tracking-tight block">4,500+</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Registered Voluntary Donors</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Students, faculty & alumni</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-slate-200/80 hover:border-red-200 transition-colors">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">18 Mins</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Average Dispatch Match</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Direct hospital corridor relay</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-slate-200/80 hover:border-red-200 transition-colors">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">45+</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Annual Donation Camps</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Accredited PBTA certified</p>
          </div>
        </div>

      </div>

      {/* What We Do Section - Full Width Band following Reference Image format & Web Palette */}
      <div className="bg-gradient-to-b from-[#240508] via-[#2D0609] to-[#1C0305] text-white py-16 sm:py-24 border-y border-red-950/60 relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
          {/* Eyebrow & Headline matching reference */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#B4232C]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
                WHAT WE DO
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white tracking-tight">
              From Urgent Need to Scalable Impact
            </h3>
          </div>

          {/* 4 Feature Pillars Grid matching reference layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* 1. Organizing Blood Drives */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#FAF9F7] text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-white text-slate-900 border border-slate-300 text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  01
                </div>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight group-hover:text-red-200 transition-colors">
                  Organizing Blood Drives
                </h4>
                <p className="text-sm text-red-100/75 leading-relaxed mt-3">
                  Regular high-volume on-campus donation camps in UET faculties and hostels in collaboration with accredited
                  transfusion centers, gathering hundreds of safe blood units.
                </p>
              </div>
            </div>

            {/* 2. Managing Emergency Requests */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#FAF9F7] text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Activity className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-white text-slate-900 border border-slate-300 text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  02
                </div>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight group-hover:text-red-200 transition-colors">
                  Emergency Response
                </h4>
                <p className="text-sm text-red-100/75 leading-relaxed mt-3">
                  24/7 dedicated dispatch team rapidly verifying hospital emergency cases and immediately connecting verified
                  matched donors directly to emergency trauma wards.
                </p>
              </div>
            </div>

            {/* 3. Maintaining a Donor Database */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#FAF9F7] text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-white text-slate-900 border border-slate-300 text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  03
                </div>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight group-hover:text-red-200 transition-colors">
                  Verified Donor Database
                </h4>
                <p className="text-sm text-red-100/75 leading-relaxed mt-3">
                  Maintaining a secure, encrypted, and privacy-shielded registry of thousands of volunteer engineering students
                  and alumni, organized by blood group and donation intervals.
                </p>
              </div>
            </div>

            {/* 4. Promoting Awareness */}
            <div className="space-y-5 group">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#FAF9F7] text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <BookOpen className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-6 h-6 rounded-full bg-white text-slate-900 border border-slate-300 text-[11px] font-bold font-mono flex items-center justify-center shadow-xs">
                  04
                </div>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight group-hover:text-red-200 transition-colors">
                  Promoting Awareness
                </h4>
                <p className="text-sm text-red-100/75 leading-relaxed mt-3">
                  Active educational campaigns, Thalassemia screening awareness seminars, and community workshops to dispel
                  misconceptions and foster voluntary giving.
                </p>
              </div>
            </div>
          </div>

          {/* Read more link to full About page */}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate('about')}
              className="inline-flex items-center gap-2 text-sm font-bold text-red-300 hover:text-white hover:underline transition-colors"
            >
              <span>Learn more about our history, constitution & student team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
