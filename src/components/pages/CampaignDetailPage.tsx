import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { QRCodePass } from '../common/QRCodePass';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Building
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const CampaignDetailPage: React.FC = () => {
  const { campaigns, selectedCampaignSlug, registerForCampaign, navigate } = useApp();

  const campaign = campaigns.find((c) => c.slug === selectedCampaignSlug) || campaigns[0];

  // Registration Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [timeSlot, setTimeSlot] = useState(campaign?.timeSlots?.[0] || '10:00 AM - 12:00 PM');
  const [userCategory, setUserCategory] = useState<'UET Student' | 'UET Faculty / Staff' | 'UET Alumni' | 'Community Member'>('UET Student');
  const [department, setDepartment] = useState('Electrical Engineering');
  const [batch, setBatch] = useState('2023');

  // Success QR pass
  const [registrationPass, setRegistrationPass] = useState<any | null>(null);

  if (!campaign) {
    return (
      <div className="py-16 text-center">
        <p>Campaign not found.</p>
        <button onClick={() => navigate('campaigns')} className="mt-4 text-[#B4232C] font-bold">
          ← Back to all campaigns
        </button>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const reg = await registerForCampaign({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      userName,
      userEmail,
      userPhone,
      bloodGroup,
      timeSlot,
      userCategory,
      department: userCategory === 'UET Student' ? department : undefined,
      batch: userCategory === 'UET Student' ? batch : undefined,
    });

    setRegistrationPass(reg);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F7] min-h-screen" id="campaign-detail-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <button
          onClick={() => navigate('campaigns')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all donation drives</span>
        </button>

        {!registrationPass ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Campaign Information */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={campaign.featuredImage}
                    alt={campaign.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#B4232C]" />
                    <span>{new Date(campaign.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                    {campaign.campus}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {campaign.title}
                  </h1>
                  <p className="text-sm font-semibold text-slate-500">{campaign.subtitle}</p>

                  <p className="text-sm text-slate-600 leading-relaxed">{campaign.description}</p>

                  {/* Key metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#B4232C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 font-bold">Venue</strong>
                        <span className="text-slate-600">{campaign.venue}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#B4232C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 font-bold">Timing</strong>
                        <span className="text-slate-600">
                          {campaign.startTime} – {campaign.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100 text-xs text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Organized By:</strong>
                    {campaign.organizer}
                  </div>
                </div>
              </div>

              {/* Eligibility Checklist Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>On-Site Health & Eligibility Checklist</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {campaign.eligibilityNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs accordion */}
              {campaign.faqs && campaign.faqs.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#B4232C]" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {campaign.faqs.map((f, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                        <h4 className="font-bold text-slate-900">{f.question}</h4>
                        <p className="text-slate-600 leading-relaxed">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Interactive Slot Booking Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md sticky top-24 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Registration Open
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">Reserve Your Donation Slot</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Book ahead to receive an instant check-in pass and skip the waiting queue on campus.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4" id="campaign-slot-form">
                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Your Blood Group <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {BLOOD_GROUPS.map((bg) => (
                        <button
                          type="button"
                          key={bg}
                          onClick={() => setBloodGroup(bg)}
                          className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                            bloodGroup === bg
                              ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#B4232C] bg-white"
                    >
                      {campaign.timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zain Ul Abideen"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp / Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0312-9901842"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@student.uet.edu.pk"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Affiliation
                    </label>
                    <select
                      value={userCategory}
                      onChange={(e) => setUserCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white"
                    >
                      <option value="UET Student">UET Student</option>
                      <option value="UET Faculty / Staff">UET Faculty / Staff</option>
                      <option value="UET Alumni">UET Alumni</option>
                      <option value="Community Member">Community Member</option>
                    </select>
                  </div>

                  {userCategory === 'UET Student' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Batch
                        </label>
                        <input
                          type="text"
                          value={batch}
                          onChange={(e) => setBatch(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-xs active:scale-98 mt-2"
                    id="submit-camp-registration-btn"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Registration & Get Pass</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Refreshments, blood certificate, and grouping card provided free of charge.
                  </p>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation with QR Pass */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Slot Confirmed!</h2>
              <p className="text-sm text-slate-600">
                Show this QR pass at the BDS UET reception desk during your slot.
              </p>
            </div>

            <QRCodePass
              passType="Campaign Registration"
              title={registrationPass.campaignTitle}
              code={registrationPass.registrationCode}
              name={registrationPass.userName}
              bloodGroup={registrationPass.bloodGroup}
              venueOrHospital={campaign.venue}
              dateTime={campaign.date}
              timeSlot={registrationPass.timeSlot}
              status="CONFIRMED SLOT"
            />

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setRegistrationPass(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
