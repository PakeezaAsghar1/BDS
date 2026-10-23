import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  HeartHandshake,
  AlertCircle,
  ShieldCheck,
  Clock,
  ArrowRight,
  Users
} from 'lucide-react';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';

export const HeroSection: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="relative overflow-hidden bg-[#FAF9F7] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60" id="hero-section">
      {/* Background Image Layer with atmospheric depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src={bloodDonorArmImg}
          alt=""
          className="w-full h-full object-cover object-[center_35%] scale-105"
        />
        {/* Soft radial and horizontal gradient masks ensuring excellent text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7]/95 via-[#FAF9F7]/90 to-[#FAF9F7]/75 lg:from-[#FAF9F7]/96 lg:via-[#FAF9F7]/90 lg:to-[#FAF9F7]/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7]/70 via-transparent to-[#FAF9F7]" />
        {/* Subtle crimson ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-[#8F1D25] shadow-xs animate-hero-badge">
            <span className="w-2 h-2 rounded-full bg-[#B4232C] animate-pulse" />
            <span>Official Blood Network of UET Narowal Campus</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-normal text-slate-900 leading-[1.35] sm:leading-[1.28] animate-hero-headline"
            dir="rtl"
            style={{ fontFamily: "'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', sans-serif" }}
          >
            دیجیے{' '}
            <span className="text-[#B4232C] underline decoration-red-200 decoration-wavy underline-offset-8">
              ایک قطرہ
            </span>{' '}
            امید کا
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-hero-sub">
            BDS UET Narowal connects student and faculty blood donors with patients across Narowal district hospitals —
            helping our campus and local community respond faster when every minute matters.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 animate-hero-actions">
            <button
              onClick={() => navigate('find-donor')}
              className="relative inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-base font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/25 hover:shadow-xl active:scale-98 cursor-pointer animate-button-bounce group"
              id="hero-find-donor-btn"
            >
              {/* Radiating Circular Wave Ripples (Tightly sized) */}
              <span
                className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full border-2 border-red-500/70 bg-red-500/15 animate-circular-wave-1 pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full border-2 border-red-400/50 bg-red-500/10 animate-circular-wave-2 pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full border border-red-300/40 animate-circular-wave-3 pointer-events-none"
                aria-hidden="true"
              />

              {/* Button text & icon content */}
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Find a Blood Donor</span>
              </span>
            </button>

            <button
              onClick={() => navigate('become-donor')}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400 text-base font-bold px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer btn-subtle-lift"
              id="hero-become-donor-btn"
            >
              <HeartHandshake className="w-5 h-5 text-[#B4232C]" />
              <span>Become a Donor</span>
            </button>
          </div>

          {/* Emergency Prompt Box (Kept immediately visible for urgent usability) */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-red-50/80 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#8F1D25] hover:bg-[#6b141a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer btn-subtle-lift"
                id="hero-emergency-request-cta"
              >
                <span>Submit Emergency Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Trust checkmarks */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] sm:text-xs font-semibold text-slate-500 animate-hero-features">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Free & Ethical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Rapid Response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Verified Students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
