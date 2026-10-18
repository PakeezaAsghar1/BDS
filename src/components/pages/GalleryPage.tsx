import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ArrowLeft,
  Search,
  Sparkles,
  Users,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GALLERY_ITEMS, GalleryItem } from '../../data/galleryData';

export const GalleryPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos', count: GALLERY_ITEMS.length },
    { id: 'camps', label: 'Blood Camps', count: GALLERY_ITEMS.filter((i) => i.category === 'camps').length },
    { id: 'volunteers', label: 'Volunteers & Awards', count: GALLERY_ITEMS.filter((i) => i.category === 'volunteers').length },
    { id: 'rallies', label: 'Awareness Walks', count: GALLERY_ITEMS.filter((i) => i.category === 'rallies').length },
    { id: 'emergency', label: 'Emergency Transit', count: GALLERY_ITEMS.filter((i) => i.category === 'emergency').length },
    { id: 'campus', label: 'Campus Life', count: GALLERY_ITEMS.filter((i) => i.category === 'campus').length },
  ];

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % filteredItems.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredItems.length]);

  const currentPhoto = selectedPhotoIndex !== null ? filteredItems[selectedPhotoIndex] : null;

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-8 sm:py-12" id="our-gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={() => navigate('home')}
              className="hover:text-[#B4232C] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Our Gallery</span>
          </nav>

          <button
            onClick={() => navigate('become-donor')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Donate Blood</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 mb-8 sm:mb-12 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#B4232C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#B4232C] uppercase">
                Official Photo Gallery
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Moments of Hope, Unity & Life Saved
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Explore authentic glimpses from our campus blood donation camps, awareness rallies, dedicated volunteer wings, and rapid emergency cold-chain responses across UET Narowal and DHQ Hospital.
            </p>

            {/* Quick Stats Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <span className="block text-xl sm:text-2xl font-black text-[#B4232C]">1,850+</span>
                <span className="text-[11px] text-slate-500 font-medium">Bags Collected</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <span className="block text-xl sm:text-2xl font-black text-slate-900">12+</span>
                <span className="text-[11px] text-slate-500 font-medium">Campus Drives</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <span className="block text-xl sm:text-2xl font-black text-slate-900">45+</span>
                <span className="text-[11px] text-slate-500 font-medium">Core Volunteers</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <span className="block text-xl sm:text-2xl font-black text-emerald-600">24 Min</span>
                <span className="text-[11px] text-slate-500 font-medium">Avg Transit Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#B4232C] text-white shadow-sm shadow-red-950/20'
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives, rallies, venues..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4232C]/20 focus:border-[#B4232C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid (Where all images show as they were showing) */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No photos found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any photos matching "{searchQuery}". Try selecting another category tab or clearing the search.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-[16/11]"
                id={`gallery-page-card-${item.id}`}
              >
                {/* Background Image with Hover Scale */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient Scrim for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-300" />

                {/* Top Tag & Zoom Icon */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-[#B4232C] px-2.5 py-1 rounded-lg shadow-xs">
                    {item.categoryLabel}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 p-4 sm:p-5 text-white space-y-1.5">
                  {item.stats && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                      <span>{item.stats}</span>
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-100 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-300 pt-0.5">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Footer Callout */}
        <div className="mt-12 sm:mt-16 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B4232C] flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-6 h-6 text-[#B4232C] fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Be Part of our Next Life-Saving Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Register as a voluntary campus blood donor or join our student committee at UET Narowal to impact lives across the region.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate('become-donor')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer text-center"
            >
              Register as Donor
            </button>
            <button
              onClick={() => navigate('volunteers')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:border-[#B4232C] hover:text-[#B4232C] text-slate-700 bg-white text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
            >
              Join Volunteer Wing
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white z-10 max-w-7xl mx-auto w-full pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {selectedPhotoIndex + 1} / {filteredItems.length}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-600/80 text-white">
                {currentPhoto.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Gallery photo link copied to clipboard!', 'info');
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo Display Area */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              title="Previous photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Photo Container */}
            <div className="max-w-5xl max-h-[70vh] flex items-center justify-center px-4">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className="max-h-[68vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              title="Next photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div
            className="max-w-4xl mx-auto w-full text-white bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
              <h3 className="text-base sm:text-xl font-bold text-white">
                {currentPhoto.title}
              </h3>
              {currentPhoto.stats && (
                <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  {currentPhoto.stats}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPhoto.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{currentPhoto.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{currentPhoto.date}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
