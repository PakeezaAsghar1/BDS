import React, { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  Upload,
  CheckCircle,
  Eye,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

import campImg from '../../assets/images/uet_blood_camp_1792275956152.jpg';
import volunteersImg from '../../assets/images/bds_team_volunteers_1792275955213.jpg';
import rallyImg from '../../assets/images/uet_awareness_rally_1792275976528.jpg';
import transitImg from '../../assets/images/emergency_blood_transit_1792275977018.jpg';
import donorArmImg from '../../assets/images/blood_donor_arm_1792208217837.jpg';
import campusTowerImg from '../../assets/images/uet_campus_tower_1792275186910.jpg';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'camps' | 'volunteers' | 'rallies' | 'emergency' | 'campus';
  categoryLabel: string;
  image: string;
  location: string;
  date: string;
  description: string;
  stats?: string;
  aspect?: 'tall' | 'wide' | 'square';
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Annual Mega Campus Blood Donation Drive',
    category: 'camps',
    categoryLabel: 'Blood Camp',
    image: campImg,
    location: 'Main Auditorium, UET Narowal Campus',
    date: 'March 2026',
    description: 'Over 280 units of blood collected in a single day with the Red Crescent and DHQ medical teams. Students from all engineering departments queued up to donate.',
    stats: '280+ Units Collected',
    aspect: 'wide'
  },
  {
    id: 'gal-2',
    title: 'BDS Student Executive Body & Volunteer Awards',
    category: 'volunteers',
    categoryLabel: 'Volunteers',
    image: volunteersImg,
    location: 'Faculty Courtyard, UET Narowal',
    date: 'February 2026',
    description: 'Recognizing student wing coordinators and emergency dispatchers who worked 24/7 to fulfill urgent thalassemic patient blood requests in Narowal district.',
    stats: '45 Student Organizers',
    aspect: 'wide'
  },
  {
    id: 'gal-3',
    title: 'Youth Blood Awareness Walk & Community March',
    category: 'rallies',
    categoryLabel: 'Awareness Rally',
    image: rallyImg,
    location: 'University Main Boulevard, UET Narowal',
    date: 'January 2026',
    description: 'Faculty members, vice-chancellor office representatives, and 600+ students marching together to break blood donation myths and encourage first-time donors.',
    stats: '600+ Participants',
    aspect: 'wide'
  },
  {
    id: 'gal-4',
    title: 'Emergency Cold-Chain Blood Transit to DHQ Hospital',
    category: 'emergency',
    categoryLabel: 'Emergency Transit',
    image: transitImg,
    location: 'Emergency Wing, DHQ Hospital Narowal',
    date: 'April 2026',
    description: 'Our volunteer cold-chain courier delivering O-negative units for a critical emergency surgery within 24 minutes of receiving the distress alert.',
    stats: '24 Min Response',
    aspect: 'wide'
  },
  {
    id: 'gal-5',
    title: 'First-Time Student Donor at Campus Clinic',
    category: 'camps',
    categoryLabel: 'Donor Moment',
    image: donorArmImg,
    location: 'Campus Health & Medical Center',
    date: 'March 2026',
    description: 'A third-year electrical engineering student comfortably completing her first voluntary whole blood donation under professional medical supervision.',
    stats: '1 Unit Saves 3 Lives',
    aspect: 'square'
  },
  {
    id: 'gal-6',
    title: 'The Heart of UET Narowal Campus',
    category: 'campus',
    categoryLabel: 'Campus Life',
    image: campusTowerImg,
    location: 'Central Clock Tower & Academic Blocks',
    date: 'Academic Year 2025-2026',
    description: 'The iconic campus grounds where the Blood Donor Society was founded to serve humanity and bridge life-saving blood supply across the region.',
    stats: '100% Student Led',
    aspect: 'square'
  }
];

export const GallerySection: React.FC = () => {
  const { showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload photo form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'camps',
    location: '',
    date: '',
    contributorName: '',
    description: '',
    imageFile: null as File | null,
    imagePreview: ''
  });

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

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

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.contributorName) {
      showToast('Please provide a title and your name', 'error');
      return;
    }
    showToast('Photo submitted successfully! Our student committee will review and publish it to the gallery.', 'success');
    setUploadModalOpen(false);
    setUploadForm({
      title: '',
      category: 'camps',
      location: '',
      date: '',
      contributorName: '',
      description: '',
      imageFile: null,
      imagePreview: ''
    });
  };

  const categories = [
    { id: 'all', label: 'All Photos', count: GALLERY_ITEMS.length },
    { id: 'camps', label: 'Blood Camps', count: GALLERY_ITEMS.filter(i => i.category === 'camps').length },
    { id: 'volunteers', label: 'Volunteers & Awards', count: GALLERY_ITEMS.filter(i => i.category === 'volunteers').length },
    { id: 'rallies', label: 'Awareness Walks', count: GALLERY_ITEMS.filter(i => i.category === 'rallies').length },
    { id: 'emergency', label: 'Emergency Transit', count: GALLERY_ITEMS.filter(i => i.category === 'emergency').length },
    { id: 'campus', label: 'Campus Life', count: GALLERY_ITEMS.filter(i => i.category === 'campus').length }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" id="our-gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B4232C] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#B4232C] uppercase">
                OUR GALLERY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Moments of Hope, Unity & Life Saved
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Explore authentic glimpses from our campus blood donation camps, awareness rallies, dedicated volunteer wings, and rapid emergency responses across UET Narowal and DHQ Hospital.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#B4232C] hover:border-[#B4232C] bg-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-sm"
              id="gallery-submit-photo-btn"
            >
              <Upload className="w-4 h-4 text-[#B4232C]" />
              <span>Submit a Photo</span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Tabs (Segmented Control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#B4232C] text-white shadow-sm shadow-red-950/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-[16/11]"
              id={`gallery-card-${item.id}`}
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
                <span className="text-[11px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-[#B4232C] px-2.5 py-1 rounded-lg shadow-xs">
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

        {/* Gallery Footer Note */}
        <div className="mt-12 rounded-2xl bg-[#FAF9F7] border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B4232C] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Are you a student volunteer or donor at UET Narowal?
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit your camp photos and awareness drive memories to be featured in our official hall of fame.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer text-center"
          >
            Submit Camp Photo
          </button>
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
                  showToast('Gallery link copied to clipboard!', 'info');
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105"
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
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105"
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

      {/* Submit Photo Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Submit a Community Photo"
        subtitle="Share photos from blood donation camps, awareness rallies, or volunteer activities."
      >
        <form onSubmit={handlePhotoUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Photo Title / Event Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mechanical Engg Wing Blood Donation Drive"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm bg-white"
              >
                <option value="camps">Blood Donation Camp</option>
                <option value="volunteers">Volunteers & Awards</option>
                <option value="rallies">Awareness Rally</option>
                <option value="emergency">Emergency Response</option>
                <option value="campus">Campus Life</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name / Roll No. *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hamza Tariq (2022-MC-14)"
                value={uploadForm.contributorName}
                onChange={(e) => setUploadForm({ ...uploadForm, contributorName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. UET Narowal Auditorium or DHQ Narowal"
                value={uploadForm.location}
                onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Approximate Date
              </label>
              <input
                type="text"
                placeholder="e.g. Spring 2026"
                value={uploadForm.date}
                onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Story / Context
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about this moment, how many donors participated, or who was recognized..."
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B4232C] text-sm"
            />
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
            <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Select or Drag Image Here
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              PNG, JPG, or WEBP up to 10MB
            </p>
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#B4232C] hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
