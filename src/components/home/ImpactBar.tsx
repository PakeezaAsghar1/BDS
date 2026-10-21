import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, HeartHandshake, ShieldAlert, ArrowUpRight } from 'lucide-react';

export interface ImpactBarProps {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showTrustedBy?: boolean;
}

// Protruding Jigsaw Puzzle Tab (matching exact geometry from reference image)
const PuzzleTab: React.FC<{ isConnected?: boolean }> = ({ isConnected }) => (
  <div className="absolute top-1/2 -translate-y-1/2 -right-[13px] xs:-right-[15px] sm:-right-[18px] z-30 pointer-events-none drop-shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
    <svg
      className="w-[14px] h-[32px] xs:w-[16px] xs:h-[36px] sm:w-[20px] sm:h-[44px] overflow-visible"
      viewBox="0 0 20 44"
      fill="none"
    >
      {/* Seamless white tab body matching card surface */}
      <path
        d="M 0 5 C 4 5, 6 1.5, 10 1.5 C 16 1.5, 20 7, 20 22 C 20 37, 16 42.5, 10 42.5 C 6 42.5, 4 39, 0 39 Z"
        fill="#FFFFFF"
      />
      {/* Crisp outer puzzle contour line */}
      <path
        d="M 0 5 C 4 5, 6 1.5, 10 1.5 C 16 1.5, 20 7, 20 22 C 20 37, 16 42.5, 10 42.5 C 6 42.5, 4 39, 0 39"
        stroke={isConnected ? '#CBD5E1' : '#94A3B8'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

// Indented Jigsaw Puzzle Socket (matching exact geometry from reference image)
const PuzzleSocket: React.FC<{ isConnected?: boolean }> = ({ isConnected }) => (
  <div className="absolute top-1/2 -translate-y-1/2 -left-[1px] z-20 pointer-events-none">
    <svg
      className="w-[14px] h-[32px] xs:w-[16px] xs:h-[36px] sm:w-[20px] sm:h-[44px] overflow-visible"
      viewBox="0 0 20 44"
      fill="none"
    >
      {/* Cutout filled with warm cream section background */}
      <path
        d="M 0 5 C 4 5, 6 1.5, 10 1.5 C 16 1.5, 20 7, 20 22 C 20 37, 16 42.5, 10 42.5 C 6 42.5, 4 39, 0 39 L 0 5 Z"
        fill="#FAF9F7"
      />
      {/* Crisp inner contour curve */}
      <path
        d="M 0 5 C 4 5, 6 1.5, 10 1.5 C 16 1.5, 20 7, 20 22 C 20 37, 16 42.5, 10 42.5 C 6 42.5, 4 39, 0 39"
        stroke={isConnected ? '#CBD5E1' : '#94A3B8'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

// Top subtle jigsaw tab for the center piece (like in the reference diagram)
const PuzzleTabTop: React.FC = () => (
  <div className="absolute -top-[12px] sm:-top-[15px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
    <svg
      className="w-[28px] h-[13px] sm:w-[36px] sm:h-[16px] overflow-visible"
      viewBox="0 0 36 16"
      fill="none"
    >
      <path
        d="M 4 16 C 4 12, 1 10, 1 6 C 1 2, 7 0, 18 0 C 29 0, 35 2, 35 6 C 35 10, 32 12, 32 16 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 4 16 C 4 12, 1 10, 1 6 C 1 2, 7 0, 18 0 C 29 0, 35 2, 35 6 C 35 10, 32 12, 32 16"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

export const ImpactBar: React.FC<ImpactBarProps> = ({
  id = 'impact-statistics-section',
  className = 'bg-[#FAF9F7]',
  showTrustedBy = true,
}) => {
  const { stats, donors } = useApp();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll Progress (0 to 1) calculated dynamically as user scrolls down the page
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Start assembly when section enters bottom of viewport
          // Complete assembly when section is nicely centered in view
          const startTrigger = windowHeight * 0.95;
          const endTrigger = windowHeight * 0.38;

          const raw = (startTrigger - rect.top) / (startTrigger - endTrigger);
          const clamped = Math.min(Math.max(raw, 0), 1);
          setScrollProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Card 2 animation progress: locks into Card 1 from progress 0.0 -> 0.5
  const p2 = Math.min(Math.max(scrollProgress / 0.5, 0), 1);
  const card2Connected = p2 >= 0.88;

  // Card 3 animation progress: locks into Card 2 from progress 0.5 -> 1.0
  const p3 = Math.min(Math.max((scrollProgress - 0.45) / 0.55, 0), 1);
  const card3Connected = p3 >= 0.88;

  const metrics = [
    {
      icon: <Users className="w-4 h-4 sm:w-6 sm:h-6 text-[#B4232C]" />,
      value: '2,500+',
      subtext: 'Registered Donors',
      description: `${donors.length} active in demo network`,
      badge: 'Active Network',
      liveIndicator: 'Verified Students & Faculty',
      gradient: 'from-[#B4232C] to-red-400',
      iconBg: 'bg-red-50',
      iconBorder: 'border-red-100',
      badgeBg: 'bg-red-50/80',
      badgeText: 'text-[#8F1D25]',
      badgeBorder: 'border-red-200/60',
      dotBg: 'bg-[#B4232C]',
    },
    {
      icon: <HeartHandshake className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />,
      value: '1,200+',
      subtext: 'Successful Connections',
      description: `${stats.completedDonations} recorded in system`,
      badge: 'Lives Impacted',
      liveIndicator: 'Hospital Cross-Matches',
      gradient: 'from-emerald-500 to-teal-400',
      iconBg: 'bg-emerald-50',
      iconBorder: 'border-emerald-100',
      badgeBg: 'bg-emerald-50/80',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-200/60',
      dotBg: 'bg-emerald-500',
    },
    {
      icon: <ShieldAlert className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />,
      value: '50+',
      subtext: 'Emergency Cases Supported',
      description: 'Critical hospital cases managed',
      badge: '24/7 Response',
      liveIndicator: 'Urgent Case Desk',
      gradient: 'from-amber-500 to-orange-400',
      iconBg: 'bg-amber-50',
      iconBorder: 'border-amber-100',
      badgeBg: 'bg-amber-50/80',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200/60',
      dotBg: 'bg-amber-500',
    },
  ];

  const trustedPartnerNames = [
    'DHQ Hospital Narowal',
    'Mayo Hospital Lahore',
    'Sundas Foundation (Thalassemia Care)',
    'Fatimid Foundation Blood Bank',
    'Rescue 1122 Punjab Emergency',
    'CMH Sialkot Medical Complex',
    'Pakistan Red Crescent Society',
    'THQ Hospital Shakargarh',
    'UET Narowal Health Center',
    'Shaukat Khanum Diagnostic Network',
    'Services Hospital Lahore',
    'Allama Iqbal Memorial Teaching Hospital',
  ];

  return (
    <section
      ref={sectionRef}
      className={`${className} py-5 sm:py-7 border-b border-slate-200/80 select-none overflow-hidden`}
      id={id}
    >
      <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6">
        
        {/* 3 Impact Cards in a Single Line: Scroll-Driven Puzzle Assembly */}
        <div className="relative max-w-4xl mx-auto pt-2 pb-1">
          <div className="grid grid-cols-3 gap-1.5 xs:gap-2.5 sm:gap-4 lg:gap-5 items-center">
            
            {/* CARD 1: First Puzzle Card (Anchor Piece, has Jigsaw Tab on right) */}
            <div className="relative z-10">
              <div
                className="relative bg-white rounded-xl sm:rounded-2xl p-3 xs:p-3.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[155px] xs:min-h-[168px] sm:min-h-[205px] text-left group overflow-visible"
                id="metric-card-0"
              >
                {/* Top Accent Gradient Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metrics[0].gradient} rounded-t-xl sm:rounded-t-2xl`}
                  aria-hidden="true"
                />

                {/* Jigsaw Tab protruding to the right into Card 2 */}
                <PuzzleTab isConnected={card2Connected} />

                {/* Card Top: Icon & Category Badge */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div
                      className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${metrics[0].iconBg} ${metrics[0].iconBorder} border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all duration-300 shrink-0`}
                    >
                      {metrics[0].icon}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[8px] xs:text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${metrics[0].badgeBg} ${metrics[0].badgeText} border ${metrics[0].badgeBorder}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${metrics[0].dotBg} animate-pulse`} />
                      <span className="hidden xs:inline">{metrics[0].badge}</span>
                      <span className="xs:hidden">Donors</span>
                    </span>
                  </div>

                  {/* Main Stat Number */}
                  <div className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#B4232C] transition-colors">
                    {metrics[0].value}
                  </div>

                  {/* Subtext / Metric Title */}
                  <div className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-slate-800 mt-1 sm:mt-1.5 tracking-tight line-clamp-1 sm:line-clamp-none">
                    {metrics[0].subtext}
                  </div>

                  {/* Description */}
                  <div className="hidden sm:block text-[11px] lg:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {metrics[0].description}
                  </div>
                </div>

                {/* Card Footer: Live Indicator */}
                <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  <span className="truncate">{metrics[0].liveIndicator}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#B4232C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </div>
            </div>

            {/* CARD 2: Second Puzzle Card (Slides in on scroll and locks into Card 1) */}
            <div
              className="relative z-20 will-change-transform"
              style={{
                transform: `translate3d(${(1 - p2) * 36}px, ${(1 - p2) * -8}px, 0) rotate(${(1 - p2) * 2.5}deg)`,
                opacity: 0.5 + p2 * 0.5,
                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
              }}
            >
              <div
                className="relative bg-white rounded-xl sm:rounded-2xl p-3 xs:p-3.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[155px] xs:min-h-[168px] sm:min-h-[205px] text-left group overflow-visible"
                id="metric-card-1"
              >
                {/* Top subtle jigsaw tab like the diagram in image_e7696339.png */}
                <PuzzleTabTop />

                {/* Top Accent Gradient Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metrics[1].gradient} rounded-t-xl sm:rounded-t-2xl`}
                  aria-hidden="true"
                />

                {/* Jigsaw Socket on the left receiving Card 1's Tab */}
                <PuzzleSocket isConnected={card2Connected} />

                {/* Jigsaw Tab on the right side protruding into Card 3 */}
                <PuzzleTab isConnected={card3Connected} />

                {/* Card Top: Icon & Category Badge */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div
                      className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${metrics[1].iconBg} ${metrics[1].iconBorder} border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all duration-300 shrink-0`}
                    >
                      {metrics[1].icon}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[8px] xs:text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${metrics[1].badgeBg} ${metrics[1].badgeText} border ${metrics[1].badgeBorder}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${metrics[1].dotBg} animate-pulse`} />
                      <span className="hidden xs:inline">{metrics[1].badge}</span>
                      <span className="xs:hidden">Saved</span>
                    </span>
                  </div>

                  {/* Main Stat Number */}
                  <div className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                    {metrics[1].value}
                  </div>

                  {/* Subtext / Metric Title */}
                  <div className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-slate-800 mt-1 sm:mt-1.5 tracking-tight line-clamp-1 sm:line-clamp-none">
                    {metrics[1].subtext}
                  </div>

                  {/* Description */}
                  <div className="hidden sm:block text-[11px] lg:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {metrics[1].description}
                  </div>
                </div>

                {/* Card Footer: Live Indicator */}
                <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  <span className="truncate">{metrics[1].liveIndicator}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </div>
            </div>

            {/* CARD 3: Third Puzzle Card (Slides in on scroll and locks into Card 2) */}
            <div
              className="relative z-10 will-change-transform"
              style={{
                transform: `translate3d(${(1 - p3) * 36}px, ${(1 - p3) * 8}px, 0) rotate(${(1 - p3) * -2.5}deg)`,
                opacity: 0.5 + p3 * 0.5,
                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
              }}
            >
              <div
                className="relative bg-white rounded-xl sm:rounded-2xl p-3 xs:p-3.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[155px] xs:min-h-[168px] sm:min-h-[205px] text-left group overflow-visible"
                id="metric-card-2"
              >
                {/* Top Accent Gradient Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metrics[2].gradient} rounded-t-xl sm:rounded-t-2xl`}
                  aria-hidden="true"
                />

                {/* Jigsaw Socket on the left receiving Card 2's Tab */}
                <PuzzleSocket isConnected={card3Connected} />

                {/* Card Top: Icon & Category Badge */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div
                      className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${metrics[2].iconBg} ${metrics[2].iconBorder} border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all duration-300 shrink-0`}
                    >
                      {metrics[2].icon}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[8px] xs:text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${metrics[2].badgeBg} ${metrics[2].badgeText} border ${metrics[2].badgeBorder}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${metrics[2].dotBg} animate-pulse`} />
                      <span className="hidden xs:inline">{metrics[2].badge}</span>
                      <span className="xs:hidden">24/7</span>
                    </span>
                  </div>

                  {/* Main Stat Number */}
                  <div className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                    {metrics[2].value}
                  </div>

                  {/* Subtext / Metric Title */}
                  <div className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-slate-800 mt-1 sm:mt-1.5 tracking-tight line-clamp-1 sm:line-clamp-none">
                    {metrics[2].subtext}
                  </div>

                  {/* Description */}
                  <div className="hidden sm:block text-[11px] lg:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {metrics[2].description}
                  </div>
                </div>

                {/* Card Footer: Live Indicator */}
                <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  <span className="truncate">{metrics[2].liveIndicator}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Compact Trusted By Marquee Bar */}
        {showTrustedBy && (
          <div
            className="mt-6 sm:mt-7 -mx-3 xs:-mx-4 sm:-mx-6 border-y border-[#8F1D25] bg-[#B4232C] py-2 sm:py-2.5 relative overflow-hidden flex items-center select-none shadow-xs"
            id="trusted-by-bar"
          >
            {/* Left Fixed Label */}
            <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-3 sm:pl-6 pr-5 sm:pr-8 bg-gradient-to-r from-[#B4232C] via-[#B4232C] to-transparent pointer-events-none">
              <span className="font-extrabold tracking-[0.2em] text-[10px] sm:text-[11px] text-white uppercase whitespace-nowrap drop-shadow-xs">
                TRUSTED &nbsp;BY
              </span>
            </div>

            {/* Right Edge Fade Mask */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#B4232C] to-transparent z-10"
              aria-hidden="true"
            />

            {/* Seamless Infinite Marquee of Names */}
            <div className="animate-marquee-left pause-on-hover flex items-center">
              {[0, 1].map((copyIdx) => (
                <div key={copyIdx} className="flex items-center shrink-0">
                  {trustedPartnerNames.map((name, idx) => (
                    <div
                      key={`partner-${copyIdx}-${idx}`}
                      className="flex items-center gap-2 mx-3 sm:mx-4 shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-semibold text-white/95 whitespace-nowrap tracking-tight hover:text-white transition-colors">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
