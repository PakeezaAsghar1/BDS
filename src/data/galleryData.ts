import campImg from '../assets/images/uet_blood_camp_1792275956152.jpg';
import volunteersImg from '../assets/images/bds_team_volunteers_1792275955213.jpg';
import rallyImg from '../assets/images/uet_awareness_rally_1792275976528.jpg';
import transitImg from '../assets/images/emergency_blood_transit_1792275977018.jpg';
import donorArmImg from '../assets/images/blood_donor_arm_1792208217837.jpg';
import campusTowerImg from '../assets/images/uet_campus_tower_1792275186910.jpg';
import heartInHandsImg from '../assets/images/heart_in_hands_1792059102193.jpg';
import heroHeartImg from '../assets/images/about_hero_heart.jpg';

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

export const GALLERY_ITEMS: GalleryItem[] = [
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
  },
  {
    id: 'gal-7',
    title: 'Hope in Hands: Community Outreach & Pre-Screening',
    category: 'camps',
    categoryLabel: 'Health Screening',
    image: heartInHandsImg,
    location: 'Student Service Center, UET Narowal',
    date: 'February 2026',
    description: 'Free hemoglobin and blood typing checks conducted for 400+ university freshmen before donation eligibility assessment.',
    stats: '400+ Screenings',
    aspect: 'wide'
  },
  {
    id: 'gal-8',
    title: 'Gift of Life: Dedicated Volunteer Emergency Desk',
    category: 'volunteers',
    categoryLabel: 'Operations',
    image: heroHeartImg,
    location: 'BDS Control Room, Admin Block',
    date: 'April 2026',
    description: 'Round-the-clock coordination room keeping verified donor registries active for rapid response to Narowal regional hospitals.',
    stats: '24/7 Active Desk',
    aspect: 'square'
  }
];

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  category: 'camps' | 'volunteers' | 'rallies' | 'emergency' | 'campus';
  categoryLabel: string;
  curator: {
    name: string;
    role: string;
    avatar: string;
  };
  journalNote: string;
  coverImage: string;
  secondaryImage: string;
  extraCount: number;
  location: string;
  stats: string;
  description: string;
  allImages: Array<{ url: string; title: string; caption: string }>;
}

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 'album-1',
    title: 'Book Fair & Blood Camp',
    date: 'Oct 12, 2026',
    category: 'camps',
    categoryLabel: 'Blood Camp',
    curator: {
      name: 'Hamza Tariq',
      role: 'President BDS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Students gathered between study sessions to give the gift of life. The main auditorium hall was filled with smiles and courage as 280+ bags were collected safely.',
    coverImage: campImg,
    secondaryImage: donorArmImg,
    extraCount: 12,
    location: 'Central Auditorium, UET Narowal',
    stats: '280+ Bags Collected',
    description: 'Our annual hallmark blood drive organized in collaboration with Pakistan Red Crescent Society and District Headquarter Hospital medical officers.',
    allImages: [
      { url: campImg, title: 'Auditorium Screening Counters', caption: 'Over 280 units safely stored in cold-chain units.' },
      { url: donorArmImg, title: 'First-time Donor Smiles', caption: 'Student completing whole blood donation under sterile care.' },
      { url: heartInHandsImg, title: 'Health & Hemoglobin Vitals', caption: 'Free pre-screening and hemoglobin testing for all participants.' },
      { url: volunteersImg, title: 'Volunteer Dispatch Squad', caption: 'Student wing coordinators managing queue and hydration stations.' },
    ],
  },
  {
    id: 'album-2',
    title: 'Exploring Vietnam & Rallies',
    date: 'Aug 6, 2026',
    category: 'rallies',
    categoryLabel: 'Awareness Rally',
    curator: {
      name: 'Ayesha Malik',
      role: 'General Secretary',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Walking the boulevard with banners and determination. Breaking deep-seated misconceptions about blood donation across faculty and young scholars alike.',
    coverImage: rallyImg,
    secondaryImage: heartInHandsImg,
    extraCount: 8,
    location: 'University Main Boulevard',
    stats: '600+ Participants',
    description: 'A vibrant community rally bringing together campus deans, departmental societies, and hundreds of students to spread the message of voluntary donation.',
    allImages: [
      { url: rallyImg, title: 'Main Boulevard March', caption: 'Over 600 students marching in unison for regional blood equity.' },
      { url: heartInHandsImg, title: 'Hope Placards & Banners', caption: 'Creative student-crafted posters breaking myths.' },
      { url: campusTowerImg, title: 'Clock Tower Assembly', caption: 'Closing remarks and oath of honorary voluntary donors.' },
    ],
  },
  {
    id: 'album-3',
    title: 'Infinity Calm & Cold Transit',
    date: 'Aug 27, 2026',
    category: 'emergency',
    categoryLabel: 'Emergency Transit',
    curator: {
      name: 'Saad Rehman',
      role: 'Emergency Dispatch Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'I spent most of my evening coordinating the Old Quarter route. Crossing town under 24 minutes to deliver critical O-negative units for an emergency surgery.',
    coverImage: transitImg,
    secondaryImage: heroHeartImg,
    extraCount: 20,
    location: 'DHQ Hospital Emergency Wing',
    stats: '24 Min Response',
    description: 'Rapid response operations delivering life-saving packed red cells and platelets across Narowal and surrounding emergency treatment centers.',
    allImages: [
      { url: transitImg, title: 'Cold-Chain Transit Carrier', caption: 'Temperature-monitored mobile blood storage box in transit.' },
      { url: heroHeartImg, title: 'DHQ Surgical Ward Handover', caption: 'Verified transfer to on-duty trauma surgeons.' },
      { url: campImg, title: 'Emergency Reserve Stock', caption: 'Screened reserve units stored for rapid callouts.' },
    ],
  },
  {
    id: 'album-4',
    title: 'Executive Honors & Gala',
    date: 'Apr 18, 2026',
    category: 'volunteers',
    categoryLabel: 'Volunteers',
    curator: {
      name: 'Bilal Farooq',
      role: 'Vice President',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: '45 core organizers recognized on stage for round-the-clock emergency support. Their dedication proves that youth compassion can transform healthcare access.',
    coverImage: volunteersImg,
    secondaryImage: campImg,
    extraCount: 15,
    location: 'Faculty Courtyard, UET Narowal',
    stats: '45 Awardees',
    description: 'Annual volunteer celebration honoring student coordinators who answered 24/7 emergency dispatches and coordinated blood drives throughout the academic year.',
    allImages: [
      { url: volunteersImg, title: 'Executive Council & Coordinators', caption: 'Annual shields and certificates presented by Dean of Engineering.' },
      { url: campImg, title: 'Behind the Scenes Logistics', caption: 'Student coordinators managing donor vitals registration.' },
      { url: donorArmImg, title: 'Honorary Pinning Ceremony', caption: 'Recognizing 5-time recurring voluntary donors.' },
    ],
  },
  {
    id: 'album-5',
    title: 'Campus Heritage & Towers',
    date: 'Feb 14, 2026',
    category: 'campus',
    categoryLabel: 'Campus Life',
    curator: {
      name: 'Fatima Noor',
      role: 'Creative & Media Head',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Beneath the iconic red-brick towers of UET Narowal, generations of engineers and changemakers have built a culture where nobody in our city bleeds alone.',
    coverImage: campusTowerImg,
    secondaryImage: heartInHandsImg,
    extraCount: 18,
    location: 'Central Clock Tower & Lawns',
    stats: '100% Student Led',
    description: 'Scenes from our picturesque university grounds, where students balance academic excellence with community emergency service.',
    allImages: [
      { url: campusTowerImg, title: 'Clock Tower at Sunrise', caption: 'The beacon of hope in Narowal.' },
      { url: heartInHandsImg, title: 'Hands of Compassion', caption: 'Student volunteers gathering for morning brief.' },
      { url: rallyImg, title: 'Boulevard Gathering', caption: 'Community assembly outside academic complex.' },
    ],
  },
];
