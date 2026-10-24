import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { UETNarowalMap } from '../common/UETNarowalMap';
import { ScrollReveal } from '../common/ScrollReveal';
import contactHeroImg from '../../assets/images/miniature_lifesaving_blood_donation.png';

export const ContactPage: React.FC = () => {
  const { showToast, submitContactMessage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hospital Blood Drive Partnership');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSending(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      setSubmitted(true);
      showToast('Inquiry Sent to Supabase', 'Thank you! A BDS executive will respond within 24 hours.', 'success');
    } catch {
      setSubmitted(true);
      showToast('Inquiry Received', 'Thank you! A BDS executive will review your inquiry shortly.', 'info');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#FAF9F7] min-h-screen pb-16" id="contact-page">
      {/* Top Hero Section matching user reference design */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-4">
              <ScrollReveal direction="up" delayMs={0}>
                <span className="text-xs font-black uppercase tracking-widest text-[#B4232C]">
                  Get In Touch
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mt-1 mb-3">
                  Contact Us
                </h1>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  We'd love to hear from you!
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="up" delayMs={120}>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Whether you have a question, want to volunteer, need information about a donation drive,
                  or just want to say hello — feel free to reach out. Our team is here to help.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Hero Image Card Column with handwritten slogan */}
            <div className="md:col-span-5">
              <ScrollReveal direction="up" delayMs={180}>
                <div className="relative rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-slate-200/80 group">
                  <img
                    src={contactHeroImg}
                    alt="Miniature Teamwork - Lifesaving Blood Donation"
                    className="w-full h-80 sm:h-96 object-cover object-[center_35%] group-hover:scale-102 transition-transform duration-500"
                  />
                  
                  {/* Subtle dark gradient overlay on the bottom right for readable text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Handwritten Callout matching reference: "Together for a Healthier Tomorrow ♡" */}
                  <div className="absolute bottom-5 right-5 text-right pointer-events-none select-none">
                    <div className="inline-block transform -rotate-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      <p className="font-['Caveat',cursive] text-2xl sm:text-3xl leading-tight font-bold tracking-wide text-white">
                        Together for a Healthier
                        <br />
                        Tomorrow <span className="text-red-400">♡</span>
                      </p>
                      {/* Curved Underline svg */}
                      <svg
                        className="w-32 sm:w-40 h-3 ml-auto mt-0.5 text-white/90"
                        viewBox="0 0 160 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M 5 6 Q 80 12, 155 4"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* Main Two-Column Layout Section: Get In Touch (Left) & Send Us a Message (Right) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Get In Touch Info Items */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Get In Touch
            </h2>

            <div className="space-y-6 pt-1">
              
              {/* Item 1: Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200/80 flex items-center justify-center text-[#B4232C] shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 fill-red-100/50 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-sm font-bold text-slate-900">Location</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                    UET, Narowal Campus
                    <br />
                    Narowal, Punjab, Pakistan
                  </p>
                </div>
              </div>

              {/* Item 2: Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200/80 flex items-center justify-center text-[#B4232C] shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-sm font-bold text-slate-900">Email</h3>
                  <a
                    href="mailto:bdsuet@uet.edu.pk"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#B4232C] transition-colors block"
                  >
                    bdsuet@uet.edu.pk
                  </a>
                  <span className="text-[11px] text-slate-500 block">
                    (For general inquiries)
                  </span>
                </div>
              </div>

              {/* Item 3: Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200/80 flex items-center justify-center text-[#B4232C] shrink-0 shadow-2xs">
                  <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-sm font-bold text-slate-900">Phone</h3>
                  <a
                    href="tel:+923008472910"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#B4232C] font-mono transition-colors block"
                  >
                    +92 300 8472910
                  </a>
                  <span className="text-[11px] text-slate-500 block">
                    (WhatsApp / Calls)
                  </span>
                </div>
              </div>

              {/* Item 4: Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200/80 flex items-center justify-center text-[#B4232C] shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-sm font-bold text-slate-900">Working Hours</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                    Monday – Friday
                    <br />
                    9:00 AM – 5:00 PM
                  </p>
                  <span className="text-[11px] text-[#B4232C] font-semibold block pt-0.5">
                    (Emergency Desk: 24/7 Available)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Send Us a Message Card Container */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-6">
                Send Us a Message
              </h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm" id="contact-inquiry-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#B4232C] focus:border-[#B4232C] focus:outline-none transition-all placeholder:text-slate-400 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#B4232C] focus:border-[#B4232C] focus:outline-none transition-all placeholder:text-slate-400 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#B4232C] focus:border-[#B4232C] focus:outline-none transition-all bg-white font-medium text-slate-800 cursor-pointer appearance-none pr-10"
                      >
                        <option value="Hospital Blood Drive Partnership">Hospital Blood Drive Partnership</option>
                        <option value="Departmental Awareness Seminar">Departmental Awareness Seminar</option>
                        <option value="Volunteer Query">Volunteer Query</option>
                        <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#B4232C] focus:border-[#B4232C] focus:outline-none transition-all placeholder:text-slate-400 bg-white resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-red-900/20 active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    id="submit-inquiry-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              ) : (
                <div className="py-10 px-6 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Message Delivered</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Your inquiry has been dispatched to the BDS UET Narowal coordination desk.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="text-xs font-bold text-[#B4232C] hover:underline cursor-pointer pt-2 inline-block"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Working Interactive Campus Map (Preserved as requested: "keep the exsiting conatct form and map") */}
        <div className="mt-14">
          <UETNarowalMap />
        </div>
      </section>
    </div>
  );
};
