import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { ChevronDown, ArrowRight } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, navigate } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80" id="faqs-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <ScrollReveal direction="up" delayMs={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Clarifications & Guidance</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delayMs={120}>
            <p className="text-sm text-slate-600 mt-2">
              Clear answers about donor eligibility, emergency blood coordination, and society operations.
            </p>
          </ScrollReveal>
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

        {/* Still have questions - text link, not a card */}
        <div className="mt-10 text-center" id="faqs-contact-footer">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Still have questions?{' '}
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="text-[#B4232C] hover:text-[#8F1D25] font-bold underline underline-offset-4 hover:opacity-85 transition-all cursor-pointer inline-flex items-center gap-1"
              id="faq-contact-us-btn"
            >
              <span>Contact us</span>
              <ArrowRight className="w-4 h-4 inline-block" />
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
