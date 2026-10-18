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
