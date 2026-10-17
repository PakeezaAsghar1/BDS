import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { Modal } from '../common/Modal';
import { BloodGroup } from '../../types';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  PlusCircle,
  Heart,
  Sparkles,
} from 'lucide-react';

export const StoriesSection: React.FC = () => {
  const { stories, addStory, showToast, navigate } = useApp();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Add story modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [patientReference, setPatientReference] = useState('');
  const [hospital, setHospital] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [unitsProvided, setUnitsProvided] = useState<number>(2);
  const [category, setCategory] = useState<
    'Thalassemia Support' | 'Emergency Trauma' | 'Surgical Case' | 'Maternal Care'
  >('Emergency Trauma');
  const [storyText, setStoryText] = useState('');
  const [recipientQuote, setRecipientQuote] = useState('');

  const total = stories.length;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;

    addStory({
      title: title.trim(),
      patientReference: patientReference.trim() || 'Anonymous Patient',
      hospital: hospital.trim() || 'DHQ Hospital Narowal',
      bloodGroup,
      unitsProvided: Number(unitsProvided) || 1,
      category,
      story: storyText.trim(),
      recipientQuote: recipientQuote.trim() || undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });

    showToast('Story Submitted!', 'Thank you for sharing your experience with BDS UET Narowal.', 'success');
    setModalOpen(false);

    // Reset form
    setTitle('');
    setPatientReference('');
    setHospital('');
    setBloodGroup('B+');
    setUnitsProvided(2);
    setCategory('Emergency Trauma');
    setStoryText('');
    setRecipientQuote('');
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80" id="stories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Community Stories</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Real Lives Touched by BDS UET</h2>
            <p className="text-sm text-slate-600 mt-1">
              Every drop given by our student donors brings hope to families in critical moments.
            </p>
          </div>

          {/* Action Buttons: Add Story & Read All */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer"
              id="home-share-story-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Story</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('stories')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#B4232C] px-3.5 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <span>Read All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stories Cards Container */}
        <div
          className="relative min-h-[460px] xs:min-h-[430px] sm:min-h-[400px] md:min-h-0 md:grid md:grid-cols-3 md:gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {stories.map((story, index) => {
            const diff = (index - activeIndex + total) % total;

            // Mobile stacked presentation
            let mobilePositionClasses = '';
            if (diff === 0) {
              mobilePositionClasses =
                'absolute inset-0 z-20 opacity-100 scale-100 translate-x-0 translate-y-0 shadow-lg shadow-slate-900/5 pointer-events-auto bg-white';
            } else if (diff === 1) {
              mobilePositionClasses =
                'absolute inset-0 z-10 opacity-80 scale-[0.96] translate-x-3.5 translate-y-3.5 sm:translate-x-4 sm:translate-y-4 shadow-md shadow-slate-900/5 pointer-events-auto bg-[#FAF9F7]';
            } else {
              mobilePositionClasses =
                'absolute inset-0 z-0 opacity-40 scale-[0.92] translate-x-7 translate-y-7 sm:translate-x-8 sm:translate-y-8 shadow-xs pointer-events-none bg-slate-50';
            }

            return (
              <div
                key={story.id}
                id={`story-card-${story.id}`}
                onClick={() => {
                  if (diff !== 0) setActiveIndex(index);
                }}
                className={`rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-red-200 hover:shadow-md flex flex-col justify-between transition-all duration-300 ease-out ${mobilePositionClasses} md:static md:inset-auto md:z-auto md:opacity-100 md:scale-100 md:translate-x-0 md:translate-y-0 md:shadow-xs md:pointer-events-auto md:bg-[#FAF9F7]`}
              >
                <div>
                  {/* Category Badge & Blood Group */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#8F1D25] border border-red-100">
                      {story.category}
                    </span>
                    <BloodGroupBadge group={story.bloodGroup} size="sm" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1.5 hover:text-[#B4232C] transition-colors">
                    {story.title}
                  </h3>

                  {/* Patient & Hospital Details */}
                  <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5 flex-wrap">
                    <span>{story.patientReference}</span>
                    <span>•</span>
                    <span className="text-slate-600 font-semibold">{story.hospital}</span>
                  </p>

                  {/* Story summary */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {story.story}
                  </p>

                  {/* Quote Box */}
                  {story.recipientQuote && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200/70 text-xs text-slate-700 italic flex items-start gap-2.5 shadow-2xs">
                      <Quote className="w-4 h-4 text-[#B4232C] shrink-0 opacity-70 mt-0.5" />
                      <span className="leading-relaxed">&ldquo;{story.recipientQuote}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* Footer with Units Coordinated and Date (Clean original design) */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#B4232C]" />
                    <span>{story.unitsProvided} Units Coordinated</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{story.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controls: Behind (<), Dots, and Next (>) */}
        <div className="flex md:hidden items-center justify-between gap-3 mt-6 pt-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous story"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-[#B4232C] hover:border-red-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Behind</span>
          </button>

          <div className="flex items-center gap-1.5">
            {stories.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Story ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-[#B4232C]' : 'w-2 bg-slate-200 hover:bg-red-200'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next story"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-[#B4232C] hover:border-red-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Option Banner to Add / Share Story */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-[#FAF9F7] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#B4232C] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-[#B4232C]/20" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Have a personal story with BDS UET Narowal?</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Whether you donated blood or your family received support, your words inspire others to donate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your Story</span>
          </button>
        </div>
      </div>

      {/* Share Story Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Share Your BDS UET Story"
        subtitle="Inspire fellow students and community members across UET Narowal."
      >
        <form onSubmit={handleStorySubmit} className="space-y-4 text-xs" id="home-submit-story-form">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Story Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Life-Saving Support for Rayan in Narowal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Patient Alias / Reference *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zainab (Emergency C-Section)"
                value={patientReference}
                onChange={(e) => setPatientReference(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Hospital in Narowal *</label>
              <input
                type="text"
                required
                placeholder="e.g. DHQ Hospital Narowal"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white font-mono font-bold focus:outline-none"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Units Coordinated</label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsProvided}
                onChange={(e) => setUnitsProvided(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white focus:outline-none"
              >
                <option value="Emergency Trauma">Emergency Trauma</option>
                <option value="Thalassemia Support">Thalassemia Support</option>
                <option value="Maternal Care">Maternal Care</option>
                <option value="Surgical Case">Surgical Case</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Your Story *</label>
            <textarea
              required
              rows={3}
              placeholder="Tell what happened, how BDS UET Narowal coordinated, and the impact..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Key Quote (Optional)</label>
            <input
              type="text"
              placeholder='e.g. "The BDS student arrived like a blessing in the middle of the night."'
              value={recipientQuote}
              onChange={(e) => setRecipientQuote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none italic"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              Submit Story
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
