import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, Sparkles, Award } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { campaigns, navigate } = useApp();
  const [eventType, setEventType] = useState<'upcoming' | 'past'>('upcoming');

  const filteredCampaigns = campaigns.filter((camp) =>
    eventType === 'upcoming' ? camp.status !== 'Completed' : camp.status === 'Completed'
  );

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="campaigns-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UET Narowal Donation Drives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            UET Narowal Blood Donation Camps & Drives
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Organized across UET Narowal Campus in partnership with DHQ Hospital Narowal, Sughra Shafi Complex,
            and Pakistan Red Crescent. Reserve your preferred time slot online to skip the line.
          </p>
        </div>

        {/* Segmented Switch: Upcoming Events vs Past Events (matching reference design) */}
        <div className="flex items-center justify-start mb-10">
          <div
            role="tablist"
            aria-label="Event type selector"
            className="inline-flex items-center p-1.5 bg-white rounded-full border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            id="events-segmented-control"
          >
            <button
              type="button"
              role="tab"
              aria-selected={eventType === 'upcoming'}
              onClick={() => setEventType('upcoming')}
              className={`relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-center transition-all duration-300 flex items-center justify-center cursor-pointer select-none ${
                eventType === 'upcoming'
                  ? 'bg-[#B4232C] text-white shadow-md shadow-red-900/20'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
              id="toggle-upcoming-events"
            >
              <span
                className={`text-sm sm:text-base font-bold leading-tight ${
                  eventType === 'upcoming' ? 'text-white' : 'text-slate-600'
                }`}
              >
                Upcoming Events
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={eventType === 'past'}
              onClick={() => setEventType('past')}
              className={`relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-center transition-all duration-300 flex items-center justify-center cursor-pointer select-none ${
                eventType === 'past'
                  ? 'bg-[#B4232C] text-white shadow-md shadow-red-900/20'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
              id="toggle-past-events"
            >
              <span
                className={`text-sm sm:text-base font-bold leading-tight ${
                  eventType === 'past' ? 'text-white' : 'text-slate-600'
                }`}
              >
                Past Events
              </span>
            </button>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((camp) => {
            const isCompleted = camp.status === 'Completed';
            const percentFilled = Math.min(100, Math.round((camp.registeredCount / camp.capacity) * 100));
            const percentTarget = camp.targetUnits ? Math.min(100, Math.round(((camp.collectedUnits || 0) / camp.targetUnits) * 100)) : 100;

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                id={`campaign-card-${camp.id}`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={camp.featuredImage}
                      alt={camp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B4232C]" />
                      <span>{new Date(camp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div
                      className={`absolute top-3 right-3 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'bg-[#B4232C] text-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      <span>{camp.status}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {camp.campus}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-[#B4232C] transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{camp.description}</p>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#B4232C] shrink-0" />
                        <span className="font-medium text-slate-800">{camp.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#B4232C] shrink-0" />
                        <span>
                          {camp.startTime} – {camp.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator: Slots reserved for upcoming, Units collected for past */}
                    {isCompleted ? (
                      <div className="mt-5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            Units Collected
                          </span>
                          <span className="font-bold text-slate-900">
                            {camp.collectedUnits} / {camp.targetUnits} ({percentTarget}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentTarget}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Slots Reserved</span>
                          <span className="font-bold text-slate-900">
                            {camp.registeredCount} / {camp.capacity} ({percentFilled}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-[#B4232C] rounded-full transition-all duration-500"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate('campaign-detail', { campaignSlug: camp.slug })}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold text-xs py-3 rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-900 hover:bg-black text-white'
                        : 'bg-[#B4232C] hover:bg-[#8F1D25] text-white'
                    }`}
                    id={`view-camp-detail-btn-${camp.id}`}
                  >
                    <span>{isCompleted ? 'View Drive Impact & Records' : 'View Drive & Reserve Slot'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">
                No {eventType === 'upcoming' ? 'upcoming' : 'past'} donation events found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {eventType === 'upcoming'
                  ? 'New drives will be posted here as soon as dates are confirmed.'
                  : 'No past records available at this time.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

