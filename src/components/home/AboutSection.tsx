import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import uetCampusTowerImg from '../../assets/images/uet_campus_tower_1792275186910.jpg';

export const AboutSection: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 overflow-hidden" id="about-us-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <ScrollReveal direction="up" delayMs={0}>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#B4232C] block">
                ABOUT BDS UET
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mt-2 mb-4">
                More Than Just <br className="hidden sm:inline" />
                Blood Donation
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={120}>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                <p>
                  BDS UET is a team of passionate students from UET working to create awareness, organize donation drives
                  and bridge the gap between donors and those in need.
                </p>
                <p>
                  We collaborate with hospitals, organize regular blood donation camps, and engage the campus community
                  through events, workshops and outreach programs.
                </p>
              </div>
            </ScrollReveal>

            {/* Our Journey Button leading to About Page */}
            <div className="pt-2 sm:pt-4">
              <button
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all shadow-md shadow-red-900/15 hover:gap-3 active:scale-95 group cursor-pointer btn-subtle-lift"
                id="about-our-journey-btn"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Visual: Angled UET Clock Tower Photo Frame with "Small act. Big impact. ♡" Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end pb-8 sm:pb-6">
            <div className="relative max-w-md sm:max-w-lg w-full">
              {/* White Polaroid/Card Frame */}
              <div className="relative rounded-3xl p-3 sm:p-4 bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={uetCampusTowerImg}
                    alt="UET Campus Clock Tower and Green Grounds"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Overlaid Badge on bottom right: "Small act. Big impact. ♡" */}
                <div className="absolute -bottom-6 -right-2 sm:-bottom-7 sm:-right-4 bg-white rounded-2xl px-5 py-4 border border-slate-200/80 shadow-2xl shadow-slate-900/15 rotate-[4deg] hover:rotate-[1deg] transition-transform select-none z-10">
                  <div className="space-y-0.5">
                    <span className="block font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                      Small act.
                    </span>
                    <span className="block font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                      Big impact.
                    </span>
                  </div>

                  {/* Red flourish underline leading to delicate heart */}
                  <div className="flex items-center gap-1.5 pt-1 text-[#B4232C]">
                    <svg
                      className="w-20 sm:w-24 h-4 text-[#B4232C]"
                      viewBox="0 0 80 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M 4 12 C 25 17, 52 14, 76 5" />
                    </svg>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#B4232C] fill-none"
                      viewBox="0 0 24 24"
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
          </div>
        </div>
      </div>
    </section>
  );
};
