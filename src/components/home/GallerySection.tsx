import React, { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Maximize2,
  X,
  Share2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { GALLERY_ITEMS, GalleryItem } from '../../data/galleryData';

export const GallerySection: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Divide images equally: Half on 1st layer (top), half on 2nd layer (below)
  const halfCount = Math.ceil(GALLERY_ITEMS.length / 2);
  const firstLayerBase = GALLERY_ITEMS.slice(0, halfCount); // 1st layer: 4 images
  const secondLayerBase = GALLERY_ITEMS.slice(halfCount);    // 2nd layer: 4 images

  // Duplicate for seamless 0% -> -50% infinite continuous marquee
  const firstLayer = [...firstLayerBase, ...firstLayerBase, ...firstLayerBase, ...firstLayerBase];
  const secondLayer = [...secondLayerBase, ...secondLayerBase, ...secondLayerBase, ...secondLayerBase];

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  const handleSharePhoto = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#gallery');
      showToast('Photo details link copied to clipboard!', 'info');
    }
  };

  const renderCard = (item: GalleryItem, idx: number, layer: 'top' | 'bottom') => {
    const originalIndex = GALLERY_ITEMS.findIndex((g) => g.id === item.id);
    return (
      <div
        key={`${layer}-${item.id}-${idx}`}
        onClick={() => setSelectedPhotoIndex(originalIndex >= 0 ? originalIndex : 0)}
        className="group relative w-[310px] sm:w-[350px] md:w-[390px] flex-shrink-0 mx-3 sm:mx-4 bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 select-none"
      >
        {/* Image Container with Hover Zoom */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

          {/* Category Tag Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {item.categoryLabel}
            </span>
          </div>

          {/* Quick Zoom Indicator */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="p-1.5 rounded-full bg-white/90 text-neutral-900 shadow-md flex items-center justify-center hover:bg-white">
              <Maximize2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Impact Stats Pill */}
          {item.stats && (
            <div className="absolute bottom-3 right-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-600/90 text-white backdrop-blur-sm shadow-sm">
                {item.stats}
              </span>
            </div>
          )}
        </div>

        {/* Card Content Footer */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-red-700 transition-colors line-clamp-1 leading-snug">
              {item.title}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Meta Info: Location & Date */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 text-neutral-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="our-gallery-section"
      className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] overflow-hidden"
    >
      {/* Decorative ambient background blurs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-100/35 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <ScrollReveal direction="up" delayMs={0}>
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs sm:text-sm font-semibold mb-3">
                <Camera className="w-3.5 h-3.5 text-red-600" />
                <span>MOMENTS & IMPACT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-neutral-500 font-normal">Dual Motion Stream</span>
              </div>

              {/* Section Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Our <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent">Gallery</span>
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delayMs={120}>
              <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
                Witness real life-saving blood camps, youth awareness walks, emergency cold-chain transits, and volunteer fellowship in continuous motion across UET Narowal.
              </p>
            </ScrollReveal>
          </div>

          {/* View All Button - Redirects to dedicated Our Gallery Page */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => navigate('gallery')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all cursor-pointer group btn-subtle-lift"
              title="View all gallery images on dedicated page"
            >
              <span>View All Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* DUAL LAYER MOVING CARDS CONTAINER */}
      <div className="relative z-10 w-full overflow-hidden py-2 space-y-6 sm:space-y-8">
        {/* Edge Gradient Overlays for Smooth Cinematic Fade Out */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#FAF9F7] via-[#FAF9F7]/80 to-transparent z-20" />

        {/* 1ST LAYER: Half of the images moving continuously left */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee-left pause-on-hover py-1">
            {firstLayer.map((item, index) => renderCard(item, index, 'top'))}
          </div>
        </div>

        {/* 2ND LAYER: Half of the images moving continuously in reverse (right) below */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee-right pause-on-hover py-1">
            {secondLayer.map((item, index) => renderCard(item, index, 'bottom'))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-neutral-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-neutral-900/80">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Photo {selectedPhotoIndex + 1} of {GALLERY_ITEMS.length} &bull;{' '}
                  {GALLERY_ITEMS[selectedPhotoIndex].categoryLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleSharePhoto(GALLERY_ITEMS[selectedPhotoIndex], e)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
                  title="Copy share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-neutral-300 hover:text-white transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden">
              <img
                src={GALLERY_ITEMS[selectedPhotoIndex].image}
                alt={GALLERY_ITEMS[selectedPhotoIndex].title}
                className="max-h-full max-w-full object-contain"
              />

              {/* Prev / Next controls inside lightbox only */}
              <button
                onClick={() =>
                  setSelectedPhotoIndex(
                    (selectedPhotoIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all cursor-pointer"
                title="Previous photo (Arrow Left)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedPhotoIndex((selectedPhotoIndex + 1) % GALLERY_ITEMS.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all cursor-pointer"
                title="Next photo (Arrow Right)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details Footer */}
            <div className="p-4 sm:p-6 bg-neutral-900 border-t border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {GALLERY_ITEMS[selectedPhotoIndex].title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {GALLERY_ITEMS[selectedPhotoIndex].location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {GALLERY_ITEMS[selectedPhotoIndex].date}
                    </span>
                    {GALLERY_ITEMS[selectedPhotoIndex].stats && (
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold text-[11px]">
                        {GALLERY_ITEMS[selectedPhotoIndex].stats}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPhotoIndex(null);
                    navigate('gallery');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
                >
                  <span>View All in Gallery Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {GALLERY_ITEMS[selectedPhotoIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
