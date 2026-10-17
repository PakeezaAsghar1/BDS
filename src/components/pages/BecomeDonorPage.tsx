import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UET_CAMPUSES } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
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
  Info
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BecomeDonorPage: React.FC = () => {
  const { addDonor, navigate } = useApp();

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(21);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState(UET_CAMPUSES[0]);
  const [area, setArea] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [studentBatch, setStudentBatch] = useState('2023-EE');
  const [userCategory, setUserCategory] = useState<'Student' | 'Faculty' | 'Alumni' | 'Community'>('Student');
  const [consentContact, setConsentContact] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);

  // Success state
  const [registeredDonor, setRegisteredDonor] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentContact || !consentPrivacy) {
      alert('Please accept the donor contact permission and privacy agreements to proceed.');
      return;
    }

    const donor = await addDonor({
      name,
      age,
      gender,
      phone,
      email,
      campus,
      area: area || 'Campus Hostel / Local Residence',
      bloodGroup,
      lastDonationDate: lastDonationDate || undefined,
      emergencyAvailable,
      studentBatch: userCategory === 'Student' ? studentBatch : undefined,
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
                <span>Join 2,500+ Verified Donors</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Become Someone's Reason to Hope.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Register as a voluntary blood donor in the BDS UET network. You will receive notifications only when
                someone matching your blood group needs urgent assistance in your area.
              </p>
            </div>

            {/* Medical Disclaimer Callout */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Important Medical Notice:</strong>
                Registration with BDS UET connects you with coordinators. Final donation eligibility (hemoglobin test,
                vitals, clinical history) will always be evaluated and confirmed by certified medical and blood-bank
                professionals at the time of donation.
              </div>
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
                      className={`py-3 px-2 rounded-xl text-center font-mono text-sm font-extrabold transition-all border ${
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

              {/* Section 2: Personal Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">2. Personal Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zain Ul Abideen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Age (18-60) <span className="text-red-500">*</span>
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
                      placeholder="e.g. 0312-9901842"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Protected — Never displayed publicly.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. zain.uet@student.edu.pk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Campus & University Association */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">3. University Campus & Location</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Campus / City <span className="text-red-500">*</span>
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hostel / Residential Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hostel 4, Zubair Hall or Mughalpura"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={userCategory}
                      onChange={(e) => setUserCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                    >
                      <option value="Student">UET Enrolled Student</option>
                      <option value="Faculty">UET Faculty / Staff Member</option>
                      <option value="Alumni">UET Alumni</option>
                      <option value="Community">Community Member</option>
                    </select>
                  </div>

                  {userCategory === 'Student' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Department & Batch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mechanical 2023 / CS 2022"
                        value={studentBatch}
                        onChange={(e) => setStudentBatch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Donation History & Availability */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">4. Donation History & Availability</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Last Donation Date (If any)
                    </label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Leave empty if first-time donor.</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={emergencyAvailable}
                        onChange={(e) => setEmergencyAvailable(e.target.checked)}
                        className="mt-1 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Available for Urgent Hospital Calls</span>
                        <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                          Willing to receive high-urgency notifications during critical hospital cases.
                        </span>
                      </div>
                    </label>
                  </div>
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
                    className="mt-0.5 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4"
                  />
                  <span>
                    I give permission to BDS UET emergency coordinators to contact me via phone or WhatsApp when a
                    compatible patient requires blood.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-[#B4232C] focus:ring-[#B4232C] w-4 h-4"
                  />
                  <span>
                    I accept the BDS UET Privacy Policy and understand that my personal contact details will not be
                    shared publicly.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-base py-3.5 px-6 rounded-xl transition-all shadow-md shadow-red-900/10 active:scale-98"
                  id="submit-donor-registration-btn"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Complete Donor Registration</span>
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
                Your voluntary donor registration is recorded in our central UET database.
              </p>
            </div>

            {/* Generated QR Pass */}
            <QRCodePass
              passType="Donor Card"
              title="Official Registered Blood Donor"
              code={registeredDonor.id.toUpperCase()}
              name={registeredDonor.name}
              bloodGroup={registeredDonor.bloodGroup}
              venueOrHospital={registeredDonor.campus}
              dateTime={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              status="VERIFIED BDS DONOR"
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('donor-dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs"
                id="donor-pass-go-dashboard-btn"
              >
                <span>Go to Donor Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRegisteredDonor(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs px-5 py-3 rounded-xl border border-slate-300 transition-colors"
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
