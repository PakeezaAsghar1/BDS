import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Search,
  Plus,
  LayoutGrid,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GALLERY_ITEMS, GALLERY_ALBUMS, GalleryAlbum } from '../../data/galleryData';

export const GalleryPage: React.FC = () => {
  const { showToast } = useApp();
  
  // View mode: 'stack' (card-deck matching reference screenshot) | 'grid' (classic grid)
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected album for full story/collection viewer
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  
  // For classic grid lightbox
  const [selectedGridIndex, setSelectedGridIndex] = useState<number | null>(null);
  
  // Modal for "+ Add Memory"
  const [contributeModalOpen, setContributeModalOpen] = useState<boolean>(false);
  const [contributeTitle, setContributeTitle] = useState<string>('');
  const [contributeCategory, setContributeCategory] = useState<string>('camps');
  const [contributeStory, setContributeStory] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Moments' },
    { id: 'camps', label: 'Blood Camps' },
    { id: 'volunteers', label: 'Volunteers & Honors' },
    { id: 'rallies', label: 'Awareness Walks' },
    { id: 'emergency', label: 'Emergency Transit' },
    { id: 'campus', label: 'Campus Life' },
  ];

  // Filtered albums for stack view
  const filteredAlbums = useMemo(() => {
    return GALLERY_ALBUMS.filter((album) => {
      const matchesFilter = activeFilter === 'all' || album.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        album.title.toLowerCase().includes(q) ||
        album.journalNote.toLowerCase().includes(q) ||
        album.location.toLowerCase().includes(q) ||
        album.curator.name.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Filtered items for classic grid view
  const filteredGridItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Keyboard navigation for viewer modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedAlbum) {
        if (e.key === 'Escape') {
          setSelectedAlbum(null);
        } else if (e.key === 'ArrowRight') {
          setActivePhotoIndex((prev) => (prev + 1) % selectedAlbum.allImages.length);
        } else if (e.key === 'ArrowLeft') {
          setActivePhotoIndex((prev) => (prev - 1 + selectedAlbum.allImages.length) % selectedAlbum.allImages.length);
        }
      } else if (selectedGridIndex !== null) {
        if (e.key === 'Escape') {
          setSelectedGridIndex(null);
        } else if (e.key === 'ArrowRight') {
          setSelectedGridIndex((prev) => (prev !== null ? (prev + 1) % filteredGridItems.length : 0));
        } else if (e.key === 'ArrowLeft') {
          setSelectedGridIndex((prev) => (prev !== null ? (prev - 1 + filteredGridItems.length) % filteredGridItems.length : 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum, selectedGridIndex, filteredGridItems.length]);

  const handleOpenAlbum = (album: GalleryAlbum, photoIndex = 0) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(photoIndex);
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeTitle.trim()) return;
    showToast('Moment Submitted for Verification', 'Thank you! Your photo and story will appear after executive committee review.', 'success');
    setContributeModalOpen(false);
    setContributeTitle('');
    setContributeStory('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-slate-900 selection:bg-red-100 selection:text-red-950 pb-28 pt-4 sm:pt-6" id="our-gallery-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Controls: Search Bar above Category Filters */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {/* Row 1: Add Moment Button on the right above Search Bar */}
          <div className="flex justify-end">
            <button
              onClick={() => setContributeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-full bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs sm:text-sm font-bold shadow-xs shadow-red-900/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
              id="gallery-add-moment-top-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Moment</span>
            </button>
          </div>

          {/* Row 2: Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moments..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4232C]/10 focus:border-[#B4232C]/60 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Row 2: Category Filter Pills (Below Search Bar) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#B4232C] text-white shadow-xs shadow-red-900/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STACK VIEW (Desktop Responsive 2-Column Grid / 1-Col Mobile)               */}
        {/* ========================================================================= */}
        {viewMode === 'stack' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 sm:gap-y-12 md:gap-x-8 md:gap-y-14 lg:gap-x-12 lg:gap-y-16" id="gallery-story-stacks-container">
            {filteredAlbums.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-10 text-center my-6 shadow-xs max-w-sm mx-auto">
                <Camera className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800">No moments found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try selecting another category or clearing your search.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-full cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="w-full flex flex-col items-center justify-center group select-none"
                  id={`gallery-album-${album.id}`}
                >
                  {/* Transparent Deck Container holding 4 cards (3 images + 1 white +photos card) */}
                  <div
                    onClick={() => handleOpenAlbum(album, 0)}
                    className="flex items-center justify-center cursor-pointer bg-transparent pt-3 pb-2 px-2 select-none"
                  >
                    {/* 4 Cards Overlapping Horizontally */}
                    <div className="flex items-center">
                      
                      {/* CARD 1: Image 1 with Curator Avatar (Tilted left) */}
                      <div className="relative w-24 h-38 sm:w-28 sm:h-44 md:w-32 md:h-50 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md shrink-0 z-10 transform -rotate-3 group-hover:-rotate-4 group-hover:-translate-x-1.5 transition-transform duration-300">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Circular Curator Avatar at Top Left */}
                        <div className="absolute top-2 left-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                          <img
                            src={album.curator.avatar}
                            alt={album.curator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* CARD 2: Image 2 (Tilted slightly right) */}
                      <div className="relative w-24 h-38 sm:w-28 sm:h-44 md:w-32 md:h-50 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md shrink-0 -ml-8 sm:-ml-9 md:-ml-10 z-20 transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                        <img
                          src={album.middleImage || album.allImages[1]?.url || album.secondaryImage}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* CARD 3: Image 3 (Tilted left to clearly separate from Card 2) */}
                      <div className="relative w-24 h-38 sm:w-28 sm:h-44 md:w-32 md:h-50 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md shrink-0 -ml-8 sm:-ml-9 md:-ml-10 z-30 transform -rotate-2 group-hover:-rotate-1 transition-transform duration-300">
                        <img
                          src={album.secondaryImage || album.allImages[2]?.url || album.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* CARD 4: White Background Card with +N PHOTOS (Tilted right and above image cards, with fixed Plus Button) */}
                      <div className="relative w-24 h-38 sm:w-28 sm:h-44 md:w-32 md:h-50 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-lg shrink-0 -ml-8 sm:-ml-9 md:-ml-10 z-40 flex flex-col items-center justify-center p-3 transform rotate-3 group-hover:rotate-4 group-hover:translate-x-1.5 transition-transform duration-300 select-none">
                        {/* Plus Button fixed directly with this Card 4 div at top-right */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAlbum(album, 0);
                          }}
                          className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 z-50 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="View Collection"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
                        </button>

                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                          +{album.extraCount}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1 sm:mt-1.5">
                          PHOTOS
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Below Card: Album Title & Date (Centered) */}
                  <div
                    className="text-center mt-3 sm:mt-3.5 cursor-pointer"
                    onClick={() => handleOpenAlbum(album, 0)}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#B4232C] transition-colors tracking-tight">
                      {album.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {album.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* CLASSIC GRID VIEW (Desktop Responsive 3 & 4 Columns)                      */
          /* ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 animate-in fade-in duration-200">
            {filteredGridItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedGridIndex(index)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-300" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-[#B4232C] px-2.5 py-1 rounded-lg shadow-xs">
                    {item.categoryLabel}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="relative z-10 p-4 text-white space-y-1">
                  {item.stats && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-current text-red-400" />
                      <span>{item.stats}</span>
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-100 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 pt-0.5">
                    <span className="flex items-center gap-1 truncate max-w-[160px]">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* FLOATING VIEW SWITCHER DOCK (Positioned cleanly above the AI chatbot to prevent overlap) */}
      <div className="fixed bottom-22 right-5 sm:bottom-24 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-1 bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 rounded-full flex items-center gap-1">
          {/* Stack View Option (Red circle when active) */}
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              viewMode === 'stack'
                ? 'bg-[#B4232C] text-white shadow-xs shadow-red-900/20'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
            title="Stories / Stack View"
          >
            <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Grid View Option */}
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#B4232C] text-white shadow-xs shadow-red-900/20'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
            title="Classic Grid View"
          >
            <LayoutGrid className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL ALBUM STORY LIGHTBOX MODAL                                           */}
      {/* ========================================================================= */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedAlbum(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white z-10 max-w-4xl mx-auto w-full pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {activePhotoIndex + 1} / {selectedAlbum.allImages.length}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-red-600/80 text-white">
                {selectedAlbum.categoryLabel}
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-md">
                {selectedAlbum.stats}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Collection link copied to clipboard!', 'info');
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Carousel */}
          <div
            className="relative flex-1 flex items-center justify-center my-3 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={() => setActivePhotoIndex((prev) => (prev - 1 + selectedAlbum.allImages.length) % selectedAlbum.allImages.length)}
              className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              title="Previous photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo Container */}
            <div className="max-w-4xl max-h-[66vh] flex flex-col items-center justify-center px-4">
              <img
                src={selectedAlbum.allImages[activePhotoIndex]?.url}
                alt={selectedAlbum.allImages[activePhotoIndex]?.title}
                className="max-h-[60vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium text-center">
                {selectedAlbum.allImages[activePhotoIndex]?.title}
              </p>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setActivePhotoIndex((prev) => (prev + 1) % selectedAlbum.allImages.length)}
              className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              title="Next photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Album Meta Bar */}
          <div
            className="max-w-4xl mx-auto w-full text-white bg-slate-900/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {selectedAlbum.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Curated by {selectedAlbum.curator.name} ({selectedAlbum.curator.role})
                </p>
              </div>

              {/* Thumbnails Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {selectedAlbum.allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activePhotoIndex === i ? 'border-red-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic">
              "{selectedAlbum.journalNote}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{selectedAlbum.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedAlbum.date}</span>
              </span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">
                {selectedAlbum.stats}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRID ITEM LIGHTBOX MODAL                                                  */}
      {/* ========================================================================= */}
      {selectedGridIndex !== null && filteredGridItems[selectedGridIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedGridIndex(null)}
        >
          <div
            className="flex items-center justify-between text-white z-10 max-w-4xl mx-auto w-full pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              {selectedGridIndex + 1} / {filteredGridItems.length}
            </span>
            <button
              onClick={() => setSelectedGridIndex(null)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-3 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGridIndex((selectedGridIndex - 1 + filteredGridItems.length) % filteredGridItems.length)}
              className="absolute left-2 sm:left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={filteredGridItems[selectedGridIndex].image}
              alt={filteredGridItems[selectedGridIndex].title}
              className="max-h-[66vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setSelectedGridIndex((selectedGridIndex + 1) % filteredGridItems.length)}
              className="absolute right-2 sm:right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div
            className="max-w-4xl mx-auto w-full text-white bg-slate-900/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-bold text-white">
              {filteredGridItems[selectedGridIndex].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {filteredGridItems[selectedGridIndex].description}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTRIBUTE MEMORY MODAL                                                   */}
      {/* ========================================================================= */}
      {contributeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setContributeModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-[#B4232C] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Share Campus Moment</h3>
              </div>
              <button
                onClick={() => setContributeModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContributeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Moment or Drive Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Dept Blood Drive 2026"
                  value={contributeTitle}
                  onChange={(e) => setContributeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={contributeCategory}
                  onChange={(e) => setContributeCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 outline-none bg-white"
                >
                  <option value="camps">Blood Camp</option>
                  <option value="rallies">Awareness Rally</option>
                  <option value="volunteers">Volunteers & Awards</option>
                  <option value="emergency">Emergency Response</option>
                  <option value="campus">Campus Life</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Journal Story / Note
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a short reflection, statistics, or donor experience..."
                  value={contributeStory}
                  onChange={(e) => setContributeStory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 outline-none resize-none"
                />
              </div>

              <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-slate-700 block">Upload Event Photos</span>
                <span className="text-[10px] text-slate-500">PNG, JPG up to 10MB each</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContributeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#B4232C] hover:bg-[#8F1D25] rounded-xl shadow-xs shadow-red-900/20 cursor-pointer"
                >
                  Submit Moment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
