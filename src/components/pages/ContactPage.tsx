import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Building,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UETNarowalMap } from '../common/UETNarowalMap';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hospital Blood Drive Partnership');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry Sent', 'Thank you! A BDS executive will respond within 24 hours.', 'success');
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="contact-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Emergency Assistance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact BDS UET Narowal Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Need urgent blood coordination, want to organize a donation camp at your department, or have general
            questions? Reach our dedicated UET Narowal team.
          </p>
        </div>

        {/* Emergency Callout Card */}
        <div className="bg-gradient-to-r from-red-900 via-[#B4232C] to-[#8F1D25] rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-red-200">
              Immediate Emergency Helpline (24/7)
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono font-extrabold text-white tracking-wider">
              +92 300 8472910
            </h2>
            <p className="text-xs sm:text-sm text-red-100">
              Direct line to on-duty BDS UET Narowal student coordinator on campus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="tel:+923008472910"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#8F1D25] hover:bg-red-50 font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline Now</span>
            </a>
            <a
              href="https://wa.me/923008472910"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* Interactive Working Map: UET Narowal */}
        <UETNarowalMap />

        {/* Contact Info & Inquiries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Campus Desks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">UET Narowal Society Desks</h3>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">Narowal Campus</span>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                {/* UET Narowal Central Desk */}
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200/80 space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <MapPin className="w-4 h-4 text-[#B4232C]" />
                      <span>Main Society Office (Admin Block)</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B4232C] text-white px-2 py-0.5 rounded-full">
                      Central HQ
                    </span>
                  </div>
                  <p className="text-slate-700">Society Desk & Student Wing, Ground Floor, Admin Block, Adda Siraj, Muridke-Narowal Road, Narowal</p>
                  <div className="pt-2 text-[#8F1D25] font-mono font-medium">desk.narowal@bdsuet.org</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Building className="w-4 h-4 text-[#B4232C]" />
                    <span>Student Activity & Emergency Dispatch Desk</span>
                  </div>
                  <p>Room 12, Student Center & Cafeteria Complex, UET Narowal Campus</p>
                  <div className="pt-2 text-slate-500 font-mono">emergency.narowal@bdsuet.org</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Building className="w-4 h-4 text-[#B4232C]" />
                    <span>CS & Electrical Engineering Liaison</span>
                  </div>
                  <p>Department Coordinator Office, Academic Block A, UET Narowal</p>
                  <div className="pt-2 text-slate-500 font-mono">coord.engg@narowal.uet.edu.pk</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Building className="w-4 h-4 text-[#B4232C]" />
                    <span>Hostels & Residential Wing</span>
                  </div>
                  <p>Iqbal Hall & Girls Hostel Volunteer Liaison Desks, UET Narowal</p>
                  <div className="pt-2 text-slate-500 font-mono">hostel.bds@narowal.uet.edu.pk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry or Feedback</h3>
                <p className="text-xs text-slate-500 mt-1">
                  For blood drive collaborations, society inquiries, or partnership proposals.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="contact-inquiry-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Hammad Malik"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Subject / Topic <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white font-semibold"
                    >
                      <option value="Hospital Blood Drive Partnership">Hospital Blood Drive Partnership</option>
                      <option value="Departmental Awareness Seminar">Departmental Awareness Seminar</option>
                      <option value="Volunteer Query">Volunteer Query</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your detailed inquiry or collaboration request here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs"
                    id="submit-inquiry-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to BDS Team</span>
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Message Delivered</h4>
                  <p className="text-xs text-slate-500">
                    Thank you for reaching out. Our society executive will get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#B4232C] hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
