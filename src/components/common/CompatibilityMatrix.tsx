import React, { useState } from 'react';
import { BloodGroup } from '../../types';
import { COMPATIBILITY_DATA } from '../../data/mockData';
import { BloodGroupBadge } from './BloodGroupBadge';
import { Check, ShieldAlert, ArrowRight, Info } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityMatrix: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const info = COMPATIBILITY_DATA[selectedGroup];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs" id="compatibility-matrix-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Interactive Guide</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">Blood Compatibility Explorer</h3>
          <p className="text-sm text-slate-600">Select any blood group to inspect transfusion giving & receiving pathways.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              id={`select-compat-${bg.replace('+', 'pos').replace('-', 'neg')}`}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedGroup === bg
                  ? 'bg-[#B4232C] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Selected group highlights */}
        <div className="lg:col-span-4 bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={selectedGroup} size="xl" />
              <div>
                <span className="text-xs uppercase font-semibold text-slate-500">Selected Type</span>
                <h4 className="text-lg font-bold text-slate-900">{selectedGroup} Blood Group</h4>
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-4 leading-relaxed">{info.description}</p>
            <div className="mt-4 pt-3 border-t border-red-100 text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#B4232C] shrink-0" />
              <span>{info.rarity}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-100/80 text-[11px] text-slate-500 leading-normal flex items-start gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Blood compatibility must always be cross-matched by certified hospital blood bank staff before transfusion.</span>
          </div>
        </div>

        {/* Giving & Receiving breakdown */}
        <div className="lg:col-span-8 space-y-5">
          {/* Can give to */}
          <div className="bg-slate-50/80 p-4.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Can Donate Red Blood Cells To ({info.canGiveTo.length} types)
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">GIVER → RECIPIENT</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const canGive = info.canGiveTo.includes(bg);
                return (
                  <div
                    key={`give-${bg}`}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      canGive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-300 opacity-40'
                    }`}
                  >
                    <span className="text-xs">{bg}</span>
                    {canGive && <Check className="w-3.5 h-3.5 text-emerald-600 mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Can receive from */}
          <div className="bg-slate-50/80 p-4.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B4232C]" />
                <h4 className="text-sm font-bold text-slate-900">
                  Can Safely Receive Red Blood Cells From ({info.canReceiveFrom.length} types)
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">DONOR → RECIPIENT</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const canReceive = info.canReceiveFrom.includes(bg);
                return (
                  <div
                    key={`recv-${bg}`}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      canReceive
                        ? 'bg-red-50 border-red-300 text-red-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-300 opacity-40'
                    }`}
                  >
                    <span className="text-xs">{bg}</span>
                    {canReceive && <Check className="w-3.5 h-3.5 text-[#B4232C] mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
