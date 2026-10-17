import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodRequest, RequestStatus } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  PhoneCall,
  Activity,
  ShieldCheck,
  AlertCircle,
  FileSearch,
  MessageSquare
} from 'lucide-react';

const STATUS_STEPS: RequestStatus[] = [
  'Submitted',
  'Under Review',
  'Donor Search Active',
  'Donor Found',
  'Donation Confirmed',
  'Completed',
];

export const TrackRequestPage: React.FC = () => {
  const { requests, selectedRequestId, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequest, setActiveRequest] = useState<BloodRequest | null>(null);

  // If a request ID was passed in context, load it
  useEffect(() => {
    if (selectedRequestId) {
      const found = requests.find((r) => r.id === selectedRequestId || r.requestCode === selectedRequestId);
      if (found) {
        setActiveRequest(found);
        setSearchQuery(found.requestCode);
      }
    } else if (requests.length > 0 && !activeRequest) {
      // Default to first active request for immediate evaluation
      setActiveRequest(requests[0]);
      setSearchQuery(requests[0].requestCode);
    }
  }, [selectedRequestId, requests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = requests.find(
      (r) =>
        r.requestCode.toLowerCase() === query ||
        r.id.toLowerCase() === query ||
        r.requesterPhone.includes(query) ||
        r.patientName.toLowerCase().includes(query)
    );

    if (found) {
      setActiveRequest(found);
    } else {
      alert(`No blood request found with code "${searchQuery}". Please check the ID or contact our helpline.`);
    }
  };

  const getStepIndex = (status: RequestStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="track-request-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Live Status Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Blood Request Status
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Enter your unique Request Code (e.g. <span className="font-mono font-bold text-slate-900">BDS-2026-EM09</span>) to monitor live coordinator dispatch.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Request Code (e.g. BDS-2026-EM09) or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                id="track-search-input"
              />
            </div>
            <button
              type="submit"
              className="bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-xs shrink-0"
              id="track-search-submit-btn"
            >
              Track Request
            </button>
          </form>

          {/* Quick Switch Links for existing cases */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold">Active cases in demo:</span>
            {requests.slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRequest(r);
                  setSearchQuery(r.requestCode);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono font-bold transition-colors ${
                  activeRequest?.id === r.id
                    ? 'bg-red-50 text-[#B4232C] border-red-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.requestCode} ({r.bloodGroup})
              </button>
            ))}
          </div>
        </div>

        {/* Request Details View */}
        {activeRequest ? (
          <div className="space-y-6">
            {/* Top Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <BloodGroupBadge group={activeRequest.bloodGroup} size="xl" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Request ID
                      </span>
                      <StatusBadge status={activeRequest.urgency} type="urgency" />
                    </div>
                    <h2 className="text-2xl font-mono font-extrabold text-slate-900">{activeRequest.requestCode}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted on {new Date(activeRequest.createdAt).toLocaleDateString()} at{' '}
                      {new Date(activeRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Status</span>
                  <div className="mt-1">
                    <StatusBadge status={activeRequest.status} type="request" className="text-sm px-3 py-1 font-bold" />
                  </div>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Coordination Progress
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(activeRequest.status);
                      const isPast = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-red-50 border-[#B4232C] text-[#8F1D25] font-bold shadow-xs'
                              : isPast
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#B4232C] text-white animate-pulse'
                                : isPast
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isPast && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className="text-[11px] leading-tight block">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Case Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                    Patient & Requisition
                  </span>
                  <div className="font-bold text-sm text-slate-900">{activeRequest.patientName}</div>
                  <div className="text-slate-600">
                    Units Needed: <strong className="text-slate-900">{activeRequest.unitsRequired} Bag(s)</strong>
                  </div>
                  {activeRequest.caseDescription && (
                    <p className="text-slate-500 italic mt-1">{activeRequest.caseDescription}</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                    Hospital Location
                  </span>
                  <div className="font-bold text-sm text-slate-900">{activeRequest.hospitalName}</div>
                  <div className="text-slate-600">
                    City: <strong className="text-slate-900">{activeRequest.hospitalCity}</strong>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Req Date: {activeRequest.requiredDate}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                    Assigned Coordinator
                  </span>
                  <div className="font-bold text-sm text-slate-900">
                    {activeRequest.assignedCoordinatorName || 'BDS Central Desk'}
                  </div>
                  <div className="text-emerald-700 font-semibold">Active Dispatcher</div>
                  <a
                    href="tel:+923008472910"
                    className="inline-flex items-center gap-1 text-[#B4232C] hover:underline font-bold mt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>0300-8472910</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Status History Logs Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#B4232C]" />
                <span>Live Coordination Logs</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeRequest.statusUpdates.map((update, idx) => (
                  <div key={update.id} className="relative pl-9 text-xs" id={`status-update-${update.id}`}>
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#B4232C] border-2 border-white ring-2 ring-red-100" />
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-xs">{update.status}</span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          {new Date(update.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{update.note}</p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1.5">
                        Logged by: {update.updatedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            Search for a valid Request Code to view tracking details.
          </div>
        )}
      </div>
    </div>
  );
};
