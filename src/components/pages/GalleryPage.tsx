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
  ArrowLeft,
  Search,
  Plus,
  LayoutGrid,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GALLERY_ITEMS, GALLERY_ALBUMS, GalleryAlbum, GalleryItem } from '../../data/galleryData';

export const GalleryPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  
  // View mode: 'stack' (editorial card-stack matching the reference image) | 'grid' (classic grid)
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

  // Keyboard navigation for album viewer
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Minimal Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={() => navigate('home')}
              className="hover:text-[#B4232C] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Moments & Stories</span>
          </nav>

          <button
            onClick={() => setContributeModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            id="gallery-add-moment-top-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Moment</span>
          </button>
        </div>

        {/* Minimalist Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moments..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STACK VIEW (Exact match to reference image: overlapping cards with +N)     */}
        {/* ========================================================================= */}
        {viewMode === 'stack' ? (
          <div className="space-y-14 sm:space-y-18" id="gallery-story-stacks-container">
            {filteredAlbums.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6 shadow-xs">
                <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800">No moments found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
              filteredAlbums.map((album, idx) => (
                <div
                  key={album.id}
                  className="group flex flex-col items-center justify-center select-none"
                  id={`gallery-album-${album.id}`}
                >
                  {/* Overlapping Fanned Card Deck */}
                  <div className="relative flex items-center justify-center pt-2 pb-3 px-2 cursor-pointer">
                    
                    {/* Add / Action Button on top-right (matching reference) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAlbum(album, 0);
                      }}
                      className="absolute -top-1 right-2 sm:right-6 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="View all collection photos"
                    >
                      <Plus className="w-4 h-4 text-slate-700 stroke-[2.2]" />
                    </button>

                    <div
                      className="flex items-center -space-x-4 sm:-space-x-6 md:-space-x-8"
                      onClick={() => handleOpenAlbum(album, 0)}
                    >
                      {/* CARD 1: Left Cover Photo with curator avatar at top left */}
                      <div className="relative w-24 h-36 sm:w-36 sm:h-52 md:w-44 md:h-60 rounded-2xl sm:rounded-3xl shadow-lg border border-white/60 overflow-hidden bg-slate-900 shrink-0 transform -rotate-1 group-hover:-translate-x-1 transition-transform duration-300">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Circular Curator Avatar at Top Left */}
                        <div className="absolute top-2 left-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-white/80 shadow-sm bg-white">
                          <img
                            src={album.curator.avatar}
                            alt={album.curator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Subtle inner shadow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* CARD 2: Editorial Journal / Note Card */}
                      <div className="relative w-24 h-36 sm:w-36 sm:h-52 md:w-44 md:h-60 rounded-2xl sm:rounded-3xl shadow-md border border-slate-100 bg-white p-2.5 sm:p-4 md:p-5 flex flex-col justify-between shrink-0 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 z-10">
                        <div>
                          <div className="w-4 h-0.5 bg-red-500 mb-2 rounded-full opacity-60" />
                          <p className="font-serif italic text-[8.5px] sm:text-[11px] md:text-xs text-slate-600 leading-relaxed line-clamp-5 sm:line-clamp-6">
                            "{album.journalNote}"
                          </p>
                        </div>
                        <div className="text-[7px] sm:text-[9px] text-slate-400 font-sans uppercase tracking-wider font-semibold truncate pt-1 border-t border-slate-100">
                          {album.location}
                        </div>
                      </div>

                      {/* CARD 3: Secondary Photo Card */}
                      <div className="relative w-24 h-36 sm:w-36 sm:h-52 md:w-44 md:h-60 rounded-2xl sm:rounded-3xl shadow-lg border border-white/60 overflow-hidden bg-slate-900 shrink-0 transform rotate-1 group-hover:rotate-0 transition-transform duration-300 z-10">
                        <img
                          src={album.secondaryImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* CARD 4: Frosted +N Count Card */}
                      <div className="relative w-22 h-34 sm:w-32 sm:h-48 md:w-40 md:h-56 rounded-2xl sm:rounded-3xl shadow-md border border-white/80 bg-white/75 backdrop-blur-md flex flex-col items-center justify-center shrink-0 transform rotate-2 group-hover:translate-x-1 group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
                        <span className="text-slate-800 text-lg sm:text-2xl md:text-3xl font-bold tracking-tight">
                          +{album.extraCount}
                        </span>
                        <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">
                          Photos
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Album Caption & Date (Matching reference typography) */}
                  <div
                    className="text-center mt-3 cursor-pointer"
                    onClick={() => handleOpenAlbum(album, 0)}
                  >
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 group-hover:text-[#B4232C] transition-colors tracking-tight">
                      {album.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                      {album.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* CLASSIC GRID VIEW (Optional switch from bottom pill dock)                */
          /* ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-in fade-in duration-200">
            {filteredGridItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedGridIndex(index)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-[16/11]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-300" />
                
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-[#B4232C] px-2.5 py-1 rounded-lg shadow-xs">
                    {item.categoryLabel}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="relative z-10 p-4 sm:p-5 text-white space-y-1.5">
                  {item.stats && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                      <span>{item.stats}</span>
                    </div>
                  )}
                  <h3 className="text-base font-bold text-white group-hover:text-red-100 transition-colors line-clamp-2 leading-snug">
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

      </div>

      {/* ========================================================================= */}
      {/* FLOATING BOTTOM VIEW SWITCHER DOCK (Matching reference image bottom right) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-1 bg-white/90 backdrop-blur-md shadow-xl border border-slate-200/90 rounded-full flex items-center gap-1">
          {/* Stack View Option (Dark pill when active) */}
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              viewMode === 'stack'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
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
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
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
            className="flex items-center justify-between text-white z-10 max-w-5xl mx-auto w-full pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {activePhotoIndex + 1} / {selectedAlbum.allImages.length}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-600/80 text-white">
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
              className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
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
              className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
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
                <h3 className="text-base sm:text-xl font-bold text-white">
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
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
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
            className="flex items-center justify-between text-white z-10 max-w-5xl mx-auto w-full pt-1"
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
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer"
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
