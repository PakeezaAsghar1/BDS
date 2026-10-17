import React from 'react';
import { FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="terms-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#8F1D25] text-xs font-bold mb-3 border border-red-200">
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service & Code of Ethics</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service & Community Charter</h1>
            <p className="text-xs text-slate-500 mt-1">Official Constitution • Blood Donor Society UET Narowal Campus</p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Strict Prohibition of Commercial Exchange</h2>
              <p>
                Blood donation arranged through BDS UET is strictly altruistic and non-monetary. Any individual found
                attempting to buy, sell, or demand monetary compensation for blood units will be permanently banned and
                reported to the university Disciplinary Committee and law enforcement.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. Genuine Medical Need Requirement</h2>
              <p>
                Requesters must submit genuine patient details and hospital references. Requisitions are subject to
                cross-verification with hospital wards before donor contact is dispatched.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Voluntary Nature of Donor Participation</h2>
              <p>
                Registered donors are volunteers. While on-call emergency notification is encouraged, a donor always
                retains the absolute right to decline a donation request based on personal health, travel, academic
                schedules, or medical advice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. University Patronage & Jurisdiction</h2>
              <p>
                BDS UET Narowal operates under the auspices of the Directorate of Student Affairs (DSA), University of Engineering
                & Technology, Narowal Campus.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
