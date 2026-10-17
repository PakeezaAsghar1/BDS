import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { Heart, Quote, Sparkles, MessageCircle, Calendar, PlusCircle, CheckCircle2, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { BloodGroup } from '../../types';

export const StoriesPage: React.FC = () => {
  const { stories, addStory, navigate } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // Submission Form State
  const [title, setTitle] = useState('');
  const [patientReference, setPatientReference] = useState('');
  const [hospital, setHospital] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [unitsProvided, setUnitsProvided] = useState<number>(2);
  const [category, setCategory] = useState<'Thalassemia' | 'Emergency Surgery' | 'Accident & Trauma' | 'Maternal Care' | 'Cancer Care'>('Emergency Surgery');
  const [storyText, setStoryText] = useState('');
  const [recipientQuote, setRecipientQuote] = useState('');
  const [donorName, setDonorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStory({
      title,
      patientReference,
      hospital,
      bloodGroup,
      unitsProvided: Number(unitsProvided),
      category,
      story: storyText,
      recipientQuote: recipientQuote || undefined,
      donorName: donorName || undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });

    setModalOpen(false);
    setTitle('');
    setStoryText('');
    setRecipientQuote('');
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="stories-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Human Impact</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Stories of Hope & Courage
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Every unit donated at UET touches real lives — from young thalassemia warriors to emergency trauma
              survivors and mothers. Read their heartfelt words.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs shrink-0 active:scale-98"
            id="share-story-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your BDS Story</span>
          </button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              id={`story-card-${story.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#8F1D25] border border-red-100">
                    {story.category}
                  </span>
                  <BloodGroupBadge group={story.bloodGroup} size="sm" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#B4232C] transition-colors mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {story.patientReference} • {story.hospital}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{story.story}</p>

                {story.recipientQuote && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-red-50/50 border border-red-100 text-xs text-slate-800 italic flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-[#B4232C] shrink-0 opacity-70 mt-0.5" />
                    <span>"{story.recipientQuote}"</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{story.unitsProvided} Units Arranged</span>
                <span className="font-mono text-[11px]">{story.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal to submit story */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Share a Patient or Donor Story"
          subtitle="Inspire thousands of fellow UETians with your experience."
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="submit-story-form">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Story Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Life-Saving Support for 6-Year-Old Areeba"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Patient Alias / Ref *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baby Areeba (Thalassemia Patient)"
                  value={patientReference}
                  onChange={(e) => setPatientReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hospital *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Children's Hospital Lahore"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white font-mono font-bold"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white"
                >
                  <option value="Emergency Surgery">Emergency Surgery</option>
                  <option value="Thalassemia">Thalassemia</option>
                  <option value="Accident & Trauma">Accident & Trauma</option>
                  <option value="Maternal Care">Maternal Care</option>
                  <option value="Cancer Care">Cancer Care</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">The Story *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe how BDS UET donors stepped in..."
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Recipient / Family Quote (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. We will never forget the UET student who traveled in the rain to save our son."
                value={recipientQuote}
                onChange={(e) => setRecipientQuote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold px-5 py-2 rounded-xl shadow-xs"
              >
                Publish Story
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
