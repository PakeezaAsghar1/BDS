import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="privacy-policy-page">
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy by Design Architecture</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">BDS UET Donor Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: August 2026 • Version 2.4</p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Purpose & Scope</h2>
              <p>
                Blood Donor Society at the University of Engineering & Technology (BDS UET) is committed to safeguarding
                the personal and medical privacy of all student donors, faculty volunteers, and patients. This policy
                governs how information is gathered, stored, and accessed across our digital coordination platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. No Public Exposure of Phone Numbers</h2>
              <p>
                To prevent unsolicited calls, spam, and harassment, <strong>BDS UET never publishes personal donor phone numbers or exact residential addresses publicly on the internet</strong>.
                When a hospital or patient family requests a donor, communication is strictly routed through authorized,
                on-duty student coordinators who verify medical requisition slips beforehand.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Data Collected & Retention</h2>
              <p>When registering as a voluntary donor, we record:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>Full Name, Age, Gender, and Blood Group</li>
                <li>University Association (Campus, Department, Batch)</li>
                <li>Emergency Contact Numbers and Availability Status</li>
                <li>Donation logs to enforce safe medical waiting intervals (minimum 90 days between donations)</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. Right to Deactivate / Opt-Out</h2>
              <p>
                Any registered donor may toggle their availability to "Unavailable", "On Break", or request permanent
                removal from the active emergency dispatch database at any time via the Donor Portal or by messaging the
                central desk.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">5. Medical Disclaimer</h2>
              <p>
                BDS UET operates solely as a volunteer coordination facilitator. Final clinical screening, pathogen testing
                (Hepatitis B/C, HIV, Syphilis, Malaria), and cross-matching are conducted exclusively by licensed hospital
                laboratories and blood bank medical officers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
