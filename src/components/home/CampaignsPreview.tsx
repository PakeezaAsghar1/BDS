import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { Calendar, MapPin, Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const CampaignsPreview: React.FC = () => {
  const { campaigns, navigate } = useApp();
  const upcoming = campaigns.filter((c) => c.status === 'Upcoming');
  const total = upcoming.length;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Auto-play timer: changes automatically after a few seconds (4.5s)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  // Scroll detection: change cards when scrolling down or up near this section
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDelta = 0;
    const SCROLL_THRESHOLD = 140; // Pixels of scroll delta required to switch card

    const onScroll = () => {
      const section = document.getElementById('campaigns-preview-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (!inView) {
        lastScrollY = window.scrollY;
        accumulatedDelta = 0;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      accumulatedDelta += delta;

      if (accumulatedDelta >= SCROLL_THRESHOLD) {
        // Scrolled down -> advance to next card
        setActiveIndex((prev) => (prev + 1) % total);
        accumulatedDelta = 0;
      } else if (accumulatedDelta <= -SCROLL_THRESHOLD) {
        // Scrolled up -> back to previous card
        setActiveIndex((prev) => (prev - 1 + total) % total);
        accumulatedDelta = 0;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [total]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] border-b border-slate-200/80 relative overflow-hidden" id="campaigns-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <ScrollReveal direction="up" delayMs={0}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Community Drives</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#B4232C] text-[11px] font-extrabold border border-red-200/80">
                  {upcoming.length} Upcoming
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1.5">Upcoming Blood Donation Camps</h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delayMs={120}>
              <p className="text-sm text-slate-600 mt-1">
                Join our campus donation drives in partnership with certified hematology foundations.
              </p>
            </ScrollReveal>
          </div>
          <button
            onClick={() => navigate('campaigns')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors cursor-pointer hover:translate-x-0.5 duration-200"
            id="view-all-campaigns-btn"
          >
            <span>View All Drives ({upcoming.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Cards Container */}
        <div
          className="relative min-h-[510px] xs:min-h-[480px] sm:min-h-[450px] md:min-h-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 overflow-hidden md:overflow-visible"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {upcoming.map((camp, index) => {
            const isCurrent = index === activeIndex;
            const isPrev = index === (activeIndex - 1 + total) % total;

            let mobileClasses = '';
            if (isCurrent) {
              mobileClasses = 'absolute inset-0 z-10 opacity-100 translate-x-0 pointer-events-auto';
            } else if (isPrev) {
              mobileClasses = 'absolute inset-0 z-0 opacity-0 -translate-x-full pointer-events-none';
            } else {
              mobileClasses = 'absolute inset-0 z-0 opacity-0 translate-x-full pointer-events-none';
            }

            return (
              <div
                key={camp.id}
                id={`campaign-card-${camp.id}`}
                className={`bg-[#FAF9F7] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-500 ease-out flex flex-col justify-between group ${mobileClasses} md:static md:inset-auto md:z-auto md:opacity-100 md:translate-x-0 md:pointer-events-auto`}
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
                      <span>
                        {new Date(camp.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
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
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-[#B4232C] border border-red-200 hover:border-red-300 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    id={`register-camp-btn-${camp.id}`}
                  >
                    <span>Register for Drive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controls: Back, Dots, and Next */}
        <div className="flex md:hidden items-center justify-between gap-3 mt-6 pt-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous campaign"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-[#B4232C] hover:border-red-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
            id="campaigns-mobile-prev-btn"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {upcoming.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Event ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-7 bg-[#B4232C]' : 'w-2 bg-slate-200 hover:bg-red-200'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next campaign"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-[#B4232C] hover:border-red-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
            id="campaigns-mobile-next-btn"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
