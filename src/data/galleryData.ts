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
    title: 'Voluntary Blood Donation & Phlebotomy Care',
    category: 'camps',
    categoryLabel: 'Blood Donation',
    image: '/assets/aistudio/733539039_989775177304015_4924020088101479993_n__2__77f68c1b.jpg',
    location: 'Main Auditorium, UET Narowal',
    date: 'March 2026',
    description: 'A student donor comfortably completing a whole blood donation under sterile phlebotomy care, surrounded by cheer, refreshments, and supportive medical staff.',
    stats: '1 Pint = 3 Lives',
    aspect: 'wide'
  },
  {
    id: 'gal-2',
    title: 'BDS Executive Cabinet & Faculty Advisors',
    category: 'volunteers',
    categoryLabel: 'Executive Council',
    image: '/assets/aistudio/aas_ed819de1.jpg',
    location: 'Main Admin Courtyard, UET Narowal',
    date: 'Academic Year 2025-2026',
    description: 'The core leadership of Blood Donor Society UET Narowal standing in official maroon blazers and formal attire in front of the historic university brick facade.',
    stats: '40+ Core Leaders',
    aspect: 'wide'
  },
  {
    id: 'gal-3',
    title: 'International Thalassemia Day Awareness Walk',
    category: 'rallies',
    categoryLabel: 'Awareness Walk',
    image: '/assets/aistudio/Thalasemia_5_2cea6c1e.jpeg',
    location: 'University Main Boulevard',
    date: 'May 2025',
    description: 'University administration, faculty deans, and hundreds of passionate engineering students marching with banners to advocate for thalassemia screening and blood equity.',
    stats: '500+ Walkers',
    aspect: 'wide'
  },
  {
    id: 'gal-4',
    title: 'Donor Reception & Serialization Counter',
    category: 'camps',
    categoryLabel: 'Registration Desk',
    image: '/assets/aistudio/731059180_989774960637370_7778845690749977128_n__2__6737e37e.jpg',
    location: 'Auditorium Foyer, UET Narowal',
    date: 'March 2026',
    description: 'Student coordinators recording donor credentials, preparing sterilized sample test tubes, and managing queue logistics with precision.',
    stats: '280+ Registrations',
    aspect: 'wide'
  },
  {
    id: 'gal-5',
    title: 'Kashif Iqbal Thalassemia Care Pre-Screening',
    category: 'camps',
    categoryLabel: 'Pre-Screening',
    image: '/assets/aistudio/Thalasemia_3_cb571b39.jpeg',
    location: 'Central Screening Bay, UET Narowal',
    date: 'March 2026',
    description: 'Qualified lab professionals from Kashif Iqbal Thalassemia Care Hospital checking donor vitals, blood pressure, and hemoglobin levels before donation.',
    stats: '320+ Screened',
    aspect: 'wide'
  },
  {
    id: 'gal-6',
    title: 'Disease Free UET 3.0 Campaign Walk',
    category: 'rallies',
    categoryLabel: 'Awareness Walk',
    image: '/assets/aistudio/Thalasemia_2_3e5bae7e.jpeg',
    location: 'Academic Concourse to Main Gate',
    date: 'November 2025',
    description: 'BDS annual public rally championing hepatitis B & C eradication, youth health empowerment, and emergency voluntary blood mobilization across Narowal.',
    stats: 'Annual Mega Rally',
    aspect: 'wide'
  },
  {
    id: 'gal-7',
    title: 'BDS Student Volunteer Body at Archways',
    category: 'volunteers',
    categoryLabel: 'Volunteer Squad',
    image: '/assets/aistudio/550692888_17948049033019044_5403410101318411926_n_dc476493.webp',
    location: 'Central Campus Archway Hall',
    date: 'Fall Semester 2025',
    description: 'The dedicated student volunteer contingent assembled beneath the iconic campus arches, managing 24/7 emergency dispatch operations.',
    stats: '60+ Active Volunteers',
    aspect: 'wide'
  },
  {
    id: 'gal-8',
    title: 'Clinical Consultation & Doctor Review Desk',
    category: 'camps',
    categoryLabel: 'Medical Consultation',
    image: '/assets/aistudio/591388890_817825791165622_7173909896649200867_n_4d2f836d.jpg',
    location: 'Doctor Assessment Bay, Camp Area',
    date: 'February 2026',
    description: 'Medical officers in white coats conducting thorough clinical reviews to ensure donors meet strict health and safety criteria.',
    stats: 'Strict Medical Review',
    aspect: 'wide'
  },
  {
    id: 'gal-9',
    title: 'Finger-Prick Blood Grouping & Hemoglobin Check',
    category: 'camps',
    categoryLabel: 'Diagnostics',
    image: '/assets/aistudio/590885988_818596294421905_599125848602877120_n_95f04dbf.jpg',
    location: 'Screening Station 2, UET Narowal',
    date: 'March 2026',
    description: 'Instant blood typing and micro-hemoglobin testing performed on students prior to whole blood donation.',
    stats: 'Rapid Screening',
    aspect: 'wide'
  },
  {
    id: 'gal-10',
    title: 'Community Outreach & Orphanage Care Visit',
    category: 'volunteers',
    categoryLabel: 'Social Outreach',
    image: '/assets/aistudio/Orphange_1_1b53f786.jpeg',
    location: 'Children Home (Male), Narowal',
    date: 'January 2026',
    description: 'BDS student volunteers mentoring young children, conducting art sessions, distributing gifts, and extending social compassion to orphanages and care shelters.',
    stats: 'Compassion In Action',
    aspect: 'wide'
  },
  {
    id: 'gal-11',
    title: 'ABO & Rh Factor Blood Group Card Verification',
    category: 'camps',
    categoryLabel: 'Lab Verification',
    image: '/assets/aistudio/591865525_817825474498987_3444770950986994116_n_9e8c71a7.jpg',
    location: 'Diagnostics Lab Station',
    date: 'March 2026',
    description: 'Lab technologist inspecting blood grouping agglutination test cards to guarantee exact ABO and Rh(D) crossmatching accuracy.',
    stats: '100% Accurate Vitals',
    aspect: 'wide'
  },
  {
    id: 'gal-12',
    title: 'BDS Help Desk & Freshmen Pledge Drive',
    category: 'campus',
    categoryLabel: 'Campus Help Desk',
    image: '/assets/aistudio/812373051_17992370016019044_974773983856486655_n_e69a4262.webp',
    location: 'Academic Block Concourse',
    date: 'October 2025',
    description: 'Student coordinators guiding freshman students, explaining donor eligibility, and registering pledges for emergency blood availability.',
    stats: '350+ Pledges',
    aspect: 'wide'
  },
  {
    id: 'gal-13',
    title: 'Annual Orientation & Awareness Seminar',
    category: 'campus',
    categoryLabel: 'Auditorium Seminar',
    image: '/assets/aistudio/Thalasemia_4_7906f684.jpeg',
    location: 'Main Auditorium, UET Narowal',
    date: 'October 2025',
    description: 'Orientation session organized for the student body highlighting the urgency of voluntary blood donation for regional thalassemic children.',
    stats: '400+ Attended',
    aspect: 'wide'
  },
  {
    id: 'gal-14',
    title: 'Thalassemia Prevention Awareness Walk Placards',
    category: 'rallies',
    categoryLabel: 'Awareness Walk',
    image: '/assets/aistudio/Thalasemia_1_5260c4f7.jpeg',
    location: 'Campus Main Entrance to Boulevard',
    date: 'May 2025',
    description: 'Students championing marriage pre-screening and public awareness with placards reading "Stop Thalassaemia" and "Protect Future Generation".',
    stats: '500+ Placards',
    aspect: 'wide'
  },
  {
    id: 'gal-15',
    title: 'Interactive Art & Learning Session at Children Home',
    category: 'volunteers',
    categoryLabel: 'Orphanage Care',
    image: '/assets/aistudio/Orphange_7_49f203f9.jpeg',
    location: 'Children Home (Male), Narowal',
    date: 'January 2026',
    description: 'Volunteer team sitting alongside children during creative drawing and craft sessions, fostering hope, imagination, and companionship.',
    stats: 'Compassion In Action',
    aspect: 'wide'
  },
  {
    id: 'gal-16',
    title: 'Gift Bags & Treats Distribution at Children Home',
    category: 'volunteers',
    categoryLabel: 'Outreach & Care',
    image: '/assets/aistudio/Orphange_3_de77d3da.jpeg',
    location: 'Children Home (Male), Narowal',
    date: 'January 2026',
    description: 'BDS volunteers presenting personalized gift bags, art supplies, and care packages to smiling young residents.',
    stats: 'Warm Smiles Shared',
    aspect: 'wide'
  },
  {
    id: 'gal-17',
    title: 'Individual Student Mentorship & Study Guidance',
    category: 'volunteers',
    categoryLabel: 'Student Mentorship',
    image: '/assets/aistudio/Orphange_2_a46ec77f.jpeg',
    location: 'Children Home Activity Room',
    date: 'January 2026',
    description: 'Female student volunteer providing attentive one-on-one reading and drawing mentorship to young boys at the shelter.',
    stats: '1-on-1 Mentorship',
    aspect: 'wide'
  },
  {
    id: 'gal-18',
    title: 'Care & Respectful Companionship for Elders',
    category: 'volunteers',
    categoryLabel: 'Community Care',
    image: '/assets/aistudio/Orphange_6_53c37125.jpeg',
    location: 'Senior Care Facility, Narowal',
    date: 'January 2026',
    description: 'Volunteers spending warm, respectful time listening to stories and sharing laughter with senior community members.',
    stats: 'Intergenerational Care',
    aspect: 'wide'
  },
  {
    id: 'gal-19',
    title: 'Sterile Phlebotomy Sampling for Thalassemia Screening',
    category: 'camps',
    categoryLabel: 'Clinical Phlebotomy',
    image: '/assets/aistudio/Thalasemia_6_f86dd358.jpeg',
    location: 'Medical Screening Bay, UET Narowal',
    date: 'May 2025',
    description: 'Certified medical technician collecting screening samples with sterile technique for blood crossmatching and hemoglobin electrophoresis.',
    stats: 'Sterile Diagnostics',
    aspect: 'wide'
  },
  {
    id: 'gal-20',
    title: 'Disease Free UET 3.0 Recognition Ceremony',
    category: 'volunteers',
    categoryLabel: 'Honors & Awards',
    image: '/assets/aistudio/Thalasemia_4_7906f684.jpeg',
    location: 'Auditorium Stage, UET Narowal',
    date: 'May 2025',
    description: 'Chief guest and faculty advisors awarding merit shields and certificates of appreciation to outstanding student coordinators.',
    stats: 'Merit Honors',
    aspect: 'wide'
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
  middleImage?: string;
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
    title: 'Annual Mega Blood Camp & Screening 2k26',
    date: 'March 18, 2026',
    category: 'camps',
    categoryLabel: 'Blood Camp',
    curator: {
      name: 'Hamza Tariq',
      role: 'President BDS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Students from all engineering departments queued in the auditorium hall. Over 280 units were collected and preserved safely for regional thalassemia centers.',
    coverImage: '/assets/aistudio/733539039_989775177304015_4924020088101479993_n__2__77f68c1b.jpg',
    middleImage: '/assets/aistudio/733726720_989775027304030_254847424349451638_n_6d93c37d.jpg',
    secondaryImage: '/assets/aistudio/731059180_989774960637370_7778845690749977128_n__2__6737e37e.jpg',
    extraCount: 4,
    location: 'Main Auditorium, UET Narowal',
    stats: '280+ Bags Collected',
    description: 'Our annual blood donation camp arranged with District Headquarter Hospital and Kashif Iqbal Thalassemia Care Centre.',
    allImages: [
      {
        url: '/assets/aistudio/733539039_989775177304015_4924020088101479993_n__2__77f68c1b.jpg',
        title: 'Voluntary Blood Donation In Progress',
        caption: 'Comfortable blood collection under sterile supervision.'
      },
      {
        url: '/assets/aistudio/733726720_989775027304030_254847424349451638_n_6d93c37d.jpg',
        title: 'Pre-Screening & Hemoglobin Testing',
        caption: 'Kashif Iqbal Thalassemia Care medical team testing vitals.'
      },
      {
        url: '/assets/aistudio/731059180_989774960637370_7778845690749977128_n__2__6737e37e.jpg',
        title: 'Donor Registration & Serialization Desk',
        caption: 'Recording donor records and tube sample barcodes.'
      },
      {
        url: '/assets/aistudio/590885988_818596294421905_599125848602877120_n_95f04dbf.jpg',
        title: 'Instant Blood Grouping & Hemoglobin Test',
        caption: 'Sterile finger-prick blood typing check.'
      },
      {
        url: '/assets/aistudio/591865525_817825474498987_3444770950986994116_n_9e8c71a7.jpg',
        title: 'ABO Group Card Verification',
        caption: 'Doctor reviewing agglutination test result cards.'
      },
      {
        url: '/assets/aistudio/591388890_817825791165622_7173909896649200867_n_4d2f836d.jpg',
        title: 'Physician Clinical Evaluation',
        caption: 'Assessing donor eligibility prior to donation.'
      }
    ],
  },
  {
    id: 'album-2',
    title: 'Thalassemia Day & Disease-Free UET Walks',
    date: 'May 8, 2025',
    category: 'rallies',
    categoryLabel: 'Awareness Walk',
    curator: {
      name: 'Ayesha Malik',
      role: 'General Secretary',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Walking the boulevard with banners and united voices. We broke long-held myths about blood donation and inspired first-time donors across every department.',
    coverImage: '/assets/aistudio/Thalasemia_5_2cea6c1e.jpeg',
    middleImage: '/assets/aistudio/Thalasemia_4_7906f684.jpeg',
    secondaryImage: '/assets/aistudio/Thalasemia_2_3e5bae7e.jpeg',
    extraCount: 2,
    location: 'University Main Boulevard',
    stats: '600+ Walkers',
    description: 'Campus-wide awareness march joining administration, faculty members, and student societies for regional health equity.',
    allImages: [
      {
        url: '/assets/aistudio/Thalasemia_5_2cea6c1e.jpeg',
        title: 'International Thalassemia Day Main Boulevard Walk',
        caption: 'Faculty deans, leadership, and hundreds of students march across campus boulevard with banners advocating thalassemia awareness and prevention.'
      },
      {
        url: '/assets/aistudio/Thalasemia_2_3e5bae7e.jpeg',
        title: 'Disease-Free UET 3.0 Grand Concourse Rally',
        caption: 'Student coordinators, volunteers, and faculty assemble on the campus steps holding campaign banners for regional health equity.'
      },
      {
        url: '/assets/aistudio/Thalasemia_6_f86dd358.jpeg',
        title: 'Clinical Phlebotomy & Health Screening',
        caption: 'Medical staff collecting screening blood samples to evaluate donor safety and hemoglobin status.'
      },
      {
        url: '/assets/aistudio/Thalasemia_1_5260c4f7.jpeg',
        title: 'Thalassemia Day Awareness March & Placards',
        caption: 'Students raising placards: "Get Tested Before Marriage", "Stop Thalassaemia", and "Save Generation".'
      },
      {
        url: '/assets/aistudio/Thalasemia_3_cb571b39.jpeg',
        title: 'Kashif Iqbal Thalassemia Care Registration Desk',
        caption: 'BDS student volunteers managing the screening intake desk and blood sampling test-tube racks with partner care center.'
      },
      {
        url: '/assets/aistudio/Thalasemia_4_7906f684.jpeg',
        title: 'Disease-Free UET 3.0 Recognition Ceremony',
        caption: 'Auditorium stage ceremony awarding shields and certificates of merit to coordinators and society leaders.'
      }
    ],
  },
  {
    id: 'album-3',
    title: 'BDS Leadership Cabinet & Volunteer Force',
    date: 'Dec 15, 2025',
    category: 'volunteers',
    categoryLabel: 'Volunteers',
    curator: {
      name: 'Bilal Farooq',
      role: 'Vice President',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Our volunteers are the heartbeat of the society. From managing 24/7 emergency dispatch calls to setting up campus camps, their tireless spirit saves lives.',
    coverImage: '/assets/aistudio/aas_ed819de1.jpg',
    middleImage: '/assets/aistudio/812373051_17992370016019044_974773983856486655_n_e69a4262.webp',
    secondaryImage: '/assets/aistudio/550692888_17948049033019044_5403410101318411926_n_dc476493.webp',
    extraCount: 2,
    location: 'Central Admin Courtyard, UET Narowal',
    stats: '60+ Active Volunteers',
    description: 'Executive cabinet, team coordinators, and active volunteers responsible for emergency response across Narowal district.',
    allImages: [
      {
        url: '/assets/aistudio/aas_ed819de1.jpg',
        title: 'BDS Executive Cabinet in Maroon Blazers',
        caption: 'The executive committee of Blood Donor Society UET Narowal.'
      },
      {
        url: '/assets/aistudio/812373051_17992370016019044_974773983856486655_n_e69a4262.webp',
        title: 'BDS Help Desk Organizers',
        caption: 'Student coordinators providing guidance to donor aspirants.'
      },
      {
        url: '/assets/aistudio/550692888_17948049033019044_5403410101318411926_n_dc476493.webp',
        title: 'Full Volunteer Contingent at Campus Archways',
        caption: 'Volunteers and event coordinators gathered after orientation.'
      }
    ],
  },
  {
    id: 'album-4',
    title: 'Children Home Narowal & Orphanage Care Visit',
    date: 'Jan 22, 2026',
    category: 'volunteers',
    categoryLabel: 'Outreach',
    curator: {
      name: 'Saad Rehman',
      role: 'Outreach Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Beyond blood drives, our society embraces human care. Spending time with the wonderful children at Children Home (Male) Narowal brought immense joy and purpose to our volunteer delegation.',
    coverImage: '/assets/aistudio/Orphange_1_1b53f786.jpeg',
    middleImage: '/assets/aistudio/Orphange_7_49f203f9.jpeg',
    secondaryImage: '/assets/aistudio/Orphange_3_de77d3da.jpeg',
    extraCount: 4,
    location: 'Children Home (Male), Narowal',
    stats: 'Heartwarming Smiles',
    description: 'BDS UET Narowal delegation visiting Children Home (Male) Narowal, organizing arts sessions, distributing gifts, and sharing heartwarming companionship.',
    allImages: [
      {
        url: '/assets/aistudio/Orphange_1_1b53f786.jpeg',
        title: 'BDS Delegation at Children Home (Male) Narowal',
        caption: 'Full volunteer society contingent in front of the Children Home (Male) facility in Narowal.'
      },
      {
        url: '/assets/aistudio/Orphange_7_49f203f9.jpeg',
        title: 'Interactive Drawing & Learning Session',
        caption: 'Volunteers and boys drawing and coloring together during creative workshop hours.'
      },
      {
        url: '/assets/aistudio/Orphange_3_de77d3da.jpeg',
        title: 'Gift Bags & Celebration Moments',
        caption: 'Distributing personalized gift bags, stationeries, and sweet treats to the children.'
      },
      {
        url: '/assets/aistudio/Orphange_2_a46ec77f.jpeg',
        title: 'Individual Academic & Creative Mentorship',
        caption: 'Dedicated volunteer guiding a young resident with gentle encouragement.'
      },
      {
        url: '/assets/aistudio/Orphange_4_4f112be3.jpeg',
        title: 'Creative Activity Workshop',
        caption: 'Students and children gathered around the activity table for craft-making.'
      },
      {
        url: '/assets/aistudio/Orphange_5_38854b37.jpeg',
        title: 'Gift Box Package Distribution Squad',
        caption: 'Volunteers arriving with boxes packed with clothing, games, and essential items.'
      },
      {
        url: '/assets/aistudio/Orphange_6_53c37125.jpeg',
        title: 'Sharing Warmth & Respect with Seniors',
        caption: 'Volunteers spending caring, respectful time with elderly residents.'
      }
    ],
  },
  {
    id: 'album-5',
    title: 'Campus Life & Orientation Sessions',
    date: 'Oct 14, 2025',
    category: 'campus',
    categoryLabel: 'Campus Life',
    curator: {
      name: 'Fatima Noor',
      role: 'Creative & Media Head',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Welcoming the new batch to UET Narowal and showing them that true engineers build solutions for humanity. The passion in the auditorium was unforgettable.',
    coverImage: '/assets/aistudio/585345975_810742348540633_7973266104789006647_n_773140a9.jpg',
    middleImage: '/assets/aistudio/550692888_17948049033019044_5403410101318411926_n_dc476493.webp',
    secondaryImage: '/assets/aistudio/812373051_17992370016019044_974773983856486655_n_e69a4262.webp',
    extraCount: 3,
    location: 'Main Auditorium & Concourse',
    stats: '100% Student Led',
    description: 'Orientation ceremonies, campus help desks, and freshman donor onboarding across UET Narowal.',
    allImages: [
      {
        url: '/assets/aistudio/585345975_810742348540633_7973266104789006647_n_773140a9.jpg',
        title: 'Orientation Seminar in Main Auditorium',
        caption: 'Introducing new students to voluntary donation and BDS mission.'
      },
      {
        url: '/assets/aistudio/550692888_17948049033019044_5403410101318411926_n_dc476493.webp',
        title: 'Volunteer Assembly at the Campus Archways',
        caption: 'Student corps ready to respond to urgent district blood alerts.'
      },
      {
        url: '/assets/aistudio/812373051_17992370016019044_974773983856486655_n_e69a4262.webp',
        title: 'BDS Concourse Registration Desk',
        caption: 'Volunteers signing up fresh donors between classes.'
      }
    ],
  },
];
