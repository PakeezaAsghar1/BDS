import React from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';
import { PlusCircle, FileText, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const RequesterDashboard: React.FC = () => {
  const { requests, navigate, currentUser } = useApp();

  return (
    <div className="py-10 bg-[#FAF9F7] min-h-screen" id="requester-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Patient Care Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">My Blood Requests</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track live coordination progress, matched donors, and hospital dispatch notes.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('emergency-request')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#8F1D25] hover:bg-[#6e161c] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs animate-pulse"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Emergency Request</span>
            </button>
            <button
              onClick={() => navigate('request-blood')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Routine Request</span>
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Your Submitted Cases ({requests.length})</h3>
            <span className="text-xs text-slate-500">Live synchronization with BDS Dispatch Desk</span>
          </div>

          {requests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <p>You haven't submitted any blood requests yet.</p>
              <button
                onClick={() => navigate('request-blood')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B4232C] hover:underline"
              >
                <span>Submit a new request now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-red-200 transition-colors"
                  id={`my-request-card-${req.id}`}
                >
                  <div className="flex items-start gap-4">
                    <BloodGroupBadge group={req.bloodGroup} size="lg" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-slate-900">{req.patientName}</h4>
                        <StatusBadge status={req.urgency} type="urgency" />
                        <span className="text-xs font-mono font-bold text-slate-500">{req.requestCode}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B4232C]" />
                        <span>
                          {req.hospitalName} ({req.hospitalCity}) • <strong>{req.unitsRequired} Bag(s)</strong>
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Coordinator: <strong>{req.assignedCoordinatorName || 'BDS Central Desk'}</strong> •{' '}
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <StatusBadge status={req.status} type="request" />
                    <button
                      onClick={() => navigate('track-request', { requestId: req.id })}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 text-[#B4232C] border border-red-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Live Tracker</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
