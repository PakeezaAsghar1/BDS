import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, HeartHandshake, ShieldAlert, Calendar } from 'lucide-react';

export const ImpactBar: React.FC = () => {
  const { stats, donors, requests, campaigns } = useApp();

  const metrics = [
    {
      icon: <Users className="w-6 h-6 text-[#B4232C]" />,
      value: '2,500+',
      subtext: 'Registered Donors',
      description: `${donors.length} active in demo network`,
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-600" />,
      value: '1,200+',
      subtext: 'Successful Connections',
      description: `${stats.completedDonations} recorded in system`,
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
      value: '50+',
      subtext: 'Emergency Cases Supported',
      description: 'Critical hospital cases managed',
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      value: '20+',
      subtext: 'Blood Donation Drives',
      description: `${campaigns.length} scheduled on campus`,
    },
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-200/80" id="impact-statistics-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Verified Impact</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our impact grows with every donor</h2>
          <p className="text-sm text-slate-600 mt-1.5">
            Serving UET campuses and Punjab healthcare institutions through transparent volunteer coordination.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F7] rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-center hover:border-red-200 transition-colors shadow-xs"
              id={`metric-card-${idx}`}
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-200/60 mb-3">
                {m.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
              <div className="text-sm font-bold text-slate-800 mt-1">{m.subtext}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
