import React from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Search,
  HeartHandshake,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  Users
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const HeroSection: React.FC = () => {
  const { navigate, stats, donors } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60" id="hero-section">
      {/* Subtle background glow/patterns */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-50/60 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-[#8F1D25] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#B4232C] animate-pulse" />
              <span>Official Blood Network of UET Narowal Campus</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              One Donation.{' '}
              <span className="text-[#B4232C] underline decoration-red-200 decoration-wavy underline-offset-4">
                One Life.
              </span>{' '}
              One Community.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              BDS UET Narowal connects student and faculty blood donors with patients across Narowal district hospitals —
              helping our campus and local community respond faster when every minute matters.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => navigate('find-donor')}
                className="inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-base font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-red-900/15 hover:shadow-lg active:scale-98"
                id="hero-find-donor-btn"
              >
                <Search className="w-5 h-5" />
                <span>Find a Blood Donor</span>
              </button>

              <button
                onClick={() => navigate('become-donor')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400 text-base font-bold px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-98"
                id="hero-become-donor-btn"
              >
                <HeartHandshake className="w-5 h-5 text-[#B4232C]" />
                <span>Become a Donor</span>
              </button>
            </div>

            {/* Emergency Prompt Box */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B4232C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertCircle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Need Blood In An Emergency?</h2>
                    <p className="text-xs text-slate-600">Immediate hospital coordination desk for critical cases.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('emergency-request')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#8F1D25] hover:bg-[#6b141a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs"
                  id="hero-emergency-request-cta"
                >
                  <span>Submit Emergency Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trust checkmarks */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] sm:text-xs font-semibold text-slate-500">
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free & Ethical</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Rapid Response</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Verified Students</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Blood Matrix Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#B4232C] flex items-center justify-center font-bold">
                    🩸
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900">Active Donor Network</h2>
                    <p className="text-[11px] text-slate-500">Real-time availability by blood type</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Network
                </span>
              </div>

              {/* Blood Group Grid */}
              <div className="grid grid-cols-4 gap-2.5 my-5">
                {BLOOD_GROUPS.map((bg) => {
                  const count = donors.filter((d) => d.bloodGroup === bg && d.availabilityStatus === 'Available').length;
                  return (
                    <button
                      key={bg}
                      onClick={() => navigate('find-donor')}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-red-300 hover:bg-red-50/50 bg-slate-50/60 text-center transition-all group"
                      id={`hero-blood-card-${bg.replace('+', 'pos').replace('-', 'neg')}`}
                    >
                      <BloodGroupBadge group={bg} size="sm" variant="solid" className="w-full" />
                      <div className="text-[10px] font-bold text-slate-600 mt-1.5 group-hover:text-[#B4232C]">
                        {count > 0 ? `${count} Available` : 'On Call'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Status Simulation Box */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#B4232C]" />
                    Emergency Dispatch
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-300 font-mono px-2 py-0.5 rounded">
                    Avg Response: ~18 min
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-snug">
                  Coordinators stationed across UET Narowal Campus, student hostels & admin block ready for urgent calls.
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">DHQ Hospital • Sughra Shafi • Christian Hospital</span>
                  <button
                    onClick={() => navigate('find-donor')}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    <span>Browse Donors</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
