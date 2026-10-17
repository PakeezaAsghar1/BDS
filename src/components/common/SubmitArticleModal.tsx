import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Tag,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SubmitArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IMAGE_PRESETS = [
  {
    label: 'Medical Science / Lab',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Donor Care / Phlebotomy',
    url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Hospital & Emergency Care',
    url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Nutrition & Iron Foods',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Childhood & Thalassemia Care',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  },
];

const CATEGORIES = [
  'Health & Safety',
  'Eligibility',
  'Medical Science',
  'Myths & Facts',
  'Thalassemia Care',
  'Emergency Guide',
];

export const SubmitArticleModal: React.FC<SubmitArticleModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitArticle } = useApp();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Author & Verification details
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');
  const [authorPhone, setAuthorPhone] = useState(currentUser?.phone || '');
  const [authorRole, setAuthorRole] = useState('Medical Student / Doctor');
  const [authorAffiliation, setAuthorAffiliation] = useState(
    currentUser?.campus || 'UET Blood Donor Society'
  );
  const [authorCnicOrRoll, setAuthorCnicOrRoll] = useState('');
  const [authorVerificationNotes, setAuthorVerificationNotes] = useState('');

  // Article details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health & Safety');
  const [readTime, setReadTime] = useState('4 min read');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('Importance, Health Awareness, Blood Donation');
  const [featuredImage, setFeaturedImage] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [content, setContent] = useState('');

  // Form error tracking
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!authorName.trim() || !authorEmail.trim() || !authorPhone.trim()) {
      setError('Please provide your full name, email, and phone number for identity verification.');
      return;
    }

    if (!title.trim() || title.trim().length < 10) {
      setError('Please provide a descriptive article title (at least 10 characters).');
      return;
    }

    if (!summary.trim() || summary.trim().length < 25) {
      setError('Please provide a meaningful summary or abstract of your guide (at least 25 characters).');
      return;
    }

    if (!content.trim() || content.trim().length < 80) {
      setError('Please write or paste the full content of your guide (at least 80 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const finalImage = customImageUrl.trim() ? customImageUrl.trim() : featuredImage;

      await submitArticle({
        title: title.trim(),
        category,
        readTime,
        summary: summary.trim(),
        content: content.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['Community Guide', 'Blood Donation'],
        featuredImage: finalImage,
        author: authorName.trim(),
        authorRole: authorRole.trim(),
        authorEmail: authorEmail.trim(),
        authorPhone: authorPhone.trim(),
        authorAffiliation: authorAffiliation.trim(),
        authorVerificationNotes: authorVerificationNotes.trim(),
        authorCnicOrRoll: authorCnicOrRoll.trim(),
      });

      setIsSubmitting(false);
      setStep('success');
    } catch {
      setIsSubmitting(false);
      setError('Failed to submit article. Please verify your fields and try again.');
    }
  };

  const handleResetAndClose = () => {
    setStep('form');
    setTitle('');
    setSummary('');
    setContent('');
    setAuthorVerificationNotes('');
    setAuthorCnicOrRoll('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-900 to-[#B4232C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Contribute an Educational Guide
              </h3>
              <p className="text-xs text-red-100">
                Peer-reviewed submission for BDS UET Health & Donation Library
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {step === 'success' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Guide Submitted for Verification!
              </h4>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Thank you for contributing to clinical literacy and blood donor safety. Your submission{' '}
                <strong>&ldquo;{title}&rdquo;</strong> is now in the verification queue.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Workflow:</span>
                </div>
                <p className="text-slate-600">
                  1. BDS UET Medical Coordinators verify your author identity and credentials.
                </p>
                <p className="text-slate-600">
                  2. The article is peer-reviewed for medical accuracy and alignment with WHO/Pakistan Blood Transfusion Authority standards.
                </p>
                <p className="text-slate-600">
                  3. Once approved, it is published immediately to the public Donation Guide.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleResetAndClose}
                  className="bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Return to Donation Guides
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Clinical Verification Notice */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Contributor Identity Verification Process</span>
                  <p className="text-amber-800 leading-relaxed">
                    To maintain clinical accuracy and prevent misinformation, all submitted guides undergo author
                    verification and content approval by BDS UET Medical Officers before publication.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* SECTION 1: Author Credentials & Verification */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <UserCheck className="w-4 h-4 text-[#B4232C]" />
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Step 1: Contributor Credentials & Contact
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ayesha Munir or Ali Hassan"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contributor Role / Profession <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                    >
                      <option value="Medical Student / Doctor">Medical Student / Doctor</option>
                      <option value="Consultant Hematologist">Consultant Hematologist</option>
                      <option value="Postgraduate Resident">Postgraduate Resident</option>
                      <option value="BDS UET Volunteer / Student">BDS UET Volunteer / Student</option>
                      <option value="Healthcare Worker / Phlebotomist">Healthcare Worker / Phlebotomist</option>
                      <option value="Clinical Dietitian / Nutritionist">Clinical Dietitian / Nutritionist</option>
                      <option value="Patient Family Advocate">Patient Family Advocate</option>
                      <option value="Community Health Educator">Community Health Educator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (for approval notification) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={authorPhone}
                      onChange={(e) => setAuthorPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Affiliation / Institution / Campus
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHQ Hospital Narowal or UET Narowal"
                      value={authorAffiliation}
                      onChange={(e) => setAuthorAffiliation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Verification Reference (Roll No / PMDC / ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roll 2022-MC-14 or PMDC #12345-P"
                      value={authorCnicOrRoll}
                      onChange={(e) => setAuthorCnicOrRoll(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Notes & Credentials Bio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly state your medical training or personal background relevant to this article for our review board..."
                    value={authorVerificationNotes}
                    onChange={(e) => setAuthorVerificationNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* SECTION 2: Article Information */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-[#B4232C]" />
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Step 2: Guide Details & Clinical Content
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guide Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Why is Blood Donation Important for Children with Thalassemia?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 min read"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Topics / Tags</label>
                    <input
                      type="text"
                      placeholder="e.g. Thalassemia, Safety, Platelets"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Summary / Key Takeaway (2–3 sentences) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide a clear, patient-friendly summary that will appear on the guide preview card..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none resize-none"
                  />
                </div>

                {/* Featured Image Preset Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Choose Cover Image Preset or Custom URL</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                    {IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setFeaturedImage(preset.url);
                          setCustomImageUrl('');
                        }}
                        className={`p-1.5 rounded-xl border text-left text-[11px] font-medium transition-all ${
                          featuredImage === preset.url && !customImageUrl
                            ? 'border-[#B4232C] bg-red-50/70 text-[#8F1D25] ring-2 ring-[#B4232C]/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <div className="h-10 rounded-lg overflow-hidden mb-1 bg-slate-100">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="truncate block font-semibold">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste custom image URL (e.g. https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                {/* Article Full Content Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Article Content <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Supports Markdown (### for headers, - for bullets)
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    required
                    placeholder="### 1. Introduction & Clinical Significance&#10;Explain why this topic matters to donors and patients...&#10;&#10;### 2. Evidence-Based Health Recommendations&#10;- Point 1: Hydrate prior to arrival&#10;- Point 2: Iron rich nutrition...&#10;&#10;### 3. Conclusion & Call to Action"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B4232C] hover:bg-[#8F1D25] disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting for Verification...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Guide for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
