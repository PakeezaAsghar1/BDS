import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  HeartHandshake,
  ShieldAlert,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  HeartPulse,
  Droplets,
  Activity,
  Stethoscope,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

export interface ImpactBarProps {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showTrustedBy?: boolean;
}

export const ImpactBar: React.FC<ImpactBarProps> = ({
  id = 'impact-statistics-section',
  className = 'bg-[#FAF9F7]',
  eyebrow = 'Verified Impact',
  title = 'Our impact grows with every donor',
  description = 'Serving UET campuses and Punjab healthcare institutions through transparent volunteer coordination.',
  showHeader = true,
  showTrustedBy = true,
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

  const cardVariants = [
    {
      // 0: Greater
      container: 'lg:min-h-[330px] lg:p-7 xl:p-8 lg:-translate-y-2 lg:shadow-md',
      valueText: 'lg:text-5xl',
      iconBox: 'lg:w-13 lg:h-13',
      headerMargin: 'lg:mb-6',
    },
    {
      // 1: Next shorter
      container: 'lg:min-h-[250px] lg:p-5 lg:translate-y-2',
      valueText: 'lg:text-4xl',
      iconBox: 'lg:w-11 lg:h-11',
      headerMargin: 'lg:mb-3',
    },
    {
      // 2: A little bit larger
      container: 'lg:min-h-[295px] lg:p-6 lg:translate-y-0',
      valueText: 'lg:text-[42px]',
      iconBox: 'lg:w-12 lg:h-12',
      headerMargin: 'lg:mb-4',
    },
    {
      // 3: Last one shorter
      container: 'lg:min-h-[250px] lg:p-5 lg:translate-y-2',
      valueText: 'lg:text-4xl',
      iconBox: 'lg:w-11 lg:h-11',
      headerMargin: 'lg:mb-3',
    },
  ];

  const trustedPartners = [
    {
      id: 'dhq-narowal',
      name: 'DHQ Hospital Narowal',
      location: 'Narowal',
      type: 'Trauma & Emergency Blood Bank',
      icon: <Building2 className="w-4 h-4 text-rose-600" />,
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
    {
      id: 'mayo-lahore',
      name: 'Mayo Hospital Lahore',
      location: 'Lahore',
      type: 'Provincial Referral Center',
      icon: <HeartPulse className="w-4 h-4 text-red-600" />,
      tagColor: 'bg-red-50 text-red-700 border-red-200/80',
    },
    {
      id: 'sundas-fdn',
      name: 'Sundas Foundation',
      location: 'Sialkot & Lahore',
      type: 'Thalassemia Blood Care Unit',
      icon: <Droplets className="w-4 h-4 text-red-600" />,
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    {
      id: 'fatimid-fdn',
      name: 'Fatimid Foundation',
      location: 'Punjab Division',
      type: 'Hematology & Safe Blood Bank',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    {
      id: 'rescue-1122',
      name: 'Rescue 1122 Punjab',
      location: 'Emergency Wing',
      type: '24/7 Rapid Ambulance Dispatch',
      icon: <Activity className="w-4 h-4 text-orange-600" />,
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200/80',
    },
    {
      id: 'cmh-sialkot',
      name: 'CMH Sialkot Medical Complex',
      location: 'Sialkot Cantt',
      type: 'Critical Care & Surgical Bank',
      icon: <Building2 className="w-4 h-4 text-blue-600" />,
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      id: 'red-crescent',
      name: 'Pakistan Red Crescent',
      location: 'Punjab Chapter',
      type: 'Humanitarian Blood Services',
      icon: <HeartHandshake className="w-4 h-4 text-red-600" />,
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
    {
      id: 'thq-shakargarh',
      name: 'THQ Hospital Shakargarh',
      location: 'Narowal Dist.',
      type: 'Maternal & Emergency Wards',
      icon: <Stethoscope className="w-4 h-4 text-teal-600" />,
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200/80',
    },
    {
      id: 'uet-medical',
      name: 'UET Campus Medical Center',
      location: 'UET Narowal',
      type: 'Student Donor Screening Hub',
      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    },
    {
      id: 'shaukat-khanum',
      name: 'Shaukat Khanum Diagnostic Lab',
      location: 'Regional Center',
      type: 'Pathology & Safety Screening',
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-600" />,
      tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
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

        {/* Laptop view: Shown one by one across the row with alternating heights (greater, shorter, larger, shorter). Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 max-w-7xl mx-auto lg:items-center">
          {metrics.map((m, idx) => {
            const variant = cardVariants[idx] || cardVariants[0];
            return (
              <div
                key={idx}
                className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between text-left overflow-hidden group ${variant.container}`}
                id={`metric-card-${idx}`}
              >
                {/* Top Accent Gradient Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.gradient} group-hover:h-1.5 transition-all duration-300`}
                  aria-hidden="true"
                />

                {/* Card Top: Icon & Category Badge */}
                <div>
                  <div className={`flex items-center justify-between mb-3 sm:mb-5 ${variant.headerMargin}`}>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${m.iconBg} ${m.iconBorder} border flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300 shrink-0 ${variant.iconBox}`}
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
                  <div
                    className={`text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#B4232C] transition-colors ${variant.valueText}`}
                  >
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
            );
          })}
        </div>

        {/* Moving Bar: Trusted by: */}
        {showTrustedBy && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/80" id="trusted-by-bar">
            {/* Header: Trusted by label and description */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-[#B4232C] border border-red-200/80 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B4232C]" />
                  <span>Trusted by:</span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Leading hospitals, regional blood banks & emergency institutions
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active 24/7 Transfusion Coordination</span>
              </div>
            </div>

            {/* Continuous marquee slider with fade edges */}
            <div className="relative overflow-hidden w-full py-1">
              {/* Fade gradient edges matching parent background */}
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r ${
                  className.includes('bg-white') ? 'from-white' : 'from-[#FAF9F7]'
                } to-transparent z-10`}
                aria-hidden="true"
              />
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l ${
                  className.includes('bg-white') ? 'from-white' : 'from-[#FAF9F7]'
                } to-transparent z-10`}
                aria-hidden="true"
              />

              {/* Seamless infinite marquee: duplicated 3 times */}
              <div className="animate-marquee-left pause-on-hover flex items-center gap-3.5 sm:gap-4.5">
                {[0, 1, 2].flatMap((copyIdx) =>
                  trustedPartners.map((partner, pIdx) => (
                    <div
                      key={`trusted-${copyIdx}-${partner.id}-${pIdx}`}
                      className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 shrink-0 group select-none cursor-default"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {partner.icon}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                            {partner.name}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border whitespace-nowrap ${partner.tagColor}`}
                          >
                            {partner.location}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                          {partner.type}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
