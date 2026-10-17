import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CampaignsPreview: React.FC = () => {
  const { campaigns, navigate } = useApp();
  const upcoming = campaigns.filter((c) => c.status === 'Upcoming').slice(0, 3);

  return (
    <section className="py-16 bg-white border-b border-slate-200/80" id="campaigns-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Community Drives</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Upcoming Blood Donation Camps</h2>
            <p className="text-sm text-slate-600 mt-1">
              Join our campus donation drives in partnership with certified hematology foundations.
            </p>
          </div>
          <button
            onClick={() => navigate('campaigns')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors"
            id="view-all-campaigns-btn"
          >
            <span>View All Drives</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((camp) => (
            <div
              key={camp.id}
              className="bg-[#FAF9F7] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              id={`campaign-card-${camp.id}`}
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-200">
                  <img
                    src={camp.featuredImage}
                    alt={camp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B4232C]" />
                    <span>{new Date(camp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white font-medium text-[11px] px-2 py-0.5 rounded">
                    {camp.campus}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#B4232C] transition-colors">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{camp.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B4232C] shrink-0" />
                      <span className="truncate">{camp.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B4232C] shrink-0" />
                      <span>
                        {camp.startTime} – {camp.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        <strong>{camp.registeredCount}</strong> / {camp.capacity} Registered Donors
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate('campaign-detail', { campaignSlug: camp.slug })}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-[#B4232C] border border-red-200 hover:border-red-300 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                  id={`register-camp-btn-${camp.id}`}
                >
                  <span>Register for Drive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
