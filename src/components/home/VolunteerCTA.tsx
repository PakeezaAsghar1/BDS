import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const VolunteerCTA: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white" id="volunteer-cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Leadership & Humanitarian Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Become a BDS UET Volunteer & Drive Change Across Campus
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Gain vital field leadership experience in hospital liaison, emergency response coordination, health awareness
              camps, and digital operations. Every semester, UET students unite to save lives.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-semibold text-slate-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-red-400 font-bold text-sm mb-0.5">Camp Operations</span>
                Event coordination & logistics
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-red-400 font-bold text-sm mb-0.5">Emergency Desk</span>
                Hospital liaison & donor match
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-red-400 font-bold text-sm mb-0.5">Creative & Media</span>
                Design, photography & social
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-red-400 font-bold text-sm mb-0.5">Tech & Systems</span>
                Web portal & communication
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 w-full text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Join the BDS Team</h3>
              <p className="text-xs text-slate-300">Open to all enrolled UET students from all campuses and batches.</p>
              <button
                onClick={() => navigate('volunteers')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-lg shadow-red-950/50"
                id="cta-join-volunteer-btn"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Apply for Volunteer Wing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
