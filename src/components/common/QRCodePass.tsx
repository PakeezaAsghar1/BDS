import React from 'react';
import { BloodGroup } from '../../types';
import { BloodGroupBadge } from './BloodGroupBadge';
import { ShieldCheck, Calendar, Clock, MapPin, User, CheckCircle2, Download } from 'lucide-react';

interface QRCodePassProps {
  passType: 'Campaign Registration' | 'Donor Card' | 'Emergency Request Pass';
  title: string;
  code: string;
  name: string;
  bloodGroup: BloodGroup;
  venueOrHospital: string;
  dateTime: string;
  timeSlot?: string;
  status?: string;
}

export const QRCodePass: React.FC<QRCodePassProps> = ({
  passType,
  title,
  code,
  name,
  bloodGroup,
  venueOrHospital,
  dateTime,
  timeSlot,
  status = 'VERIFIED PASS',
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="bg-white border-2 border-slate-900/10 rounded-2xl overflow-hidden shadow-lg max-w-md mx-auto print:shadow-none print:border-black"
      id={`qr-pass-${code}`}
    >
      {/* Top Brand Banner */}
      <div className="bg-[#B4232C] text-white p-4.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
            🩸
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight leading-none">BDS UET</h4>
            <p className="text-[11px] text-red-100 font-medium tracking-wide uppercase mt-0.5">Blood Donor Society</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white">
          {passType}
        </span>
      </div>

      {/* Main Pass Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-dashed border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pass Reference ID</span>
            <p className="text-lg font-mono font-extrabold text-slate-900 tracking-tight">{code}</p>
            <h5 className="font-bold text-slate-800 text-sm mt-1">{title}</h5>
          </div>
          <BloodGroupBadge group={bloodGroup} size="lg" />
        </div>

        {/* QR Simulation Art */}
        <div className="my-5 flex items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="relative p-2 bg-white rounded-lg shadow-xs border border-slate-200">
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 text-slate-900"
              fill="currentColor"
              aria-label="QR Code"
            >
              {/* Corner position markers */}
              <rect x="0" y="0" width="28" height="28" fill="#171717" />
              <rect x="4" y="4" width="20" height="20" fill="white" />
              <rect x="8" y="8" width="12" height="12" fill="#B4232C" />

              <rect x="72" y="0" width="28" height="28" fill="#171717" />
              <rect x="76" y="4" width="20" height="20" fill="white" />
              <rect x="80" y="8" width="12" height="12" fill="#B4232C" />

              <rect x="0" y="72" width="28" height="28" fill="#171717" />
              <rect x="4" y="76" width="20" height="20" fill="white" />
              <rect x="8" y="80" width="12" height="12" fill="#B4232C" />

              {/* Data pattern grid */}
              <rect x="36" y="8" width="8" height="8" />
              <rect x="48" y="12" width="12" height="6" />
              <rect x="12" y="36" width="6" height="12" />
              <rect x="36" y="36" width="14" height="14" fill="#B4232C" />
              <rect x="56" y="36" width="10" height="8" />
              <rect x="72" y="44" width="14" height="8" />
              <rect x="36" y="56" width="8" height="16" />
              <rect x="50" y="50" width="16" height="10" />
              <rect x="72" y="64" width="10" height="14" />
              <rect x="44" y="78" width="18" height="8" />
              <rect x="72" y="84" width="14" height="10" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-slate-800 border border-slate-300 shadow-xs">
                UET BDS
              </span>
            </div>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </span>
            <span className="font-bold text-slate-900">{name}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location / Venue
            </span>
            <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{venueOrHospital}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date & Time
            </span>
            <span className="font-semibold text-slate-900">{dateTime}</span>
          </div>

          {timeSlot && (
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Assigned Slot
              </span>
              <span className="font-bold text-[#B4232C]">{timeSlot}</span>
            </div>
          )}
        </div>

        {/* Security badge & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{status}</span>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors print:hidden"
            id={`print-pass-${code}`}
          >
            <Download className="w-3.5 h-3.5" /> Save / Print
          </button>
        </div>
      </div>
    </div>
  );
};
