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
    image: '/assets/aistudio/Blood_screening_2_079b9e9a.jpeg',
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
    image: '/assets/aistudio/Thalasemia_5_fdf8fbc4.jpeg',
    location: 'University Main Boulevard',
    date: 'May 2025',
    description: 'University administration, faculty deans, and hundreds of passionate engineering students marching with banners to advocate for thalassemia screening and blood equity.',
    stats: '500+ Walkers',
    aspect: 'wide'
  },
  {
    id: 'gal-4',
    title: 'Kashif Iqbal Thalassemia Care Pre-Screening Counter',
    category: 'camps',
    categoryLabel: 'Registration & Screening',
    image: '/assets/aistudio/Blood_screening_1_0b693c2f.jpeg',
    location: 'Auditorium Foyer, UET Narowal',
    date: 'March 2026',
    description: 'Clinical medical staff conducting donor screening, vital checks, and arm examination under the "Get Tested NOW!" campaign.',
    stats: '280+ Registrations',
    aspect: 'wide'
  },
  {
    id: 'gal-5',
    title: 'Kashif Iqbal Thalassemia Care Registration Desk',
    category: 'camps',
    categoryLabel: 'Pre-Screening & Intake',
    image: '/assets/aistudio/Thalasemia_3_9a767eea.jpeg',
    location: 'Central Screening Bay, UET Narowal',
    date: 'March 2026',
    description: 'Student volunteers and medical staff managing donor intake and sample test-tube serialization racks.',
    stats: '320+ Screened',
    aspect: 'wide'
  },
  {
    id: 'gal-6',
    title: 'Disease Free UET 3.0 Campaign Walk',
    category: 'rallies',
    categoryLabel: 'Awareness Walk',
    image: '/assets/aistudio/Thalasemia_2_4ab689f8.jpeg',
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
    image: '/assets/aistudio/Orphange_1_1e9e275f.jpeg',
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
    image: '/assets/aistudio/Help_Desk_2_d232fdfd.jpeg',
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
    image: '/assets/aistudio/Thalasemia_4_c79fba4e.jpeg',
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
    image: '/assets/aistudio/Thalasemia_1_635b3d26.jpeg',
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
    image: '/assets/aistudio/Orphange_4_a18d044b.jpeg',
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
    image: '/assets/aistudio/Orphange_3_8a14051f.jpeg',
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
    image: '/assets/aistudio/Orphange_2_7ddc3e98.jpeg',
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
    image: '/assets/aistudio/Orphange_6_c5a6440e.jpeg',
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
    coverImage: '/assets/aistudio/Blood_screening_1_0b693c2f.jpeg',
    middleImage: '/assets/aistudio/Blood_screening_2_079b9e9a.jpeg',
    secondaryImage: '/assets/aistudio/Blood_screening_3_ef087934.jpeg',
    extraCount: 2,
    location: 'Main Auditorium, UET Narowal',
    stats: '280+ Bags Collected',
    description: 'Our annual blood donation camp arranged with District Headquarter Hospital and Kashif Iqbal Thalassemia Care Centre.',
    allImages: [
      {
        url: '/assets/aistudio/Blood_screening_1_0b693c2f.jpeg',
        title: 'Kashif Iqbal Thalassemia Care Pre-Screening Desk',
        caption: 'Medical staff conducting initial donor screening and arm check under "Get Tested NOW!" campaign.'
      },
      {
        url: '/assets/aistudio/Blood_screening_2_079b9e9a.jpeg',
        title: 'Clinical Phlebotomy & Sample Drawing',
        caption: 'Phlebotomist collecting donor blood sample safely with sterile tourniquet.'
      },
      {
        url: '/assets/aistudio/Blood_screening_3_ef087934.jpeg',
        title: 'Hemoglobin Agglutination & Blood Grouping Test',
        caption: 'Laboratory technician testing blood groups and hemoglobin levels on antigen testing cards.'
      },
      {
        url: '/assets/aistudio/Blood_Screening_4_fbf5da61.jpeg',
        title: 'Rapid Finger-Prick Screening',
        caption: 'Medical technician performing sterile capillary blood test for rapid health assessment.'
      },
      {
        url: '/assets/aistudio/Blood_Screening_5_bcc17977.jpeg',
        title: 'Microscopic Slide Sample Preparation',
        caption: 'Student volunteer preparing blood smear slide and testing plate with capillary tubes.'
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
    coverImage: '/assets/aistudio/Thalasemia_5_fdf8fbc4.jpeg',
    middleImage: '/assets/aistudio/Thalasemia_2_4ab689f8.jpeg',
    secondaryImage: '/assets/aistudio/Thalasemia_1_635b3d26.jpeg',
    extraCount: 2,
    location: 'University Main Boulevard',
    stats: '600+ Walkers',
    description: 'Campus-wide awareness march joining administration, faculty members, and student societies for regional health equity.',
    allImages: [
      {
        url: '/assets/aistudio/Thalasemia_5_fdf8fbc4.jpeg',
        title: 'International Thalassemia Day Main Boulevard Walk',
        caption: 'Faculty deans, leadership, and hundreds of students march across campus boulevard with banners advocating thalassemia awareness and prevention.'
      },
      {
        url: '/assets/aistudio/Thalasemia_2_4ab689f8.jpeg',
        title: 'Disease-Free UET 3.0 Grand Concourse Rally',
        caption: 'Student coordinators, volunteers, and faculty assemble on the campus steps holding campaign banners for regional health equity.'
      },
      {
        url: '/assets/aistudio/Thalasemia_1_635b3d26.jpeg',
        title: 'Thalassemia Day Awareness March & Placards',
        caption: 'Students raising placards: "Get Tested Before Marriage", "Stop Thalassaemia", and "Protect Future Generation".'
      },
      {
        url: '/assets/aistudio/Thalasemia_4_c79fba4e.jpeg',
        title: 'Disease-Free UET 3.0 Recognition Ceremony',
        caption: 'Auditorium stage ceremony awarding shields and certificates of merit to coordinators and society leaders.'
      },
      {
        url: '/assets/aistudio/Thalasemia_3_9a767eea.jpeg',
        title: 'Kashif Iqbal Thalassemia Care Registration Desk',
        caption: 'BDS student volunteers managing the screening intake desk and blood sampling test-tube racks with partner care center.'
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
    coverImage: '/assets/aistudio/Orphange_1_1e9e275f.jpeg',
    middleImage: '/assets/aistudio/Orphange_3_8a14051f.jpeg',
    secondaryImage: '/assets/aistudio/Orphange_4_a18d044b.jpeg',
    extraCount: 3,
    location: 'Children Home (Male), Narowal',
    stats: 'Heartwarming Smiles',
    description: 'BDS UET Narowal delegation visiting Children Home (Male) Narowal, organizing arts sessions, distributing gifts, and sharing heartwarming companionship.',
    allImages: [
      {
        url: '/assets/aistudio/Orphange_1_1e9e275f.jpeg',
        title: 'BDS Delegation at Children Home (Male) Narowal',
        caption: 'Full volunteer society contingent in front of the Children Home (Male) facility in Narowal.'
      },
      {
        url: '/assets/aistudio/Orphange_3_8a14051f.jpeg',
        title: 'Gift Bags & Celebration Moments',
        caption: 'Distributing personalized gift bags, stationeries, and sweet treats to the children.'
      },
      {
        url: '/assets/aistudio/Orphange_4_a18d044b.jpeg',
        title: 'Creative Activity Workshop',
        caption: 'Students and children gathered around the activity table for craft-making and drawing.'
      },
      {
        url: '/assets/aistudio/Orphange_2_7ddc3e98.jpeg',
        title: 'Individual Academic & Creative Mentorship',
        caption: 'Dedicated volunteer guiding a young resident with gentle encouragement.'
      },
      {
        url: '/assets/aistudio/Orphange_5_91c1b6c7.jpeg',
        title: 'Gift Box Package Distribution Squad',
        caption: 'Volunteers arriving with boxes packed with gifts, sports gear, and essential items.'
      },
      {
        url: '/assets/aistudio/Orphange_6_c5a6440e.jpeg',
        title: 'Sharing Warmth & Respect with Seniors',
        caption: 'Volunteers spending caring, respectful time with elderly residents.'
      }
    ],
  },
  {
    id: 'album-5',
    title: 'BDS Help Desk & Campus Life Sessions',
    date: 'Oct 14, 2025',
    category: 'campus',
    categoryLabel: 'Campus Life',
    curator: {
      name: 'Fatima Noor',
      role: 'Creative & Media Head',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    journalNote: 'Welcoming the new batch to UET Narowal and showing them that true engineers build solutions for humanity. The passion at the help desk and concourse was unforgettable.',
    coverImage: '/assets/aistudio/Help_Desk_1_1e19cff6.jpeg',
    middleImage: '/assets/aistudio/Help_Desk_2_d232fdfd.jpeg',
    secondaryImage: '/assets/aistudio/Help_Desk_3_96719314.jpeg',
    extraCount: 1,
    location: 'Main Auditorium & Concourse',
    stats: '100% Student Led',
    description: 'BDS Help Desk 2025, campus awareness counters, and freshman donor onboarding across UET Narowal.',
    allImages: [
      {
        url: '/assets/aistudio/Help_Desk_1_1e19cff6.jpeg',
        title: 'BDS Help Desk 2025 Volunteer Contingent',
        caption: 'Executive team and volunteer corps stationed at the campus archways with welcome standees and registration counters.'
      },
      {
        url: '/assets/aistudio/Help_Desk_2_d232fdfd.jpeg',
        title: 'Help Desk Day 2 Student Registration Counter',
        caption: 'Student coordinators guiding fresh recruits, answering blood donation questions, and logging donor pledges on campus.'
      },
      {
        url: '/assets/aistudio/Help_Desk_3_96719314.jpeg',
        title: 'Indoor Donor Intake & Eligibility Station',
        caption: 'Volunteers recording student donor profiles and managing intake paperwork beneath the BDS society insignia.'
      },
      {
        url: '/assets/aistudio/Help_Desk_4_20fa81bc.jpeg',
        title: 'Screening Camp 2K25 Campus Concourse Crowd',
        caption: 'Hundreds of students gathering at the main concourse to participate in voluntary blood screening and awareness sessions.'
      }
    ],
  },
];
