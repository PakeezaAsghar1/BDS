import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { navigate, stats, requests } = useApp();

  // Find most critical active request if any
  const criticalRequest = requests.find(
    (r) => r.urgency === 'Critical' && r.status !== 'Completed' && r.status !== 'Cancelled'
  );

  return (
    <div className="bg-[#8F1D25] text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-red-950/20" id="emergency-top-banner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white font-bold text-xs uppercase px-2 py-0.5 rounded-full tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            24/7 Emergency Dispatch
          </span>
          <span className="hidden md:inline text-red-200">|</span>
          <span className="font-medium text-red-50 text-center sm:text-left">
            {criticalRequest ? (
              <span>
                Urgent: <strong className="text-white font-bold">{criticalRequest.bloodGroup}</strong> needed at{' '}
                {criticalRequest.hospitalName}.
              </span>
            ) : (
              <span>Emergency coordination hotline active for UET Narowal & local hospitals.</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+923008472910"
            className="inline-flex items-center gap-1 text-white hover:text-amber-200 font-semibold transition-colors"
            id="emergency-phone-link"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>0300-8472910</span>
          </a>
          <button
            onClick={() => navigate('emergency-request')}
            className="inline-flex items-center gap-1 bg-white text-[#8F1D25] hover:bg-amber-100 font-bold px-2.5 py-1 rounded-md text-xs transition-colors shadow-xs"
            id="banner-emergency-request-btn"
          >
            <span>Request Blood</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
