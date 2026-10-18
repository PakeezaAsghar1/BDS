import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, HeartHandshake, ShieldAlert, Calendar, ArrowUpRight } from 'lucide-react';

export interface ImpactBarProps {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export const ImpactBar: React.FC<ImpactBarProps> = ({
  id = 'impact-statistics-section',
  className = 'bg-[#FAF9F7]',
  eyebrow = 'Verified Impact',
  title = 'Our impact grows with every donor',
  description = 'Serving UET campuses and Punjab healthcare institutions through transparent volunteer coordination.',
  showHeader = true,
}) => {
  const { stats, donors, requests, campaigns } = useApp();

  const metrics = [
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#B4232C]" />,
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
      icon: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
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
      icon: <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />,
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
    {
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
      value: '20+',
      subtext: 'Blood Donation Drives',
      description: `${campaigns.length} scheduled on campus`,
      badge: 'Campus Camps',
      liveIndicator: 'UET Campus Mobilization',
      gradient: 'from-blue-600 to-indigo-400',
      iconBg: 'bg-blue-50',
      iconBorder: 'border-blue-100',
      badgeBg: 'bg-blue-50/80',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-200/60',
      dotBg: 'bg-blue-500',
    },
  ];

  return (
    <section className={`${className} py-14 sm:py-16 border-b border-slate-200/80`} id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {showHeader && (
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C] bg-red-50 border border-red-200/70 px-3 py-1 rounded-full inline-block">
              {eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Two cards side by side layout */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 max-w-5xl mx-auto">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between text-left overflow-hidden group"
              id={`metric-card-${idx}`}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.gradient} group-hover:h-1.5 transition-all duration-300`}
                aria-hidden="true"
              />

              {/* Card Top: Icon & Category Badge */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${m.iconBg} ${m.iconBorder} border flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300 shrink-0`}
                  >
                    {m.icon}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${m.badgeBg} ${m.badgeText} border ${m.badgeBorder}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${m.dotBg} animate-pulse`} />
                    {m.badge}
                  </span>
                </div>

                {/* Main Stat Number */}
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#B4232C] transition-colors">
                  {m.value}
                </div>

                {/* Subtext / Metric Title */}
                <div className="text-xs sm:text-sm lg:text-base font-bold text-slate-800 mt-1.5 sm:mt-2 tracking-tight">
                  {m.subtext}
                </div>

                {/* Description */}
                <div className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-1 leading-relaxed">
                  {m.description}
                </div>
              </div>

              {/* Card Footer: Live Indicator & Hover Arrow */}
              <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500">
                <span className="truncate">{m.liveIndicator}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B4232C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
