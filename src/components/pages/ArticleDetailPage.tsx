import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, ArrowLeft, Share2, ShieldCheck, Heart } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { articles, selectedArticleSlug, navigate, showToast } = useApp();

  const article = articles.find((a) => a.slug === selectedArticleSlug) || articles[0];

  if (!article) {
    return (
      <div className="py-16 text-center">
        <p>Article not found.</p>
        <button onClick={() => navigate('guide')} className="mt-4 text-[#B4232C] font-bold">
          ← Back to all guides
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Article URL copied to clipboard.', 'info');
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="article-detail-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('guide')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all guides & health library</span>
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
          <div className="relative h-72 sm:h-96 overflow-hidden bg-slate-100">
            <img
              src={article.featuredImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs">
              {article.category}
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 bg-red-50 text-[#8F1D25] px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{article.author}</span>
                </div>
                {article.authorRole && (
                  <span className="text-slate-500 text-xs">{article.authorRole}</span>
                )}
                {article.authorAffiliation && (
                  <span className="text-slate-400 text-xs">({article.authorAffiliation})</span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.publishedDate || article.updatedDate || '2026'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#B4232C] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Guide</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border-l-4 border-[#B4232C]">
              {article.summary}
            </p>

            {/* Markdown/Formatted Content */}
            <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 pt-2">
              {article.content.split('\n\n').map((para, idx) => {
                if (para.startsWith('###')) {
                  return (
                    <h3 key={idx} className="text-xl font-bold text-slate-900 pt-4 mb-2">
                      {para.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (para.startsWith('##')) {
                  return (
                    <h2 key={idx} className="text-2xl font-extrabold text-slate-900 pt-6 mb-3">
                      {para.replace('##', '').trim()}
                    </h2>
                  );
                }
                if (para.startsWith('-')) {
                  const items = para.split('\n').map((item) => item.replace('-', '').trim());
                  return (
                    <ul key={idx} className="space-y-2 list-disc pl-5 my-3 text-slate-700 text-sm">
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Topics:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA Box */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-900 to-[#B4232C] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-base text-white">Ready to save a life today?</h4>
                <p className="text-xs text-red-100">
                  Register as a voluntary donor or find an upcoming campus drive.
                </p>
              </div>
              <button
                onClick={() => navigate('become-donor')}
                className="inline-flex items-center gap-1.5 bg-white text-[#8F1D25] hover:bg-red-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Register as Donor</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
