import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UrgencyLevel, MAJOR_HOSPITALS } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  AlertCircle,
  PlusCircle,
  Clock,
  Phone,
  Building,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Share2,
  FileText
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface RequestBloodPageProps {
  isEmergencyDefault?: boolean;
}

export const RequestBloodPage: React.FC<RequestBloodPageProps> = ({ isEmergencyDefault = false }) => {
  const { addBloodRequest, navigate } = useApp();

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsRequired, setUnitsRequired] = useState<number>(1);
  const [hospitalName, setHospitalName] = useState(MAJOR_HOSPITALS[0]);
  const [customHospital, setCustomHospital] = useState('');
  const [hospitalCity, setHospitalCity] = useState('Narowal');
  const [hospitalCampusArea, setHospitalCampusArea] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>(isEmergencyDefault ? 'Critical' : 'Urgent');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiredTime, setRequiredTime] = useState('As soon as possible');
  const [requesterName, setRequesterName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [relationshipToPatient, setRelationshipToPatient] = useState('Family Member');
  const [caseDescription, setCaseDescription] = useState('');
  const [consent, setConsent] = useState(false);

  // Completed submission state
  const [createdRequest, setCreatedRequest] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please confirm that you have an authorized doctor/hospital blood requirement slip.');
      return;
    }

    const finalHospital = hospitalName === 'Other' ? customHospital : hospitalName;

    const req = await addBloodRequest({
      patientName,
      patientAge: patientAge ? Number(patientAge) : undefined,
      bloodGroup,
      unitsRequired: Number(unitsRequired),
      hospitalName: finalHospital || 'DHQ Hospital Narowal',
      hospitalCity,
      hospitalCampusArea,
      urgency,
      requiredDate,
      requiredTime,
      requesterName,
      requesterPhone,
      alternativePhone,
      relationshipToPatient,
      caseDescription,
    });

    setCreatedRequest(req);
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="request-blood-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {!createdRequest ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                  urgency === 'Critical'
                    ? 'bg-red-100 text-red-900 border border-red-200 animate-pulse'
                    : 'bg-red-50 text-[#8F1D25] border border-red-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {urgency === 'Critical' ? 'Critical Emergency Intake' : 'Verified Blood Coordination Desk'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {urgency === 'Critical' ? 'Emergency Blood Request' : 'Submit a Blood Request'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Tell us what blood type and hospital you need. Our on-duty student coordinators will immediately verify
                the case and match available volunteer donors.
              </p>
            </div>

            {/* Critical Lifesaving Notice */}
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#B4232C] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Emergency Medical Alert:</strong>
                If the patient is in acute life-threatening distress, notify the attending emergency hospital doctor or
                blood bank immediately. BDS UET is a volunteer donor coordination society and does not substitute hospital
                emergency departments.
              </div>
            </div>

            {/* Main Form Card */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8"
              id="blood-request-intake-form"
            >
              {/* Section 1: Urgency & Blood Group */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. Select Blood Group Needed <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-mono">STEP 1 OF 4</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`py-3 px-2 rounded-xl text-center font-mono text-sm font-extrabold transition-all border ${
                        bloodGroup === bg
                          ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-md scale-105 ring-2 ring-red-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                      id={`request-select-group-${bg.replace('+', 'pos').replace('-', 'neg')}`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      urgency === 'Critical'
                        ? 'bg-red-50 border-red-500 text-red-950 font-bold ring-2 ring-red-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'Critical'}
                      onChange={() => setUrgency('Critical')}
                      className="text-[#B4232C] focus:ring-[#B4232C]"
                    />
                    <div>
                      <span className="text-xs font-bold block">Critical — Immediate</span>
                      <span className="text-[10px] text-slate-500">Needed within 1–2 hours</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      urgency === 'Urgent'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'Urgent'}
                      onChange={() => setUrgency('Urgent')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold block">Urgent — Within 24 Hours</span>
                      <span className="text-[10px] text-slate-500">Surgeries / Thalassemia</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      urgency === 'Scheduled'
                        ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'Scheduled'}
                      onChange={() => setUrgency('Scheduled')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold block">Scheduled — Later Date</span>
                      <span className="text-[10px] text-slate-500">Planned elective operation</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2: Patient & Medical Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">2. Patient & Medical Facility</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Patient Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kashif Mehmood"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Units Required (Bags) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={unitsRequired}
                      onChange={(e) => setUnitsRequired(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hospital / Blood Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white font-medium"
                    >
                      {MAJOR_HOSPITALS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                      <option value="Other">Other Hospital (Enter Name)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hospital City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Narowal, Zafarwal, Shakargarh"
                      value={hospitalCity}
                      onChange={(e) => setHospitalCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                {hospitalName === 'Other' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Custom Hospital Name & Ward <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Memorial Hospital, Ward 4"
                      value={customHospital}
                      onChange={(e) => setCustomHospital(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Required Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Required Time / Urgency Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Before 2:00 PM / Immediate"
                      value={requiredTime}
                      onChange={(e) => setRequiredTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact Person Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">3. Attendant & Contact Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Attendant / Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Relationship to Patient
                    </label>
                    <select
                      value={relationshipToPatient}
                      onChange={(e) => setRelationshipToPatient(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                    >
                      <option value="Father / Mother">Parent</option>
                      <option value="Brother / Sister">Sibling</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Relative / Friend">Relative / Friend</option>
                      <option value="Self / Patient">Self</option>
                      <option value="Hospital Staff / Doctor">Hospital Staff</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Primary Phone (Active WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300-4892147"
                      value={requesterPhone}
                      onChange={(e) => setRequesterPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Alternative Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0321-8847120"
                      value={alternativePhone}
                      onChange={(e) => setAlternativePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Medical Case Summary / Cross-Match Slip Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Emergency surgery in progress / Thalassemia transfusion / Platelet requirement..."
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 4: Consent Checkbox */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4"
                  />
                  <span>
                    I confirm that this blood request is genuine and backed by a hospital/doctor requisition slip. I
                    understand that BDS UET coordinates volunteer donors free of charge.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full inline-flex items-center justify-center gap-2 text-white font-bold text-base py-4 px-6 rounded-xl transition-all shadow-md active:scale-98 ${
                    urgency === 'Critical'
                      ? 'bg-[#8F1D25] hover:bg-[#6e161c] shadow-red-950/20 ring-2 ring-red-300 animate-pulse'
                      : 'bg-[#B4232C] hover:bg-[#8F1D25] shadow-red-900/10'
                  }`}
                  id="submit-blood-request-btn"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>
                    {urgency === 'Critical'
                      ? 'Dispatch Emergency Blood Request'
                      : 'Submit Blood Request to BDS Desk'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen with Unique Request ID */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200" id="request-submitted-confirmation">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Request Dispatched to Coordinators
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Blood Request Registered!</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Your case has been logged in the BDS UET rapid-response queue.
                </p>
              </div>

              {/* Request ID Display */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Your Unique Tracking ID
                </span>
                <div className="text-3xl font-mono font-extrabold text-[#B4232C] tracking-wide" id="generated-request-code">
                  {createdRequest.requestCode}
                </div>
                <p className="text-xs text-slate-500">
                  Save this code to check real-time donor matches and coordinator updates anytime.
                </p>
              </div>

              {/* Summary Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Patient</span>
                  <strong className="text-slate-900">{createdRequest.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Blood Group</span>
                  <strong className="text-[#B4232C] text-sm">{createdRequest.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Units</span>
                  <strong className="text-slate-900">{createdRequest.unitsRequired} Bag(s)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Hospital</span>
                  <strong className="text-slate-900 truncate block">{createdRequest.hospitalName}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('track-request', { requestId: createdRequest.id })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs"
                  id="track-now-btn"
                >
                  <FileText className="w-4 h-4" />
                  <span>Track This Request Live</span>
                </button>

                <button
                  onClick={() => setCreatedRequest(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition-colors border border-slate-300"
                >
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
