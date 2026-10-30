import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, DonorAffiliation, UET_CAMPUSES } from '../../types';
import { QRCodePass } from '../common/QRCodePass';
import confetti from 'canvas-confetti';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
  Users,
  Lock,
  Building,
  GraduationCap,
  Briefcase,
  ChevronDown
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BecomeDonorPage: React.FC = () => {
  const { addDonor, navigate, showToast } = useApp();

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(21);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState(UET_CAMPUSES[0]);
  const [area, setArea] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');

  // Donor type / affiliation (not just students!)
  const [affiliation, setAffiliation] = useState<DonorAffiliation>('Student');
  const [studentBatch, setStudentBatch] = useState('2023-EE');
  const [occupation, setOccupation] = useState('');

  // 3 New Questions
  // Question 1: Diseases / chronic illness
  const [hasDiseases, setHasDiseases] = useState<boolean>(false);
  const [diseaseDetails, setDiseaseDetails] = useState('');

  // Question 2: Donated before or not
  const [hasDonatedBefore, setHasDonatedBefore] = useState<boolean>(false);
  const [donationCount, setDonationCount] = useState<number>(1);
  const [lastDonationDate, setLastDonationDate] = useState('');

  // Question 3: Public donor vs Private donor
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // Availability & consents
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [consentContact, setConsentContact] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);

  // Success state
  const [registeredDonor, setRegisteredDonor] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentContact || !consentPrivacy) {
      showToast('Agreement Required', 'Please accept the donor contact permission and privacy agreements to proceed.', 'warning');
      return;
    }

    if (hasDiseases && !diseaseDetails.trim()) {
      showToast('Details Required', 'Please provide brief details of your medical condition for clinical screening.', 'warning');
      return;
    }

    const uniqueGeneratedDonorId = `BDS-DNR-2026-${Math.floor(100 + Math.random() * 900)}`;

    const donor = await addDonor({
      donorId: uniqueGeneratedDonorId,
      name,
      age,
      gender,
      phone,
      email,
      campus,
      area: area || (affiliation === 'Citizen' ? 'Narowal City' : 'UET Narowal Campus'),
      bloodGroup,
      affiliation,
      occupation: affiliation === 'Citizen' ? occupation : undefined,
      studentBatch: affiliation === 'Student' ? studentBatch : undefined,
      hasDiseases,
      diseaseDetails: hasDiseases ? diseaseDetails : undefined,
      hasDonatedBefore,
      donationCount: hasDonatedBefore ? donationCount : 0,
      lastDonationDate: hasDonatedBefore && lastDonationDate ? lastDonationDate : undefined,
      isPublic,
      emergencyAvailable,
    });

    setRegisteredDonor(donor);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="become-donor-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {!registeredDonor ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open to Students, Faculty, Alumni & Community Members</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Become Someone's Reason to Hope.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Whether you are a university student, faculty member, alumnus, or caring citizen of Narowal,
                your voluntary donation saves patients in emergency wards and children fighting Thalassemia.
              </p>
            </div>

            {/* Registration Form Card */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8"
              id="donor-registration-form"
            >
              {/* Section 1: Blood Group Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  1. Select Your Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`py-3 px-2 rounded-xl text-center font-mono text-sm font-extrabold transition-all border cursor-pointer ${
                        bloodGroup === bg
                          ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-md scale-105 ring-2 ring-red-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                      id={`select-reg-group-${bg.replace('+', 'pos').replace('-', 'neg')}`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Donor Affiliation (Not just for students!) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">2. Who Are You? (Donor Affiliation)</h3>
                  <span className="text-xs text-slate-400 font-medium">Open to Everyone</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Select Affiliation / Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="donor-affiliation-select"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value as DonorAffiliation)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#B4232C] focus:border-[#B4232C] focus:outline-none bg-white transition-all appearance-none pr-10 cursor-pointer shadow-xs"
                    >
                      <option value="Student">Enrolled Student (UET / College / University)</option>
                      <option value="Faculty">Faculty / Academic Staff Member</option>
                      <option value="Alumni">University Alumni / Graduate</option>
                      <option value="Citizen">General Public / Community Resident Donor</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Open to everyone — students, university staff, graduates, and general citizens are welcome to register.
                  </p>
                </div>

                {/* Conditional Affiliation Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {affiliation === 'Student' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Department & Batch / Roll # <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2023-CS / EE-104 or Mechanical"
                        value={studentBatch}
                        onChange={(e) => setStudentBatch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Profession / Occupation / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. School Teacher, Software Engineer, Banker, Merchant, etc."
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City / Area of Residence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Circular Road, Zafarwal Road, Narowal or Lahore"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Personal & Contact Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">3. Personal & Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Farooq"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Age (18–60) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        required
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp / Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Used for emergency patient matching alerts.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. donor.email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Primary Region / Campus Hub <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white font-medium"
                  >
                    {UET_CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 4: 3 Specific Screening & Privacy Questions */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 text-[#8F1D25] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Health History & Privacy Preferences</h3>
                </div>

                {/* QUESTION 1: Any diseases / medical conditions */}
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Question 1: Do you have any chronic medical conditions or infectious diseases? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    For transfusion recipient safety, please indicate whether you have any condition such as Hepatitis B/C, HIV, heart conditions, diabetes on insulin, or take chronic medications.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setHasDiseases(false);
                        setDiseaseDetails('');
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        !hasDiseases
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${!hasDiseases ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold block">No Diseases — Completely Healthy</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          No active infectious, cardiovascular, or blood-borne illnesses.
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasDiseases(true)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        hasDiseases
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${hasDiseases ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold block">Yes — I have a condition / take medication</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Our clinical team will evaluate your medical suitability.
                        </span>
                      </div>
                    </button>
                  </div>

                  {hasDiseases && (
                    <div className="mt-3 pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Please specify your condition or medication <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={hasDiseases}
                        placeholder="e.g. Mild hypertension, seasonal allergy, regular inhaler, past surgery, etc."
                        value={diseaseDetails}
                        onChange={(e) => setDiseaseDetails(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* QUESTION 2: Donated blood before or not */}
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Question 2: Have you donated blood before? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Helps us track donation intervals and provide proper volunteer guidance for first-time donors.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasDonatedBefore(true)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        hasDonatedBefore
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 shrink-0 mt-0.5 ${hasDonatedBefore ? 'text-[#B4232C] fill-current' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold block">Yes — I have donated before</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Experienced donor with prior whole blood or apheresis history.
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setHasDonatedBefore(false);
                        setLastDonationDate('');
                        setDonationCount(0);
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        !hasDonatedBefore
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${!hasDonatedBefore ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold block">No — This will be my first time</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Welcome! Dedicated volunteers will support you through every step.
                        </span>
                      </div>
                    </button>
                  </div>

                  {hasDonatedBefore && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Estimated Number of Previous Donations
                        </label>
                        <select
                          value={donationCount}
                          onChange={(e) => setDonationCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                        >
                          <option value={1}>1 donation</option>
                          <option value={2}>2 to 3 donations</option>
                          <option value={5}>4 to 6 donations</option>
                          <option value={10}>7 to 10 donations</option>
                          <option value={15}>10+ donations (Frequent Donor)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Date of Last Donation (If known)
                        </label>
                        <input
                          type="date"
                          value={lastDonationDate}
                          onChange={(e) => setLastDonationDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* QUESTION 3: Public Donor vs Private Donor */}
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Question 3: Do you want to be a Public Donor or Private Donor? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Decide whether your verified profile is listed on the public Donors page directory or kept confidential for emergency coordinator matching only.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Public Donor Option */}
                    <button
                      type="button"
                      onClick={() => setIsPublic(true)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isPublic
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                      id="donor-privacy-public-btn"
                    >
                      <Users className={`w-5 h-5 shrink-0 mt-0.5 ${isPublic ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">Public Donor</span>
                          <span className="text-[10px] bg-red-100 text-[#8F1D25] font-bold px-2 py-0.2 rounded-md">
                            Added to Donors Page
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Your profile (name, blood group, campus/area) <strong>will be added to the public Donors page</strong> so patients, attendants, and families in need can locate you directly.
                        </p>
                      </div>
                    </button>

                    {/* Private Donor Option */}
                    <button
                      type="button"
                      onClick={() => setIsPublic(false)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        !isPublic
                          ? 'border-[#B4232C] bg-white text-slate-900 ring-2 ring-[#B4232C]/30 shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                      id="donor-privacy-private-btn"
                    >
                      <Lock className={`w-5 h-5 shrink-0 mt-0.5 ${!isPublic ? 'text-[#B4232C]' : 'text-slate-400'}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">Private Donor</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.2 rounded-md">
                            Hidden from Public
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Your details remain strictly confidential and <strong>will NOT appear on the public Donors page</strong>. Only verified BDS emergency coordinators will contact you for urgent cases.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Emergency Availability Checkbox */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={emergencyAvailable}
                      onChange={(e) => setEmergencyAvailable(e.target.checked)}
                      className="mt-1 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Available for Urgent Hospital Calls (24/7)</span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Willing to receive high-urgency notifications during critical hospital trauma or emergency C-section cases.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 5: Consent & Agreements */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentContact}
                    onChange={(e) => setConsentContact(e.target.checked)}
                    className="mt-0.5 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4 cursor-pointer"
                  />
                  <span>
                    I confirm that the health and personal information provided is truthful, and I give permission to
                    BDS UET emergency coordinators to reach me when a patient needs blood.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4 cursor-pointer"
                  />
                  <span>
                    I accept the BDS UET Privacy Terms and understand that phone numbers are guarded securely and my listing preference ({isPublic ? 'Public Directory' : 'Private/Confidential'}) will be strictly enforced.
                  </span>
                </label>
              </div>

              {/* Submit Button (Color strictly red!) */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-base py-3.5 px-6 rounded-xl transition-all shadow-md shadow-red-900/10 active:scale-98 cursor-pointer"
                  id="submit-donor-registration-btn"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Complete Voluntary Donor Registration</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State with QR Pass */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Welcome to BDS UET Network!</h2>
              <p className="text-sm text-slate-600">
                Your voluntary donor registration has been recorded successfully.
                {registeredDonor.isPublic
                  ? ' Your profile is now active on the public Donors Page directory.'
                  : ' Your profile is registered as Private/Confidential and will only be contacted by coordinators.'}
              </p>
            </div>

            {/* Generated QR Pass */}
            <QRCodePass
              passType="Donor Card"
              title="Official Registered Blood Donor"
              code={registeredDonor.donorId || registeredDonor.id.toUpperCase()}
              name={registeredDonor.name}
              bloodGroup={registeredDonor.bloodGroup}
              venueOrHospital={registeredDonor.campus}
              dateTime={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              status={`VERIFIED ${registeredDonor.affiliation ? registeredDonor.affiliation.toUpperCase() : 'DONOR'} • ${registeredDonor.isPublic ? 'PUBLIC' : 'PRIVATE'}`}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('find-donor')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                id="donor-pass-go-dashboard-btn"
              >
                <span>View Donors Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRegisteredDonor(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs px-5 py-3 rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                <span>Register Another Donor</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

