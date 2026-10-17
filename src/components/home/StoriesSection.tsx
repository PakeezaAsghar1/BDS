import React from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { Heart, Quote, ArrowRight, CheckCircle2 } from 'lucide-react';

export const StoriesSection: React.FC = () => {
  const { stories, navigate } = useApp();

  return (
    <section className="py-16 bg-white border-b border-slate-200/80" id="stories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Community Stories</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Real Lives Touched by BDS UET</h2>
            <p className="text-sm text-slate-600 mt-1">
              Every drop given by our student donors brings hope to families in critical moments.
            </p>
          </div>
          <button
            onClick={() => navigate('stories')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors"
          >
            <span>Read All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#FAF9F7] rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-red-200 transition-colors"
              id={`story-card-${story.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100/70 text-[#8F1D25]">
                    {story.category}
                  </span>
                  <BloodGroupBadge group={story.bloodGroup} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">{story.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {story.patientReference} • {story.hospital}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{story.story}</p>

                {story.recipientQuote && (
                  <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/60 text-xs text-slate-700 italic flex items-start gap-2">
                    <Quote className="w-4 h-4 text-[#B4232C] shrink-0 opacity-60 mt-0.5" />
                    <span>{story.recipientQuote}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{story.unitsProvided} Units Coordinated</span>
                <span>{story.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
