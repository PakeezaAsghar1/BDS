import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Search,
  HeartHandshake,
  AlertCircle,
  ShieldCheck,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';
import uetBloodCampImg from '../../assets/images/uet_blood_camp_1792275956152.jpg';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const HeroSection: React.FC = () => {
  const { navigate, stats, donors } = useApp();
  const [selectedHeroGroup, setSelectedHeroGroup] = useState<BloodGroup>('O-');
  const [selectedCampus, setSelectedCampus] = useState<string>('Narowal Campus');

  const availableCountForSelected = donors.filter(
    (d) => d.bloodGroup === selectedHeroGroup && d.availabilityStatus === 'Available'
  ).length;

  const totalAvailableDonors = donors.filter((d) => d.availabilityStatus === 'Available').length;

  return (
    <section
      className="relative overflow-hidden bg-[#FAF9F7] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/70"
      id="hero-section"
    >
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Atmospheric ambient crimson glows */}
      <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-red-200/35 via-rose-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-100/40 via-red-50/30 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Announcement Bar */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs backdrop-blur-xs text-xs font-semibold text-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-slate-900">Live Campus Dispatch Desk</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium hidden sm:inline">UET Narowal Official Society</span>
            <span className="text-[#B4232C] font-bold text-[11px] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              {totalAvailableDonors} Donors Active
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free & Humanitarian Service</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Value Proposition & Direct Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Primary Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Every Drop Counts.{' '}
                <span className="relative inline-block text-[#B4232C]">
                  Every Second Matters.
                  <svg
                    className="absolute -bottom-1 left-0 w-full text-red-200/90 -z-10 h-3"
                    viewBox="0 0 250 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9.5C50 3.5 150 1.5 248 8"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Blood Donor Society UET Narowal mobilizes verified university students and faculty to rapidly deliver
                life-saving blood to DHQ Narowal, Tehsil hospitals, and emergency patients across Punjab.
              </p>
            </div>

            {/* Quick Hero Interactive Search & Match Card */}
            <div
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/90 space-y-3 text-left"
              id="hero-quick-search-box"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-[#B4232C] flex items-center justify-center font-bold">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Instant Blood Group Matcher
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {availableCountForSelected > 0 ? (
                    <span className="text-emerald-700 font-semibold">
                      ● {availableCountForSelected} verified {selectedHeroGroup} donor(s) ready
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">● Coordinators on standby for {selectedHeroGroup}</span>
                  )}
                </span>
              </div>

              {/* Group Chips Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Select Required Blood Group:</span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = selectedHeroGroup === bg;
                    const count = donors.filter(
                      (d) => d.bloodGroup === bg && d.availabilityStatus === 'Available'
                    ).length;

                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setSelectedHeroGroup(bg)}
                        className={`py-2 px-1 rounded-xl text-center transition-all border ${
                          isSelected
                            ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-xs scale-102 font-black'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-bold'
                        }`}
                        id={`hero-chip-${bg.replace('+', 'pos').replace('-', 'neg')}`}
                      >
                        <span className="text-xs block leading-tight">{bg}</span>
                        <span
                          className={`text-[9px] block ${
                            isSelected ? 'text-red-100' : 'text-slate-400'
                          }`}
                        >
                          {count} ready
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Bar Controls */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <MapPin className="w-4 h-4 text-[#B4232C] shrink-0" />
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="bg-transparent font-medium text-slate-800 focus:outline-none w-full"
                    id="hero-campus-select"
                  >
                    <option value="Narowal Campus">UET Narowal Campus & Hostels</option>
                    <option value="DHQ Hospital">DHQ Hospital Narowal Area</option>
                    <option value="Shakargarh">Shakargarh / Zafarwal Sector</option>
                    <option value="All Punjab">All Regional Hubs</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('find-donor')}
                  className="inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-900/15 hover:shadow-lg active:scale-98 cursor-pointer"
                  id="hero-find-selected-donor-btn"
                >
                  <Search className="w-4 h-4" />
                  <span>Find {selectedHeroGroup} Donors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Direct Action CTAs & Emergency Hotline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => navigate('become-donor')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400 text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer"
                id="hero-become-donor-btn"
              >
                <HeartHandshake className="w-5 h-5 text-[#B4232C]" />
                <span>Register as Blood Donor</span>
              </button>

              <button
                onClick={() => navigate('emergency-request')}
                className="inline-flex items-center justify-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-100 text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-xs border border-rose-800/80 active:scale-98 cursor-pointer"
                id="hero-emergency-request-btn"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Submit Emergency Request</span>
              </button>
            </div>

            {/* Trust and Verification Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-[#B4232C]">
                    O+
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                    B+
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-800">
                    A-
                  </div>
                </div>
                <span>
                  <strong className="text-slate-800 font-bold">2,500+</strong> student donors enrolled
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PMDC & Blood Bank Safe Guidelines</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Avg Dispatch: 18 Minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Photo Card */}
              <div className="relative bg-white rounded-3xl p-3 shadow-2xl border border-slate-200/90 overflow-hidden">
                {/* Photo window */}
                <div className="relative h-72 sm:h-84 rounded-2xl overflow-hidden group">
                  <img
                    src={uetBloodCampImg}
                    alt="BDS UET Narowal Blood Donation Drive in Action"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Photo Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/95 p-1 shadow-md flex items-center justify-center">
                      <img src={bdsLogoImg} alt="BDS Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-white bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                      UET Narowal Mega Drive
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Verified
                    </span>
                  </div>

                  {/* Caption overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-red-300 font-bold mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Empowering Hospital Patients Daily</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white leading-snug">
                      Over 1,200 successful donations coordinated for DHQ Narowal ICU and Thalassemia children.
                    </h3>
                  </div>
                </div>

                {/* Micro Quick-Action Bar Below Photo */}
                <div className="mt-3 p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#B4232C]" />
                      Emergency Dispatch Network
                    </span>
                    <span className="text-[10px] bg-red-950 text-red-300 font-mono px-2 py-0.5 rounded border border-red-900">
                      Response: ~18 min
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                    <span className="text-slate-300">DHQ Narowal • Sughra Shafi • Christian Hospital</span>
                    <button
                      type="button"
                      onClick={() => navigate('find-donor')}
                      className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Verified Donor Card (Floating Top-Left) */}
              <div className="hidden sm:flex absolute -top-5 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 max-w-[240px]">
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#B4232C] flex items-center justify-center font-black text-sm shrink-0 border border-red-200">
                  O+
                </div>
                <div className="text-left overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Muhammad Hamza</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500">Zubair Hall · 4 Donations</p>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                    Eligible Now
                  </span>
                </div>
              </div>

              {/* Floating Emergency Case Pill (Floating Bottom-Right) */}
              <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/90 items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[260px]">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#B4232C] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-[#B4232C] animate-pulse" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-extrabold text-slate-900 block leading-tight">Emergency Case Active</span>
                  <span className="text-[11px] text-slate-500 block">DHQ Hospital Surgery ICU</span>
                  <span className="text-[10px] text-[#B4232C] font-mono font-bold">2 Units O- Dispatched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
