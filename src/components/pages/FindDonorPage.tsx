import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, Donor, UET_CAMPUSES } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  HeartHandshake,
  FileSearch,
  Activity
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const FindDonorPage: React.FC = () => {
  const { donors, requests, navigate, addBloodRequest, showToast } = useApp();

  // Tracking query state
  const [trackCode, setTrackCode] = useState('');

  // Filters state
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Contact request modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<Donor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [urgency, setUrgency] = useState<'Critical' | 'Urgent' | 'Scheduled'>('Urgent');

  // Filtered donors
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      // Only include public donors in directory (private donors kept confidential for coordinator dispatch)
      if (d.isPublic === false) return false;
      if (selectedGroup !== 'all' && d.bloodGroup !== selectedGroup) return false;
      if (selectedCampus !== 'all' && !d.campus.toLowerCase().includes(selectedCampus.toLowerCase())) return false;
      if (emergencyOnly && !d.emergencyAvailable) return false;
      if (availableOnly && d.availabilityStatus !== 'Available') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          (d.name && d.name.toLowerCase().includes(q)) ||
          d.city.toLowerCase().includes(q) ||
          d.campus.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q) ||
          d.bloodGroup.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [donors, selectedGroup, selectedCampus, emergencyOnly, availableOnly, searchQuery]);

  const handleOpenContactModal = (donor: Donor) => {
    setSelectedDonorForContact(donor);
    setContactModalOpen(true);
  };

  const handleDispatchContactRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonorForContact) return;

    if (!patientName.trim() || !hospitalName.trim() || !requesterPhone.trim()) {
      showToast('Missing Fields', 'Please complete all required fields for hospital coordination.', 'warning');
      return;
    }

    // Create a linked blood request
    const newReq = await addBloodRequest({
      patientName,
      hospitalName,
      requesterPhone,
      bloodGroup: selectedDonorForContact.bloodGroup,
      urgency,
      unitsRequired: 1,
      hospitalCity: selectedDonorForContact.city,
      caseDescription: `Direct coordinator contact requested for donor ID: ${selectedDonorForContact.id}`,
    });

    setContactModalOpen(false);
    setPatientName('');
    setHospitalName('');
    setRequesterPhone('');

    navigate('track-request', { requestId: newReq.id });
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackCode.trim();
    if (!query) {
      navigate('track-request');
      return;
    }
    navigate('track-request', { requestId: query });
  };

  return (
    <div className="py-10 bg-[#FAF9F7] min-h-screen" id="find-donor-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title */}
        <ScrollReveal direction="up" duration={600}>
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/70 text-[#8F1D25] text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy-Protected Donor Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Find a Verified Blood Donor
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Search active volunteer donors registered across UET campuses and Punjab. To protect donor privacy and
              prevent harassment, contact is facilitated securely through our on-duty BDS coordinators.
            </p>
          </div>
        </ScrollReveal>

        {/* Dual Actions: Emergency Blood Request & Track Existing Case */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Emergency Prompt Banner */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-gradient-to-r from-red-900 to-[#B4232C] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shrink-0">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Need blood urgently within hours?</h3>
                <p className="text-xs text-red-100">
                  Submit an emergency case for immediate student dispatch.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('emergency-request')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white text-[#8F1D25] hover:bg-red-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-xs btn-subtle-lift"
              id="find-donor-emergency-btn"
            >
              <span>Emergency Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Track Existing Request Banner */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#B4232C] flex items-center justify-center">
                  <FileSearch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Track an Existing Case</h3>
                  <p className="text-[11px] text-slate-500">Check live coordinator dispatch status</p>
                </div>
              </div>
              <button
                onClick={() => navigate('track-request')}
                className="text-xs font-bold text-[#B4232C] hover:underline"
              >
                Tracker View →
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. BDS-2026-EM01)"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                id="find-donor-track-code-input"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                id="find-donor-track-code-btn"
              >
                <Activity className="w-3.5 h-3.5 text-red-400" />
                <span>Track</span>
              </button>
            </form>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs mb-8 space-y-5">
          {/* Row 1: Search & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by department, hostel (e.g. CS, Iqbal Hall, Adda Siraj) or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4232C] focus:border-transparent"
                id="donor-search-input"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#B4232C]"
                id="donor-campus-filter"
              >
                <option value="all">All UET Narowal Donors</option>
                <option value="UET Narowal Campus">UET Narowal Campus</option>
                <option value="Hostel">Hostels (Iqbal & Girls Hall)</option>
                <option value="Narowal">Narowal Local Areas</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4"
                />
                <span>Emergency On-Call Only</span>
              </label>
            </div>
          </div>

          {/* Row 2: Blood Group Selector Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Filter by Blood Group
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGroup === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                id="filter-blood-all"
              >
                All Blood Groups
              </button>
              {ALL_BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedGroup === bg
                      ? 'bg-[#B4232C] text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  id={`filter-blood-${bg.replace('+', 'pos').replace('-', 'neg')}`}
                >
                  <span>{bg}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <strong className="text-slate-900">{filteredDonors.length}</strong> verified available donors
          </p>
          <span className="text-xs text-slate-400">All donors screened under BDS clinical safety standards</span>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#B4232C] flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching donors found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find an available donor matching your current filters right now. Submit an emergency request
              and our coordinators will search our extended on-call student database.
            </p>
            <button
              onClick={() => navigate('emergency-request')}
              className="inline-flex items-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <span>Submit Emergency Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => {
              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  id={`donor-card-${donor.id}`}
                >
                  <div>
                    {/* Top Row: Blood Group & Verification */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge group={donor.bloodGroup} size="lg" />
                        <div>
                          <h4 className="font-bold text-base text-slate-900">
                            {/* Display anonymized title or verified initial */}
                            Available Donor
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">ID: {donor.id.toUpperCase()}</span>
                        </div>
                      </div>
                      <StatusBadge status={donor.availabilityStatus} type="availability" />
                    </div>

                    {/* Donor Details list */}
                    <div className="space-y-2 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#B4232C]" /> Campus / City
                        </span>
                        <span className="font-semibold text-slate-900 text-right">{donor.campus}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">General Area</span>
                        <span className="font-medium text-slate-800">{donor.area}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Donor Type
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {donor.affiliation === 'Citizen'
                            ? 'Verified Community Donor'
                            : donor.affiliation === 'Faculty'
                            ? 'Verified Faculty / Staff'
                            : donor.affiliation === 'Alumni'
                            ? 'Verified Alumni Donor'
                            : 'Verified Student Donor'}
                        </span>
                      </div>

                      {donor.lastDonationDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Donated
                          </span>
                          <span className="font-medium text-slate-700">
                            {new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Past Donations</span>
                        <span className="font-bold text-slate-900">{donor.donationCount} times</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => handleOpenContactModal(donor)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                      id={`request-contact-btn-${donor.id}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Request Contact via BDS</span>
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                      Protected contact facilitated through BDS UET coordinator
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Request Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Request Donor Coordination"
        subtitle={
          selectedDonorForContact
            ? `Dispatching request for ${selectedDonorForContact.bloodGroup} donor in ${selectedDonorForContact.campus}`
            : ''
        }
      >
        <form onSubmit={handleDispatchContactRequest} className="space-y-4" id="contact-request-form">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-slate-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B4232C] shrink-0 mt-0.5" />
            <span>
              Your request will immediately notify on-duty BDS UET coordinators who will contact the donor and verify
              hospital cross-match.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Patient Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kashif Mehmood"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Hospital & Ward Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DHQ Hospital Narowal, Emergency Ward"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Requester Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0300-1234567"
                value={requesterPhone}
                onChange={(e) => setRequesterPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
              >
                <option value="Critical">Critical (Immediate)</option>
                <option value="Urgent">Urgent (Within 24h)</option>
                <option value="Scheduled">Scheduled (Planned)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
              id="confirm-dispatch-request-btn"
            >
              <span>Submit & Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
