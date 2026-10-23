import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { FileText, Search, UserCheck, Heart, UserPlus, ShieldCheck, Bell, Activity, ArrowRight, ArrowDown, Check } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'need-blood' | 'want-to-donate'>('need-blood');
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Progressive scroll-based reveal: As user scrolls through this section, cards unblur one by one
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // When section is above or just entering viewport
      if (rect.top > windowH * 0.75) {
        setActiveStepIndex(0);
        return;
      }

      // Calculate how far down the user has scrolled through the section
      const startPoint = windowH * 0.7;
      const totalSpan = rect.height + windowH * 0.35;
      const scrolled = startPoint - rect.top;
      const progress = Math.max(0, Math.min(scrolled / totalSpan, 1));

      // 4 steps progressively revealed
      if (progress < 0.22) {
        setActiveStepIndex(0);
      } else if (progress < 0.48) {
        setActiveStepIndex(1);
      } else if (progress < 0.74) {
        setActiveStepIndex(2);
      } else {
        setActiveStepIndex(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const requesterSteps = [
    {
      step: '01',
      title: 'Submit Request',
      description: 'Provide patient details, required blood group, hospital ward, and urgency level via web or emergency line.',
      icon: <FileText className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '02',
      title: 'We Coordinate',
      description: 'BDS UET coordinators verify the hospital blood slip and scan our database for nearby compatible donors.',
      icon: <Search className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '03',
      title: 'Connect & Dispatch',
      description: 'A coordinator facilitates communication between the donor and the patient family directly at the blood bank.',
      icon: <UserCheck className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '04',
      title: 'Help Delivered',
      description: 'The donation and cross-match process is completed safely at the certified medical facility.',
      icon: <Heart className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const donorSteps = [
    {
      step: '01',
      title: 'Register Profile',
      description: 'Sign up with your blood type, campus location, and last donation date in under 60 seconds.',
      icon: <UserPlus className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '02',
      title: 'Get Verified',
      description: 'BDS UET verifies university student/faculty credentials to ensure a trusted, reliable community network.',
      icon: <ShieldCheck className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '03',
      title: 'Receive Request',
      description: 'Receive emergency notifications on WhatsApp or SMS only when someone matching your blood group needs urgent help.',
      icon: <Bell className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '04',
      title: 'Donate & Save Lives',
      description: 'Visit the hospital or campus drive, donate blood in 15 minutes, and receive an official BDS donor certificate.',
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const currentSteps = activeTab === 'need-blood' ? requesterSteps : donorSteps;

  return (
    <section ref={sectionRef} className="py-16 bg-white border-b border-slate-200/80" id="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <ScrollReveal direction="up" delayMs={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Clear & Simple Process</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How BDS UET Works</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delayMs={120}>
            <p className="text-sm text-slate-600 mt-2">
              A transparent volunteer-led workflow designed for speed, donor privacy, and patient safety.
            </p>
          </ScrollReveal>

          {/* Dual Perspective Toggle */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl mt-6 shadow-xs">
            <button
              onClick={() => {
                setActiveTab('need-blood');
                setActiveStepIndex(0);
              }}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'need-blood'
                  ? 'bg-[#B4232C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-how-need-blood"
            >
              For Requesters (Need Blood)
            </button>
            <button
              onClick={() => {
                setActiveTab('want-to-donate');
                setActiveStepIndex(0);
              }}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'want-to-donate'
                  ? 'bg-[#B4232C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-how-donate"
            >
              For Donors (Want to Give)
            </button>
          </div>

          {/* Scroll progress / Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {currentSteps.map((s, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setActiveStepIndex(sIdx)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  sIdx === activeStepIndex
                    ? 'bg-[#B4232C] text-white shadow-xs scale-105'
                    : sIdx < activeStepIndex
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span>{s.step}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Steps Grid: Progressive Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-6">
          {currentSteps.map((item, idx) => {
            const isRevealed = idx <= activeStepIndex || hoveredIndex === idx;
            const isCurrent = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setActiveStepIndex(Math.max(activeStepIndex, idx))}
                className={`relative rounded-2xl p-6 transition-all duration-500 flex flex-col justify-between overflow-hidden group ${
                  isRevealed
                    ? isCurrent
                      ? 'bg-white border-2 border-[#B4232C]/50 ring-4 ring-[#B4232C]/10 shadow-xl -translate-y-1.5 z-10 filter-none opacity-100 scale-100'
                      : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-md filter-none opacity-95 scale-100'
                    : 'bg-slate-50/70 border border-dashed border-slate-300 shadow-2xs filter blur-[5px] opacity-35 scale-[0.98] select-none cursor-pointer'
                }`}
                id={`step-card-${idx}`}
              >
                {/* Overlay prompt on blurred future cards */}
                {!isRevealed && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-md group-hover:scale-105 transition-transform">
                      <span>Scroll to reveal Step {item.step}</span>
                      <ArrowDown className="w-3.5 h-3.5 text-[#B4232C] animate-bounce" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-red-100 border border-red-200 scale-110 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                          : 'bg-red-50 border border-red-100'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8F1D25] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B4232C] animate-ping" />
                          Active
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Done
                        </span>
                      )}
                      <span className="font-mono text-2xl font-extrabold text-slate-300">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                {idx < currentSteps.length - 1 && (
                  <>
                    {/* Desktop: Horizontal right arrow */}
                    <div
                      className={`hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border items-center justify-center transition-all ${
                        idx < activeStepIndex
                          ? 'bg-[#B4232C] border-[#B4232C] text-white shadow-md ring-2 ring-red-200 scale-110'
                          : 'bg-white border-slate-200 text-slate-300 opacity-50'
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Mobile (< md): Centered downward arrow connecting to next step */}
                    <div
                      className={`flex md:hidden absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 w-7 h-7 rounded-full border items-center justify-center transition-all ${
                        idx < activeStepIndex
                          ? 'bg-[#B4232C] border-[#B4232C] text-white shadow-md ring-2 ring-red-200 scale-110'
                          : 'bg-white border-slate-200 text-slate-300 opacity-50'
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>

                    {/* Tablet (md to lg): Flow arrows between columns and rows */}
                    {idx === 0 && (
                      <div
                        className={`hidden md:flex lg:hidden absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border items-center justify-center transition-all ${
                          idx < activeStepIndex
                            ? 'bg-[#B4232C] border-[#B4232C] text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-300 opacity-50'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {idx === 1 && (
                      <div
                        className={`hidden md:flex lg:hidden absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 w-7 h-7 rounded-full border items-center justify-center transition-all ${
                          idx < activeStepIndex
                            ? 'bg-[#B4232C] border-[#B4232C] text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-300 opacity-50'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {idx === 2 && (
                      <div
                        className={`hidden md:flex lg:hidden absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border items-center justify-center transition-all ${
                          idx < activeStepIndex
                            ? 'bg-[#B4232C] border-[#B4232C] text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-300 opacity-50'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic CTA bottom */}
        <div className="mt-10 text-center">
          {activeTab === 'need-blood' ? (
            <button
              onClick={() => navigate('request-blood')}
              className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              id="how-it-works-req-cta"
            >
              <span>Submit Blood Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('become-donor')}
              className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              id="how-it-works-donor-cta"
            >
              <span>Register as a Donor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
