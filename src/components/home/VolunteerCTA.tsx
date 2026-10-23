import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import bloodDonorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';

export const VolunteerCTA: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] border-b border-slate-200/80 relative overflow-hidden" id="volunteer-cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-stretch min-h-[300px]">
          {/* Left Photo Area with "Real People. Real Impact." cursive overlay */}
          <div className="relative md:w-5/12 lg:w-5/12 min-h-[240px] sm:min-h-[280px] md:min-h-[320px] overflow-hidden shrink-0">
            <img
              src={bloodDonorArmImg}
              alt="Blood donor arm with red stress ball and IV tubing"
              className="w-full h-full object-cover object-[25%_center]"
            />
            {/* Soft dark vignette on the left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
            {/* Seamless fade to white towards the content on the right (desktop) */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-28 lg:w-40 bg-gradient-to-r from-transparent via-white/80 to-white pointer-events-none" />
            {/* Fade to white on mobile bottom */}
            <div className="md:hidden absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />

            {/* Handwritten script overlay: "Real People. Real Impact." with heart flourish */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center pl-6 sm:pl-8 lg:pl-10 text-white select-none pointer-events-none z-10">
              <div className="-rotate-6 transform origin-bottom-left space-y-0.5">
                <span className="block font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-none">
                  Real People.
                </span>
                <span className="block font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-none">
                  Real Impact.
                </span>

                {/* Underline flourish leading to delicate heart */}
                <div className="flex items-center gap-1.5 pt-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                  <svg
                    className="w-16 sm:w-20 h-4 text-white"
                    viewBox="0 0 70 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M 4 12 C 22 17, 45 14, 66 5" />
                  </svg>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Content Column */}
          <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-start text-left relative z-10 space-y-3 sm:space-y-4 max-w-2xl">
            <ScrollReveal direction="up" delayMs={0}>
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#B4232C]">
                JOIN OUR MISSION
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Be a Part of Something Bigger
              </h3>
            </ScrollReveal>
            <ScrollReveal direction="up" delayMs={120}>
              <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal">
                Whether you donate, volunteer or simply spread the word — you help us save lives. Together, we can build a healthier and stronger community across UET Narowal.
              </p>
            </ScrollReveal>
            <div className="pt-2">
              <button
                onClick={() => navigate('volunteers')}
                className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-xl transition-all shadow-md shadow-red-900/15 hover:gap-3 active:scale-95 group cursor-pointer btn-subtle-lift"
                id="cta-join-volunteer-btn"
              >
                <span>Get Involved</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Ribbon Heart Artistic Graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-40 sm:w-64 lg:w-80 pointer-events-none opacity-85 sm:opacity-95 flex items-center justify-end overflow-hidden z-0">
            <svg
              viewBox="0 0 280 200"
              className="w-full h-full text-[#E11D48] translate-x-4 sm:translate-x-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 0 170 C 50 185, 95 180, 135 155 C 160 140, 172 118, 176 90 C 182 60, 168 40, 148 44 C 128 48, 122 70, 130 96 C 144 135, 182 165, 208 155 C 230 146, 248 120, 245 88 C 242 58, 222 44, 202 48 C 188 52, 178 70, 180 92 C 183 124, 208 160, 242 168 C 265 174, 280 155, 300 130" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
