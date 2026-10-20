import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import bdsLogoImg from '../../assets/images/bds_logo.png';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-[#171717] text-slate-300 pt-14 pb-10 border-t border-slate-800" id="main-site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
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
              Established to foster student volunteerism and connect voluntary blood donors with patients across UET
              Narowal Campus and Narowal district healthcare centers with zero commercial interests.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
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
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Core Actions</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('emergency-request')}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Emergency Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('find-donor')}
                  className="hover:text-white transition-colors"
                >
                  Find a Blood Donor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('become-donor')}
                  className="hover:text-white transition-colors"
                >
                  Register as a Donor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('track-request')}
                  className="hover:text-white transition-colors"
                >
                  Track Request Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('campaigns')}
                  className="hover:text-white transition-colors"
                >
                  Upcoming Blood Drives
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Community */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Resources & Guides</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('guide')}
                  className="hover:text-white transition-colors"
                >
                  Donation Health Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('stories')}
                  className="hover:text-white transition-colors"
                >
                  Patient & Donor Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Gallery & Moments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('team')}
                  className="hover:text-white transition-colors cursor-pointer text-red-300 font-semibold"
                >
                  Our Leadership & Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('volunteers')}
                  className="hover:text-white transition-colors"
                >
                  Join Volunteer Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('faqs')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About BDS UET History
                </button>
              </li>
            </ul>
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
