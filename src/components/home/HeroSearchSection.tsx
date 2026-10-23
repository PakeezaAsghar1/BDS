import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { ScrollReveal } from '../common/ScrollReveal';
import {
  Heart,
  Search,
  Droplets,
  Shield,
  ArrowRight,
  Activity,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';

export const HeroSearchSection: React.FC = () => {
  const { navigate, donors } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCardsVisible(true);
      return;
    }

    const node = cardsContainerRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setCardsVisible(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setCardsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 5 friendly university lifesaver avatars matching reference image
  const lifesaverAvatars = [
    { name: 'Hamza (EE)', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face' },
    { name: 'Ayesha (CS)', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face' },
    { name: 'Bilal (ME)', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
    { name: 'Fatima (CE)', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=face' },
    { name: 'Usman (Staff)', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face' },
  ];

  // Dynamic live blood units count matching the reference image layout
  const liveBloodInventory = [
    {
      group: 'O+',
      units: Math.max(10, donors.filter((d) => d.bloodGroup === 'O+' && d.availability === 'available').length),
      status: 'High Demand',
      statusColor: 'bg-red-50 text-[#B4232C] border-red-200/70',
      urgent: true,
    },
    {
      group: 'A+',
      units: Math.max(8, donors.filter((d) => d.bloodGroup === 'A+' && d.availability === 'available').length),
      status: 'Stable',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
      urgent: false,
    },
    {
      group: 'B+',
      units: Math.max(9, donors.filter((d) => d.bloodGroup === 'B+' && d.availability === 'available').length),
      status: 'Available',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200/70',
      urgent: false,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('find-donor');
  };

  return (
    <section
      className="py-8 sm:py-12 bg-[#FAF9F7] border-b border-slate-200/80 relative overflow-hidden select-none"
      id="be-a-hero-search-donor-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <ScrollReveal direction="up" delayMs={0}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 mb-2.5 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#B4232C] text-[#B4232C] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#B4232C]">
                Campus Lifeline Network
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Be a Hero <span className="text-[#B4232C]">&</span> Find Donors
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delayMs={120}>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
              Step forward to save lives or quickly connect with verified matching blood donors at UET Narowal.
            </p>
          </ScrollReveal>
        </div>

        {/* 2-Column Grid: Spanning Full Width of the Website Container */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* CARD 1: BE A HERO (Compact)                             */}
          {/* ======================================================== */}
          <div
            className={`relative rounded-2xl bg-gradient-to-br from-white via-white to-rose-50/50 p-4 sm:p-5 border border-red-100/90 shadow-[0_8px_24px_-8px_rgba(180,35,44,0.08)] flex flex-col justify-between overflow-hidden group hover:shadow-md hover:border-red-200 transition-all duration-700 min-h-[220px] will-change-transform ${
              cardsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16 pointer-events-none'
            }`}
            style={{
              transitionDelay: cardsVisible ? '120ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B4232C] via-red-500 to-rose-400" />

            {/* Scaled-down Medical Blood IV Bag Graphic (from Image 1) */}
            <div className="absolute -right-2 -bottom-2 sm:right-1 sm:bottom-0 w-32 sm:w-40 h-40 sm:h-48 pointer-events-none opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500 select-none">
              <svg
                viewBox="0 0 200 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_8px_16px_rgba(180,35,44,0.15)]"
              >
                <ellipse cx="100" cy="115" rx="55" ry="55" fill="url(#bloodGlowSmall)" opacity="0.4" />

                <defs>
                  <radialGradient id="bloodGlowSmall" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ivBagFluidSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.75" />
                    <stop offset="45%" stopColor="#E02424" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#9B1C1C" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="bagHighlightSmall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Top Hanger Tab */}
                <path d="M 80 18 L 120 18 L 115 28 L 85 28 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
                <circle cx="100" cy="22" r="3.5" fill="#FAF9F7" stroke="#CBD5E1" strokeWidth="1" />

                {/* Bag Shell */}
                <rect
                  x="48"
                  y="28"
                  width="104"
                  height="145"
                  rx="22"
                  fill="#FFFFFF"
                  fillOpacity="0.55"
                  stroke="#FECDD3"
                  strokeWidth="2"
                />

                {/* Fluid */}
                <rect x="53" y="52" width="94" height="115" rx="18" fill="url(#ivBagFluidSmall)" />

                {/* Suspended Red Heart */}
                <g transform="translate(100, 110) scale(1.1)">
                  <path
                    d="M 0 10 C -18 -10, -28 5, 0 30 C 28 5, 18 -10, 0 10 Z"
                    fill="#FFFFFF"
                    fillOpacity="0.95"
                    filter="drop-shadow(0 2px 5px rgba(153,27,27,0.35))"
                  />
                  <path d="M 0 10 C -15 -8, -23 4, 0 25 C 23 4, 15 -8, 0 10 Z" fill="#DC2626" />
                </g>

                {/* Markers */}
                <line x1="58" y1="80" x2="68" y2="80" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="58" y1="105" x2="74" y2="105" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
                <line x1="58" y1="130" x2="68" y2="130" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

                {/* Gloss */}
                <path d="M 56 36 Q 56 32, 60 32 L 80 32 Q 62 48, 62 135" stroke="url(#bagHighlightSmall)" strokeWidth="3" strokeLinecap="round" />

                {/* Tubing */}
                <rect x="94" y="172" width="12" height="12" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
                <path d="M 100 184 C 100 205, 125 210, 140 225 C 150 235, 160 238, 175 238" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Card Content (Foreground) */}
            <div className="relative z-10 max-w-[250px] xs:max-w-[280px] sm:max-w-[310px]">
              
              {/* Slogan Badge & Headline */}
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100/70 text-[#8F1D25] text-[9px] font-bold border border-red-200/70 mb-2">
                  <Shield className="w-2.5 h-2.5 text-[#B4232C]" />
                  <span>Life Saver</span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mb-1">
                  Real Heroes Don't Wear Capes, <br />
                  <span className="text-[#B4232C]">They Donate Blood.</span>
                </h3>
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-[10.5px] sm:text-[11px] text-slate-600 leading-relaxed mb-3">
                  One donation can save up to 3 lives. Be the lifeline a fellow campus patient urgently needs.
                </p>
              </div>

              {/* Overlapping Donor Avatars Row (Scaled Smaller) */}
              <div className="flex items-center gap-2 mb-3.5">
                <div className="flex -space-x-2 overflow-hidden p-0.5">
                  {lifesaverAvatars.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar.img}
                      alt={avatar.name}
                      title={avatar.name}
                      className="inline-block w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
                    />
                  ))}
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-800 leading-tight">
                  <span className="text-[#B4232C] font-extrabold">2,500+</span> lifesavers
                  <span className="block text-[8.5px] sm:text-[9px] text-slate-500 font-medium">Join today</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="relative z-10 pt-1">
              <button
                type="button"
                onClick={() => navigate('become-donor')}
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group/btn"
              >
                <span>Be a Hero</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CARD 2: SEARCH DONOR & LIVE AVAILABILITY (Compact)       */}
          {/* ======================================================== */}
          <div
            className={`relative rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between overflow-hidden group hover:shadow-md hover:border-slate-300 transition-all duration-700 min-h-[220px] will-change-transform ${
              cardsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16 pointer-events-none'
            }`}
            style={{
              transitionDelay: cardsVisible ? '380ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

            <div>
              {/* Card Header (Smaller) */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#B4232C]">
                    <Droplets className="w-3 h-3 text-[#B4232C]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
                      Blood Availability (Live)
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                      UET Narowal donor inventory
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Quick Donor Search Bar (Compact) */}
              <form onSubmit={handleSearchSubmit} className="mb-2.5">
                <div className="relative flex items-center bg-slate-50 rounded-lg border border-slate-200/90 focus-within:border-[#B4232C] focus-within:ring-1 focus-within:ring-red-100 transition-all p-0.5">
                  <Search className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search department, group..."
                    className="w-full px-2 py-1 text-xs bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-2.5 py-1 rounded-md bg-[#B4232C] hover:bg-[#8F1D25] text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Blood Availability Table List (Compact) */}
              <div className="space-y-1.5 mb-2.5">
                {liveBloodInventory.map((item) => (
                  <div
                    key={item.group}
                    onClick={() => navigate('find-donor')}
                    className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-slate-50/70 hover:bg-red-50/50 border border-slate-100 hover:border-red-200/60 transition-all duration-150 cursor-pointer group/row"
                  >
                    {/* Left: Blood Group Icon in square box + Blood Group Name */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover/row:border-red-300 transition-colors">
                        <Droplets className="w-3 h-3 text-[#B4232C]" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#B4232C] tracking-tight">
                        {item.group}
                      </span>
                    </div>

                    {/* Middle: Status Badge */}
                    <span className={`hidden sm:inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>

                    {/* Right: Available Units count */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                        {item.units.toString().padStart(2, '0')} Units
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-[#B4232C] group-hover/row:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('find-donor')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors cursor-pointer group/link"
              >
                <span>View All Donors</span>
                <span className="font-serif text-xs transition-transform group-hover/link:translate-x-0.5">›</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('find-donor')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Search className="w-3 h-3 text-slate-500" />
                <span>Find Donor</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
