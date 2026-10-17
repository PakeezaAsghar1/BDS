import React from 'react';
import { CompatibilityMatrix } from '../common/CompatibilityMatrix';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const BloodGroupExplorer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 bg-[#FAF9F7] border-b border-slate-200/80" id="blood-group-explorer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Compatibility Science</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Interactive Blood Compatibility</h2>
            <p className="text-sm text-slate-600 mt-1">
              Understand red blood cell compatibility, antigen matches, and why universal donors matter.
            </p>
          </div>
          <button
            onClick={() => navigate('guide')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B4232C] hover:text-[#8F1D25] transition-colors"
          >
            <span>Read Health Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <CompatibilityMatrix />
      </div>
    </section>
  );
};
