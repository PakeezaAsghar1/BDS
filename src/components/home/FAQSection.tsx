import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, navigate } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-[#FAF9F7] border-b border-slate-200/80" id="faqs-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Clarifications & Guidance</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600 mt-2">
            Clear answers about donor eligibility, emergency blood coordination, and society operations.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
                id={`faq-item-${item.id}`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-red-100 text-[#B4232C]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 text-center sm:flex sm:items-center sm:justify-between gap-4">
          <div className="text-left mb-4 sm:mb-0">
            <h4 className="text-base font-bold text-slate-900">Still have questions or facing an emergency?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Our on-duty coordination team is available 24/7 for urgent hospital cases.</p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="inline-flex items-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Society Desk</span>
          </button>
        </div>
      </div>
    </section>
  );
};
