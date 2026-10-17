import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Search, UserCheck, Heart, UserPlus, ShieldCheck, Bell, Activity, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'need-blood' | 'want-to-donate'>('need-blood');

  const requesterSteps = [
    {
      step: '01',
      title: 'Submit Request',
      description: 'Provide patient details, required blood group, hospital ward, and urgency level via web or emergency line.',
      icon: <FileText className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '02',
      title: 'We Coordinate',
      description: 'BDS UET coordinators verify the hospital blood slip and scan our database for nearby compatible donors.',
      icon: <Search className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '03',
      title: 'Connect & Dispatch',
      description: 'A coordinator facilitates communication between the donor and the patient family directly at the blood bank.',
      icon: <UserCheck className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '04',
      title: 'Help Delivered',
      description: 'The donation and cross-match process is completed safely at the certified medical facility.',
      icon: <Heart className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const donorSteps = [
    {
      step: '01',
      title: 'Register Profile',
      description: 'Sign up with your blood type, campus location, and last donation date in under 60 seconds.',
      icon: <UserPlus className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '02',
      title: 'Get Verified',
      description: 'BDS UET verifies university student/faculty credentials to ensure a trusted, reliable community network.',
      icon: <ShieldCheck className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '03',
      title: 'Receive Request',
      description: 'Receive emergency notifications on WhatsApp or SMS only when someone matching your blood group needs urgent help.',
      icon: <Bell className="w-6 h-6 text-[#B4232C]" />,
    },
    {
      step: '04',
      title: 'Donate & Save Lives',
      description: 'Visit the hospital or campus drive, donate blood in 15 minutes, and receive an official BDS donor certificate.',
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const currentSteps = activeTab === 'need-blood' ? requesterSteps : donorSteps;

  return (
    <section className="py-16 bg-[#FAF9F7] border-b border-slate-200/80" id="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Clear & Simple Process</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How BDS UET Works</h2>
          <p className="text-sm text-slate-600 mt-2">
            A transparent volunteer-led workflow designed for speed, donor privacy, and patient safety.
          </p>

          {/* Dual Perspective Toggle */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl mt-6 shadow-xs">
            <button
              onClick={() => setActiveTab('need-blood')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'need-blood'
                  ? 'bg-[#B4232C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-how-need-blood"
            >
              For Requesters (Need Blood)
            </button>
            <button
              onClick={() => setActiveTab('want-to-donate')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'want-to-donate'
                  ? 'bg-[#B4232C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-how-donate"
            >
              For Donors (Want to Give)
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSteps.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              id={`step-card-${idx}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              {idx < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic CTA bottom */}
        <div className="mt-10 text-center">
          {activeTab === 'need-blood' ? (
            <button
              onClick={() => navigate('request-blood')}
              className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              id="how-it-works-req-cta"
            >
              <span>Submit Blood Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('become-donor')}
              className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              id="how-it-works-donor-cta"
            >
              <span>Register as a Donor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
