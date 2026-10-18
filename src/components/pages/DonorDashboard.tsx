import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodePass } from '../common/QRCodePass';
import { Modal } from '../common/Modal';
import {
  Heart,
  Calendar,
  ShieldCheck,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Award,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const {
    currentUser,
    donors,
    requests,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    updateDonorAvailability,
    logDonationForDonor,
    navigate,
    showToast,
  } = useApp();

  const [showQRModal, setShowQRModal] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalVenue, setHospitalVenue] = useState('DHQ Hospital Narowal');

  // Find linked donor profile
  const donorProfile =
    donors.find((d) => d.id === currentUser?.donorProfileId || d.email === currentUser?.email) || donors[0];

  // Calculate next eligible date (90 days after last donation)
  const calculateEligibility = () => {
    if (!donorProfile.lastDonationDate) return { isEligible: true, daysLeft: 0, nextDate: 'Immediately' };
    const last = new Date(donorProfile.lastDonationDate);
    const next = new Date(last);
    next.setDate(last.getDate() + 90);
    const now = new Date();
    const diffTime = next.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { isEligible: true, daysLeft: 0, nextDate: 'Immediately' };
    }
    return {
      isEligible: false,
      daysLeft: diffDays,
      nextDate: next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const eligibility = calculateEligibility();

  // Find matching urgent requests in the donor's area matching blood group
  const matchingRequests = requests.filter(
    (r) =>
      r.status !== 'Completed' &&
      r.status !== 'Donation Confirmed' &&
      (r.bloodGroup === donorProfile.bloodGroup || donorProfile.bloodGroup === 'O-')
  );

  const handleToggleStatus = (status: 'Available' | 'Busy' | 'On Break') => {
    updateDonorAvailability(donorProfile.id, status, donorProfile.emergencyAvailable);
  };

  const handleToggleEmergency = () => {
    updateDonorAvailability(donorProfile.id, donorProfile.availabilityStatus, !donorProfile.emergencyAvailable);
  };

  const handleRecordDonation = (e: React.FormEvent) => {
    e.preventDefault();
    logDonationForDonor(donorProfile.id, hospitalVenue);
    setLogModalOpen(false);
  };

  return (
    <div className="py-10 bg-[#FAF9F7] min-h-screen" id="donor-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <BloodGroupBadge group={donorProfile.bloodGroup} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{donorProfile.name}</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Donor</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ID: <span className="font-mono font-bold text-slate-700">{donorProfile.id.toUpperCase()}</span> •{' '}
                {donorProfile.campus} • {donorProfile.studentBatch || 'UET Blood Network'}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="font-semibold text-slate-700">
                  Total Donations: <strong className="text-[#B4232C]">{donorProfile.donationCount} Units</strong>
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">
                  Lives Touched: <strong className="text-emerald-600">~{donorProfile.donationCount * 3}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
              id="donor-view-qr-pass-btn"
            >
              <QrCode className="w-4 h-4" />
              <span>Digital Donor Card</span>
            </button>

            <button
              onClick={() => setLogModalOpen(true)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
              id="donor-log-donation-btn"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Log New Donation</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Status Controls & Eligibility */}
          <div className="lg:col-span-4 space-y-6">
            {/* Availability & Emergency Controls */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900">Availability Controls</h3>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase">Current Dispatch Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Available', 'Busy', 'On Break'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleToggleStatus(st)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        donorProfile.availabilityStatus === st
                          ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Call Toggle */}
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Emergency On-Call</span>
                  <span className="text-[11px] text-slate-500 block">Receive priority hospital alerts</span>
                </div>
                <button
                  onClick={handleToggleEmergency}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    donorProfile.emergencyAvailable ? 'bg-[#B4232C]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      donorProfile.emergencyAvailable ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Next Eligible Donation Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Safety</span>
                <Calendar className="w-4 h-4 text-[#B4232C]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Next Eligible Donation</h4>
                {eligibility.isEligible ? (
                  <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You are fully eligible to donate blood right now!</span>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>{eligibility.daysLeft} days remaining for recovery</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Eligible from: <strong>{eligibility.nextDate}</strong> (90-day clinical recovery cycle)
                    </p>
                  </div>
                )}
              </div>

              {donorProfile.lastDonationDate && (
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Last Donated:</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(donorProfile.lastDonationDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Emergency Alerts & Donation History */}
          <div className="lg:col-span-8 space-y-6">
            {/* Account Notifications Widget for Logged-In Donor */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4" id="donor-notifications-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#B4232C] flex items-center justify-center font-bold">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Donor Account Notifications</h3>
                    <p className="text-xs text-slate-500">Live alerts, emergency calls, and drive announcements</p>
                  </div>
                </div>

                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-bold text-[#B4232C] hover:underline"
                  >
                    Mark all read ({unreadNotificationCount} new)
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No notifications yet. You're all caught up!</p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`pt-2.5 pb-1 flex items-start justify-between gap-3 text-xs cursor-pointer ${
                        !n.read ? 'font-semibold' : 'text-slate-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900 font-bold">{n.title}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#B4232C] inline-block" />}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matching Urgent Blood Requests */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Urgent Matches</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Emergency Requests Matching You</h3>
                </div>
                <span className="text-xs bg-red-100 text-[#8F1D25] font-bold px-2.5 py-1 rounded-full">
                  {matchingRequests.length} active case(s)
                </span>
              </div>

              {matchingRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">
                  No active emergency requests matching your blood group in your area right now.
                </p>
              ) : (
                <div className="space-y-3">
                  {matchingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <BloodGroupBadge group={req.bloodGroup} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{req.patientName}</h4>
                            <StatusBadge status={req.urgency} type="urgency" />
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#B4232C]" />
                            <span>
                              {req.hospitalName} ({req.hospitalCity}) • {req.unitsRequired} Bag(s)
                            </span>
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">Code: {req.requestCode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => navigate('track-request', { requestId: req.id })}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
                        >
                          <span>Review Case</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Donation History Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900">Your Donation History</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Hospital / Camp Venue</th>
                      <th className="pb-3 font-bold">Units</th>
                      <th className="pb-3 font-bold">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3.5 font-medium">May 14, 2026</td>
                      <td className="py-3.5 font-semibold text-slate-900">UET Narowal Grand Blood Camp</td>
                      <td className="py-3.5">1 Unit (Whole Blood)</td>
                      <td className="py-3.5">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-medium">Jan 18, 2026</td>
                      <td className="py-3.5 font-semibold text-slate-900">DHQ Hospital Narowal Emergency ICU</td>
                      <td className="py-3.5">1 Unit (Whole Blood)</td>
                      <td className="py-3.5">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-medium">Sep 05, 2025</td>
                      <td className="py-3.5 font-semibold text-slate-900">Red Crescent Camp UET Narowal</td>
                      <td className="py-3.5">1 Unit (Whole Blood)</td>
                      <td className="py-3.5">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: View Digital QR Donor Pass */}
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title="Digital Blood Donor Pass"
          subtitle="Show this verified membership pass at any BDS UET drive."
        >
          <QRCodePass
            passType="Donor Card"
            title="Official BDS Donor Pass"
            code={donorProfile.id.toUpperCase()}
            name={donorProfile.name}
            bloodGroup={donorProfile.bloodGroup}
            venueOrHospital={donorProfile.campus}
            dateTime="Valid Active Member"
            status="VERIFIED BDS VOLUNTEER"
          />
        </Modal>

        {/* Modal: Log Donation */}
        <Modal
          isOpen={logModalOpen}
          onClose={() => setLogModalOpen(false)}
          title="Log a Blood Donation"
          subtitle="Record your donation date to update your safe recovery timeline."
        >
          <form onSubmit={handleRecordDonation} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Donation Date *</label>
              <input
                type="date"
                required
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Hospital / Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. DHQ Hospital Narowal / Red Crescent"
                value={hospitalVenue}
                onChange={(e) => setHospitalVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogModalOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold px-5 py-2 rounded-xl shadow-xs"
              >
                Save Record
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
