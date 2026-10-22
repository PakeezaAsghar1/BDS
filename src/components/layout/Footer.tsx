import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, ArrowRight, Facebook, Instagram, Linkedin, ChevronDown } from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';

export const Footer: React.FC = () => {
  const { navigate } = useApp();
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <footer className="bg-[#171717] text-slate-300 pt-14 pb-10 border-t border-slate-800" id="main-site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-16 lg:gap-y-4 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-start-1 lg:row-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-white shadow-lg shadow-black/40 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={bdsLogoImg}
                  alt="Blood Donor Society UET Narowal Official Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-lg tracking-tight">BDS</h4>
                <p className="text-xs text-slate-400 font-medium">UET.Narowl • Blood Donor Society</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Connecting voluntary blood donors with patients across UET Narowal.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B4232C] shrink-0" />
                <span>Society Desk, Admin Block, UET Narowal Campus, Adda Siraj, Muridke-Narowal Road, Narowal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B4232C] shrink-0" />
                <span>desk.narowal@bdsuet.org | bds@narowal.uet.edu.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B4232C] shrink-0" />
                <span className="font-bold text-white">0300-8472910 (UET Narowal Emergency Helpline)</span>
              </div>

              {/* Social Media & Email Icons in Original Brand Colors */}
              <div className="pt-2 flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-md shadow-[#1877F2]/30"
                >
                  <Facebook className="w-4 h-4 fill-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-md shadow-[#dc2743]/30"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-md shadow-[#0A66C2]/30"
                >
                  <Linkedin className="w-4 h-4 fill-white" />
                </a>
                <a
                  href="mailto:desk.narowal@bdsuet.org"
                  aria-label="Email"
                  title="Email"
                  className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-md shadow-[#EA4335]/30"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links Accordion */}
          <div className="lg:col-start-2 lg:row-start-1 border-b border-stone-800/90 pb-3">
            <button
              type="button"
              onClick={() => setQuickLinksOpen(prev => !prev)}
              className="w-full flex items-center justify-between py-2 text-left group cursor-pointer focus:outline-none"
              aria-expanded={quickLinksOpen}
            >
              <span className="font-serif text-[19px] font-normal text-[#F5EBE1] tracking-wide group-hover:text-amber-200 transition-colors">
                Quick Links
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#c28e46] transition-transform duration-300 ${
                  quickLinksOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {quickLinksOpen && (
              <ul className="mt-3 mb-2 space-y-2.5 text-sm pl-0.5">
                <li>
                  <button
                    onClick={() => navigate('emergency-request')}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Emergency Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('find-donor')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Find a Blood Donor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('become-donor')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Register as a Donor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('track-request')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Track Request Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('campaigns')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Upcoming Blood Drives
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Col 3: Services Accordion */}
          <div className="lg:col-start-2 lg:row-start-2 border-b border-stone-800/90 pb-3">
            <button
              type="button"
              onClick={() => setServicesOpen(prev => !prev)}
              className="w-full flex items-center justify-between py-2 text-left group cursor-pointer focus:outline-none"
              aria-expanded={servicesOpen}
            >
              <span className="font-serif text-[19px] font-normal text-[#F5EBE1] tracking-wide group-hover:text-amber-200 transition-colors">
                Resources and Guide
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#c28e46] transition-transform duration-300 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {servicesOpen && (
              <ul className="mt-3 mb-2 space-y-2.5 text-sm pl-0.5">
                <li>
                  <button
                    onClick={() => navigate('guide')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Donation Health Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('stories')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Patient & Donor Stories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('gallery')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Our Gallery & Moments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('team')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer text-red-300 font-semibold"
                  >
                    Our Leadership & Team
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('volunteers')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Join Volunteer Team
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('faqs')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('about')}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    About BDS UET History
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Legal & Safety Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 BDS All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('privacy')} className="hover:text-slate-200 transition-colors cursor-pointer">
              Privacy
            </button>
            <button onClick={() => navigate('terms')} className="hover:text-slate-200 transition-colors cursor-pointer">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
