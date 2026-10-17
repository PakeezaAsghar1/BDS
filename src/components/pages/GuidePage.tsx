import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Article } from '../../types';
import { CompatibilityMatrix } from '../common/CompatibilityMatrix';
import { SubmitArticleModal } from '../common/SubmitArticleModal';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Heart,
  Droplet,
  Search,
  PenTool,
  ShieldAlert,
  Calendar,
  UserCheck,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const GuidePage: React.FC = () => {
  const { articles, navigate, currentRole } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewTab, setViewTab] = useState<'approved' | 'pending'>('approved');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const categories = [
    'all',
    'Health & Safety',
    'Eligibility',
    'Medical Science',
    'Myths & Facts',
    'Thalassemia Care',
    'Emergency Guide',
  ];

  // Distinguish approved vs pending
  const approvedArticles = useMemo(() => {
    return articles.filter((a) => !a.approvalStatus || a.approvalStatus === 'approved');
  }, [articles]);

  const pendingArticles = useMemo(() => {
    return articles.filter((a) => a.approvalStatus === 'pending');
  }, [articles]);

  // Featured Article: "Why is Blood Donation Important?"
  const featuredArticle = useMemo(() => {
    return (
      articles.find((a) => a.slug === 'why-is-blood-donation-important-lifesaving-impact') ||
      approvedArticles[0]
    );
  }, [articles, approvedArticles]);

  const displayedArticles = useMemo(() => {
    const sourceList = viewTab === 'pending' ? pendingArticles : approvedArticles;

    return sourceList.filter((a) => {
      // Category filter
      if (selectedCategory !== 'all' && a.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = a.title.toLowerCase().includes(q);
        const inSummary = a.summary.toLowerCase().includes(q);
        const inAuthor = a.author.toLowerCase().includes(q);
        const inTags = a.tags ? a.tags.some((t) => t.toLowerCase().includes(q)) : false;
        if (!inTitle && !inSummary && !inAuthor && !inTags) return false;
      }

      return true;
    });
  }, [approvedArticles, pendingArticles, viewTab, selectedCategory, searchQuery]);

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="guide-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Header & Contributor Call-to-Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence-Based Health Literacy & Clinical Guidance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Blood Donation & Clinical Guide
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Explore medical insights on transfusion science, preparation guidelines, universal donor safety,
              and pediatric care for Thalassemia patients across Pakistan.
            </p>
          </div>

          {/* Action to Submit Article / Contributor Program */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm hover:shadow transition-all group"
              id="submit-guide-btn"
            >
              <PenTool className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Contribute a Guide / Article</span>
            </button>
          </div>
        </div>

        {/* Featured Guide Spotlight: "Why is Blood Donation Important?" */}
        {featuredArticle && viewTab === 'approved' && (
          <div className="bg-gradient-to-br from-white to-red-50/40 rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
              <div className="w-full lg:w-5/12 h-64 sm:h-80 rounded-2xl overflow-hidden relative shadow-md">
                <img
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#B4232C] text-white text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Essential Foundation</span>
                </div>
              </div>

              <div className="w-full lg:w-7/12 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-[#8F1D25] bg-red-100/80 px-2.5 py-0.5 rounded-lg">
                    {featuredArticle.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredArticle.readTime}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{featuredArticle.author}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>

                {/* Key takeaways callout chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-white/90 border border-red-100 rounded-xl p-2.5 text-xs">
                    <span className="font-extrabold text-[#B4232C] block">1 Bag = 3 Lives</span>
                    <span className="text-slate-500 text-[11px]">RBCs, Platelets, Plasma separated</span>
                  </div>
                  <div className="bg-white/90 border border-red-100 rounded-xl p-2.5 text-xs">
                    <span className="font-extrabold text-[#B4232C] block">100k+ Thalassemia</span>
                    <span className="text-slate-500 text-[11px]">Children require bi-weekly transfusions</span>
                  </div>
                  <div className="bg-white/90 border border-red-100 rounded-xl p-2.5 text-xs">
                    <span className="font-extrabold text-[#B4232C] block">Donor Health Bonus</span>
                    <span className="text-slate-500 text-[11px]">Cell renewal & vascular benefits</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('article-detail', { articleSlug: featuredArticle.slug })}
                    className="inline-flex items-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs group"
                  >
                    <span>Read Complete Medical Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Pre & Post Donation Care Tips Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Pre-Donation Checklist</h3>
                <p className="text-xs text-slate-500">What to do 24 hours before donating</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Drink at least 500ml extra water/juice to maintain blood volume.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Eat a healthy, iron-rich meal (avoid high-fat greasy fast food).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Ensure a minimum of 6 to 8 hours of restful sleep.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Bring your official CNIC or UET Student ID card.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B4232C] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Post-Donation Recovery</h3>
                <p className="text-xs text-slate-500">Immediately following your donation</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#B4232C] font-bold">•</span>
                <span>Rest in the refreshment area for 10-15 minutes and enjoy juice & snacks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B4232C] font-bold">•</span>
                <span>Keep the adhesive bandage on your arm for at least 4-5 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B4232C] font-bold">•</span>
                <span>Avoid heavy weight lifting or strenuous gym workouts for 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B4232C] font-bold">•</span>
                <span>Continue drinking plenty of fluids throughout the day.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Library & Search / Filter Controls */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Educational Library</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Verified clinical articles, donor guidelines, and peer-reviewed educational submissions.
              </p>
            </div>

            {/* View Mode Toggle: Published vs Pending Review Queue */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl self-start md:self-auto">
              <button
                onClick={() => setViewTab('approved')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewTab === 'approved'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Published Guides ({approvedArticles.length})
              </button>
              <button
                onClick={() => setViewTab('pending')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewTab === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Pending Verification</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                  {pendingArticles.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search bar and categories */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, importance, author, or keyword (e.g., Why is blood donation important, Thalassemia)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 font-semibold"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#B4232C] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'All Topics' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pending Verification Notice banner if in pending view */}
          {viewTab === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Articles Pending Verification</strong>
                <span>
                  These articles have been submitted by community members, doctors, and students. They undergo
                  credential verification and medical check by BDS UET Medical Officers before being approved.
                </span>
                {currentRole === 'admin' && (
                  <button
                    onClick={() => navigate('admin')}
                    className="mt-2 block font-bold text-[#B4232C] hover:underline"
                  >
                    Open Admin Console to approve or review submissions →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {displayedArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Guides Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No articles match your selected topic &ldquo;{selectedCategory}&rdquo; and search query. Try another keyword
                or be the first to contribute a guide!
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#B4232C] hover:underline"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Submit an Article Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  id={`article-card-${article.id}`}
                >
                  <div>
                    <div className="h-44 overflow-hidden bg-slate-100 relative">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs">
                        {article.category}
                      </div>

                      {article.approvalStatus === 'pending' ? (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Review</span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-xs text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 flex-wrap">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{article.author}</span>
                      </div>

                      {article.authorRole && (
                        <div className="text-[11px] text-slate-500 mb-2 truncate font-medium">
                          {article.authorRole} {article.authorAffiliation ? `• ${article.authorAffiliation}` : ''}
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#B4232C] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => navigate('article-detail', { articleSlug: article.slug })}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-red-50 text-[#B4232C] font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-200 hover:border-red-200"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Contributor Callout Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>BDS UET Medical Authorship Program</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Want to share health insights or clinical research?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Medical students, certified doctors, dietitians, and student leaders can publish educational articles
              on our platform. All submissions are verified for clinical accuracy before going live.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-white text-[#8F1D25] hover:bg-red-50 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            <span>Submit Your Article</span>
          </button>
        </div>

        {/* Interactive Compatibility Matrix Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4232C]">Interactive Tool</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Check Blood Compatibility</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any donor or recipient blood group to inspect medical cross-match permissions instantly.
            </p>
          </div>
          <CompatibilityMatrix />
        </div>
      </div>

      {/* Contributor Submission Modal */}
      <SubmitArticleModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
