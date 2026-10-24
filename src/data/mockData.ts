import {
  Donor,
  BloodRequest,
  Campaign,
  Article,
  SuccessStory,
  Testimonial,
  FAQItem,
  Volunteer,
  BloodGroup,
  AuditLog,
  NotificationItem,
  User
} from '../types';

export const COMPATIBILITY_DATA: Record<
  BloodGroup,
  {
    canGiveTo: BloodGroup[];
    canReceiveFrom: BloodGroup[];
    description: string;
    rarity: string;
  }
> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    description: 'Universal Red Blood Cell Donor. Essential for emergency rooms and trauma care when recipient blood type is unknown.',
    rarity: '~7% of population (Extremely valuable in emergencies)',
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    description: 'Most common blood group. High demand across all major surgeries, thalassemia patients, and trauma wards.',
    rarity: '~38% of population (Highest routine demand)',
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    description: 'Rare negative blood type. Vital for planned and emergency surgeries for A- and AB- patients.',
    rarity: '~6% of population',
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    description: 'Second most common blood group. Regularly needed for chemotherapy support and cardiovascular surgeries.',
    rarity: '~34% of population',
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    description: 'Rare blood type. Very important for thalassemia centers and specialized pediatric hematology units.',
    rarity: '~2% of population',
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    description: 'Very prevalent in South Asia. In continuous demand for dialysis, trauma, and maternal healthcare.',
    rarity: '~30% in South Asia (High frequency)',
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    description: 'Rarest blood type. Universal plasma donor alongside AB+.',
    rarity: '<1% of population (Rarest group)',
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    description: 'Universal Red Blood Cell Recipient. Can safely receive red blood cells from any blood group in emergencies.',
    rarity: '~3% of population',
  },
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Engr. Haris Tariq',
    email: 'president.bds@narowal.uet.edu.pk',
    phone: '+92 300 8472910',
    role: 'admin',
    campus: 'UET Narowal Campus',
    department: 'Electrical Engineering, UET Narowal',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'u-coord',
    name: 'Fatima Noor',
    email: 'coordinator.emergency@narowal.uet.edu.pk',
    phone: '+92 321 4458921',
    role: 'coordinator',
    campus: 'UET Narowal Campus',
    department: 'Computer Science, UET Narowal',
    createdAt: '2024-02-15T09:30:00Z',
  },
  {
    id: 'u-donor-1',
    name: 'Zain Ul Abideen',
    email: 'zain.abideen@student.uet.edu.pk',
    phone: '+92 312 9901842',
    role: 'donor',
    campus: 'UET Narowal Campus',
    department: 'Mechanical Engineering (UET Narowal)',
    createdAt: '2024-03-01T11:00:00Z',
  },
];

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'donor-101',
    userId: 'u-donor-1',
    name: 'Zain Ul Abideen',
    email: 'zain.abideen@student.uet.edu.pk',
    phone: '+92 312 9901842',
    bloodGroup: 'O-',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Hostel 1 / Muridke-Narowal Road',
    age: 22,
    gender: 'Male',
    lastDonationDate: '2026-04-10',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 4,
    willingToTravelKm: 15,
    studentBatch: '2022-ME',
    notificationsEnabled: true,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'donor-102',
    userId: 'u-donor-2',
    name: 'Hamza Farooq',
    email: 'hamza.farooq@student.uet.edu.pk',
    phone: '+92 333 4519208',
    bloodGroup: 'B+',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Adda Siraj / Campus Colony',
    age: 23,
    gender: 'Male',
    lastDonationDate: '2026-05-18',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 6,
    willingToTravelKm: 20,
    studentBatch: '2021-EE',
    notificationsEnabled: true,
    createdAt: '2023-11-12T14:20:00Z',
    updatedAt: '2026-08-20T08:15:00Z',
  },
  {
    id: 'donor-103',
    userId: 'u-donor-3',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@student.uet.edu.pk',
    phone: '+92 345 7712390',
    bloodGroup: 'A+',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Fatima Girls Hostel, UET Narowal',
    age: 21,
    gender: 'Female',
    lastDonationDate: '2026-02-14',
    availabilityStatus: 'Available',
    emergencyAvailable: false,
    verificationStatus: 'Verified',
    donationCount: 2,
    willingToTravelKm: 10,
    studentBatch: '2023-CS',
    notificationsEnabled: true,
    createdAt: '2024-05-02T16:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'donor-104',
    userId: 'u-donor-4',
    name: 'Bilal Ahmad',
    email: 'bilal.ahmad@student.uet.edu.pk',
    phone: '+92 301 6689021',
    bloodGroup: 'O+',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Circular Road / Narowal City',
    age: 24,
    gender: 'Male',
    lastDonationDate: '2026-06-01',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 5,
    willingToTravelKm: 25,
    studentBatch: '2021-CE',
    notificationsEnabled: true,
    createdAt: '2023-09-19T10:00:00Z',
    updatedAt: '2026-08-25T09:00:00Z',
  },
  {
    id: 'donor-105',
    userId: 'u-donor-5',
    name: 'Usman Ghani',
    email: 'usman.ghani@alumni.uet.edu.pk',
    phone: '+92 322 8114092',
    bloodGroup: 'AB-',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Zafarwal Road / Narowal Cantt',
    age: 26,
    gender: 'Male',
    lastDonationDate: '2026-03-20',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 8,
    willingToTravelKm: 30,
    studentBatch: '2019-Civil (Alumni)',
    notificationsEnabled: true,
    createdAt: '2022-04-11T13:45:00Z',
    updatedAt: '2026-08-18T14:30:00Z',
  },
  {
    id: 'donor-106',
    userId: 'u-donor-6',
    name: 'Hassan Raza',
    email: 'hassan.raza@student.uet.edu.pk',
    phone: '+92 303 9821456',
    bloodGroup: 'A-',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Iqbal Hall, UET Narowal Campus',
    age: 22,
    gender: 'Male',
    lastDonationDate: '2026-05-05',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 3,
    willingToTravelKm: 15,
    studentBatch: '2022-EE',
    notificationsEnabled: true,
    createdAt: '2024-01-22T17:10:00Z',
    updatedAt: '2026-08-22T11:00:00Z',
  },
  {
    id: 'donor-107',
    userId: 'u-donor-7',
    name: 'Muhammad Saad',
    email: 'saad.uet@gmail.com',
    phone: '+92 313 5521948',
    bloodGroup: 'B-',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Adda Siraj / University Gate',
    age: 23,
    gender: 'Male',
    lastDonationDate: '2026-01-10',
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    verificationStatus: 'Verified',
    donationCount: 4,
    willingToTravelKm: 20,
    studentBatch: '2021-EE',
    notificationsEnabled: true,
    createdAt: '2023-10-05T09:00:00Z',
    updatedAt: '2026-08-29T10:00:00Z',
  },
  {
    id: 'donor-108',
    userId: 'u-donor-8',
    name: 'Maryam Tahir',
    email: 'maryam.t@student.uet.edu.pk',
    phone: '+92 334 1109483',
    bloodGroup: 'AB+',
    city: 'Narowal',
    campus: 'UET Narowal Campus',
    area: 'Girls Hostel, UET Narowal',
    age: 20,
    gender: 'Female',
    lastDonationDate: '2026-08-01',
    availabilityStatus: 'Temporarily Ineligible',
    emergencyAvailable: false,
    verificationStatus: 'Verified',
    donationCount: 1,
    willingToTravelKm: 10,
    studentBatch: '2024-CS',
    notificationsEnabled: true,
    createdAt: '2025-02-19T15:20:00Z',
    updatedAt: '2026-08-01T12:00:00Z',
  },
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-001',
    requestCode: 'BDS-2026-EM09',
    requesterName: 'Tariq Mehmood',
    requesterPhone: '+92 300 4892147',
    alternativePhone: '+92 321 8847120',
    relationshipToPatient: 'Brother',
    patientName: 'Kashif Mehmood',
    patientAge: 34,
    bloodGroup: 'O-',
    unitsRequired: 2,
    hospitalName: 'DHQ Hospital Narowal (Emergency ICU Ward)',
    hospitalCity: 'Narowal',
    hospitalCampusArea: 'Kachehri Road / Adda Siraj',
    urgency: 'Critical',
    requiredDate: '2026-08-31',
    requiredTime: 'Immediate (Within 2 hours)',
    caseDescription: 'Post-operative major vascular hemorrhage, emergency surgery in progress. Cross-match ready.',
    status: 'Donor Search Active',
    assignedCoordinatorId: 'u-coord',
    assignedCoordinatorName: 'Fatima Noor',
    matchedDonorIds: ['donor-101'],
    statusUpdates: [
      {
        id: 'su-1',
        status: 'Submitted',
        timestamp: '2026-08-31T08:15:00Z',
        note: 'Emergency request submitted via web hotline.',
        updatedBy: 'System',
      },
      {
        id: 'su-2',
        status: 'Under Review',
        timestamp: '2026-08-31T08:20:00Z',
        note: 'Verified with DHQ Hospital Narowal blood bank incharge.',
        updatedBy: 'Fatima Noor (Coordinator)',
      },
      {
        id: 'su-3',
        status: 'Donor Search Active',
        timestamp: '2026-08-31T08:25:00Z',
        note: 'Automated notification dispatched to 3 compatible O- donors in UET Narowal.',
        updatedBy: 'Fatima Noor (Coordinator)',
      },
    ],
    createdAt: '2026-08-31T08:15:00Z',
    updatedAt: '2026-08-31T08:25:00Z',
  },
  {
    id: 'req-002',
    requestCode: 'BDS-2026-TH14',
    requesterName: 'Samina Bibi',
    requesterPhone: '+92 333 9128374',
    relationshipToPatient: 'Mother',
    patientName: 'Ali Raza',
    patientAge: 9,
    bloodGroup: 'B+',
    unitsRequired: 1,
    hospitalName: 'Sughra Shafi Medical Complex (Narowal)',
    hospitalCity: 'Narowal',
    hospitalCampusArea: 'Muridke-Narowal Road',
    urgency: 'Urgent',
    requiredDate: '2026-09-01',
    requiredTime: '10:00 AM',
    caseDescription: 'Routine monthly packed red cells transfusion for Thalassemia Major patient.',
    status: 'Donor Found',
    assignedCoordinatorId: 'u-coord',
    assignedCoordinatorName: 'Fatima Noor',
    matchedDonorIds: ['donor-102'],
    confirmedDonorId: 'donor-102',
    statusUpdates: [
      {
        id: 'su-21',
        status: 'Submitted',
        timestamp: '2026-08-30T14:00:00Z',
        note: 'Request logged for transfusion cycle.',
        updatedBy: 'System',
      },
      {
        id: 'su-22',
        status: 'Donor Search Active',
        timestamp: '2026-08-30T15:00:00Z',
        note: 'B+ regular donors notified at UET Narowal.',
        updatedBy: 'Fatima Noor (Coordinator)',
      },
      {
        id: 'su-23',
        status: 'Donor Found',
        timestamp: '2026-08-30T16:30:00Z',
        note: 'Hamza Farooq (EE UET Narowal) accepted donation call for tomorrow 10:00 AM.',
        updatedBy: 'Fatima Noor (Coordinator)',
      },
    ],
    createdAt: '2026-08-30T14:00:00Z',
    updatedAt: '2026-08-30T16:30:00Z',
  },
  {
    id: 'req-003',
    requestCode: 'BDS-2026-SG42',
    requesterName: 'Dr. Kamran Qureshi',
    requesterPhone: '+92 345 8192033',
    relationshipToPatient: 'Surgeon',
    patientName: 'Zubaida Begum',
    patientAge: 58,
    bloodGroup: 'A+',
    unitsRequired: 3,
    hospitalName: 'Christian Hospital Narowal (Surgical Ward)',
    hospitalCity: 'Narowal',
    hospitalCampusArea: 'Mission Road',
    urgency: 'Urgent',
    requiredDate: '2026-09-02',
    requiredTime: '02:00 PM',
    caseDescription: 'Scheduled orthopedic surgery, reserve units required.',
    status: 'Donor Search Active',
    assignedCoordinatorId: 'u-admin',
    assignedCoordinatorName: 'Engr. Haris Tariq',
    matchedDonorIds: ['donor-103'],
    statusUpdates: [
      {
        id: 'su-31',
        status: 'Submitted',
        timestamp: '2026-08-29T11:00:00Z',
        note: 'Hospital slip verified.',
        updatedBy: 'System',
      },
      {
        id: 'su-32',
        status: 'Donor Search Active',
        timestamp: '2026-08-29T12:00:00Z',
        note: 'Contacting UET Narowal hostel residents for donation booking.',
        updatedBy: 'Engr. Haris Tariq',
      },
    ],
    createdAt: '2026-08-29T11:00:00Z',
    updatedAt: '2026-08-29T12:00:00Z',
  },
  {
    id: 'req-004',
    requestCode: 'BDS-2026-CP88',
    requesterName: 'Adnan Siddiq',
    requesterPhone: '+92 301 7748291',
    relationshipToPatient: 'Cousin',
    patientName: 'Muhammad Arshad',
    patientAge: 45,
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: 'DHQ Hospital Narowal',
    hospitalCity: 'Narowal',
    hospitalCampusArea: 'Kachehri Road',
    urgency: 'Scheduled',
    requiredDate: '2026-08-27',
    status: 'Completed',
    assignedCoordinatorId: 'u-coord',
    assignedCoordinatorName: 'Fatima Noor',
    matchedDonorIds: ['donor-104'],
    confirmedDonorId: 'donor-104',
    statusUpdates: [
      {
        id: 'su-41',
        status: 'Submitted',
        timestamp: '2026-08-26T09:00:00Z',
        note: 'Request received.',
        updatedBy: 'System',
      },
      {
        id: 'su-42',
        status: 'Donation Confirmed',
        timestamp: '2026-08-27T10:00:00Z',
        note: '2 units collected at DHQ Narowal blood bank.',
        updatedBy: 'Fatima Noor',
      },
      {
        id: 'su-43',
        status: 'Completed',
        timestamp: '2026-08-27T14:30:00Z',
        note: 'Patient stable, transfusion successful.',
        updatedBy: 'Fatima Noor',
      },
    ],
    createdAt: '2026-08-26T09:00:00Z',
    updatedAt: '2026-08-27T14:30:00Z',
  },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    slug: 'annual-uet-narowal-blood-drive-2026',
    title: 'Annual Grand UET Narowal Blood Drive 2026',
    subtitle: 'Organized with DHQ Hospital Narowal at UET Narowal Campus Lawn',
    description:
      'The flagship blood donation mega-camp organized by BDS UET Narowal in partnership with DHQ Hospital Narowal and regional transfusion specialists. All donors receive complete free medical screening, blood group certificate, refreshments, and volunteer donor certificates.',
    date: '2026-09-15',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: 'Main Campus Lawn & Student Affairs Center',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 300,
    collectedUnits: 0,
    registeredCount: 124,
    capacity: 350,
    status: 'Upcoming',
    featuredImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Executive Council in collaboration with Directorate of Student Affairs',
    eligibilityNotes: [
      'Age between 18 and 60 years',
      'Weight minimum 50 kg (110 lbs)',
      'Hemoglobin minimum 12.5 g/dL (tested on spot)',
      'At least 90 days since last whole blood donation',
      'Free from viral infections and feeling well',
    ],
    faqs: [
      {
        question: 'Will I get an official donor certificate?',
        answer: 'Yes! Every registered donor receives an official BDS UET Narowal Certificate of Appreciation and a verified blood grouping card.',
      },
      {
        question: 'How long does the whole process take?',
        answer: 'Around 15–20 minutes including quick medical check, hemoglobin test, 8-minute donation, and recovery refreshments.',
      },
      {
        question: 'Can female students donate?',
        answer: 'Absolutely! We have dedicated, fully partitioned female screening booths staffed by qualified female doctors and nurses.',
      },
    ],
    timeSlots: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '01:30 PM - 03:30 PM', '03:30 PM - 05:00 PM'],
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'camp-2',
    slug: 'narowal-campus-thalassemia-support-drive',
    title: 'UET Narowal Thalassemia Support & Screening Drive',
    subtitle: 'Dedicated drive for regional pediatric thalassemia patients in Narowal District',
    description:
      'A dedicated emergency blood donation camp hosted at the UET Narowal Campus Auditorium Hall, raising awareness and collecting life-saving packed red blood cells for regular pediatric transfusions across Narowal.',
    date: '2026-09-24',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Auditorium Hall, Admin Block, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 180,
    collectedUnits: 0,
    registeredCount: 64,
    capacity: 200,
    status: 'Upcoming',
    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Chapter & Red Crescent Narowal',
    eligibilityNotes: [
      'Must have valid UET student or faculty ID',
      'Good physical health, properly hydrated and breakfast consumed',
      'Minimum weight 50 kg',
    ],
    timeSlots: ['10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM'],
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'camp-3',
    slug: 'narowal-winter-blood-drive',
    title: 'UET Narowal Winter Emergency Blood Drive',
    subtitle: 'Supporting DHQ Hospital & Emergency Trauma Units',
    description:
      'Serving regional emergency wards and trauma patients at DHQ Hospital Narowal and Sughra Shafi Medical Complex. Organized with strict clinical standards by certified blood bank specialists.',
    date: '2026-10-08',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    venue: 'Department of Electrical & CS Building, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 150,
    collectedUnits: 0,
    registeredCount: 38,
    capacity: 180,
    status: 'Upcoming',
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Volunteer Wing',
    eligibilityNotes: [
      'Age 18-55',
      'No antibiotics in past 48 hours',
      'Fit and well on day of donation',
    ],
    timeSlots: ['09:30 AM - 11:30 AM', '11:30 AM - 01:30 PM', '02:00 PM - 04:30 PM'],
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'camp-4',
    slug: 'cs-it-departmental-blood-drive-2026',
    title: 'Faculty of Computing & CS Blood Donation Camp',
    subtitle: 'Organized with Sughra Shafi Medical Complex at Academic Block-B Foyer',
    description:
      'Departmental donation camp hosted by BDS CS & IT Student Ambassadors. Features automated digital vitals screening, CBC analysis, thalassemia carrier testing counseling, and donor refreshment packs provided in collaboration with regional hematologists.',
    date: '2026-10-28',
    startTime: '09:30 AM',
    endTime: '04:00 PM',
    venue: 'Academic Block-B Main Foyer & Seminar Hall',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 160,
    collectedUnits: 0,
    registeredCount: 52,
    capacity: 180,
    status: 'Upcoming',
    featuredImage: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Computing Chapter & Sughra Shafi Medical Complex',
    eligibilityNotes: [
      'Open to all UET students, faculty, and university staff',
      'Minimum body weight 50 kg (110 lbs)',
      'Hemoglobin level >= 12.5 g/dL (tested on spot)',
      'At least 3 months since your last whole blood donation',
      'Free CBC and blood grouping report provided via SMS/portal',
    ],
    faqs: [
      {
        question: 'Do I get a certificate of participation?',
        answer: 'Yes, all donors receive an authenticated digital Certificate of Social Service from BDS UET Narowal.',
      },
      {
        question: 'Are first-time donors guided through the process?',
        answer: 'Our medical team and student volunteers accompany first-time donors every step of the way.',
      },
    ],
    timeSlots: ['09:30 AM - 11:30 AM', '11:30 AM - 01:30 PM', '02:00 PM - 04:00 PM'],
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'camp-5',
    slug: 'narowal-district-youth-emergency-drive',
    title: 'Narowal District Youth & Red Crescent Emergency Drive',
    subtitle: 'Mass voluntary donation drive supporting DHQ Hospital Trauma Ward & Maternal Care',
    description:
      'Joint campus-wide humanitarian initiative uniting UET Narowal engineering departments, alumni network, and Pakistan Red Crescent Narowal chapter to build emergency platelet and whole blood reserves for regional maternal and trauma emergencies.',
    date: '2026-11-14',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: 'Sports Complex Gymnasium & Medical Wing',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 220,
    collectedUnits: 0,
    registeredCount: 86,
    capacity: 250,
    status: 'Upcoming',
    featuredImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Blood Donor Society UET Narowal in collaboration with Pakistan Red Crescent & Narowal Health Authority',
    eligibilityNotes: [
      'Age 18 to 60 with CNIC or university roll number',
      'Good physical health with normal blood pressure (checked on arrival)',
      'Well hydrated with breakfast or lunch completed 1-2 hours prior',
      'No active dental surgery or heavy medication in past 72 hours',
    ],
    faqs: [
      {
        question: 'Can community residents outside UET attend?',
        answer: 'Yes! Narowal district residents, university alumni, and local youth are warmly welcome at the Sports Complex entrance.',
      },
      {
        question: 'What refreshments are provided?',
        answer: 'Fresh juices, energy biscuits, dates, and bottled mineral water are provided in the post-donation recovery lounge.',
      },
    ],
    timeSlots: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '01:30 PM - 03:30 PM', '03:30 PM - 05:00 PM'],
    createdAt: '2026-08-22T14:00:00Z',
  },
  {
    id: 'camp-past-1',
    slug: 'spring-campus-blood-camp-2026',
    title: 'UET Narowal Spring Mega Blood Camp 2026',
    subtitle: 'Organized with Red Crescent Narowal at Student Center',
    description:
      'A record-breaking semester blood donation drive collecting 240 units for thalassemia warriors and local trauma centers. Attended by faculty, deans, and hundreds of student donors.',
    date: '2026-03-20',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: 'Main Auditorium Hall, Admin Block, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 200,
    collectedUnits: 240,
    registeredCount: 260,
    capacity: 250,
    status: 'Completed',
    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Executive Council',
    eligibilityNotes: ['Concluded with 100% safety and zero deferrals.'],
    timeSlots: ['09:00 AM - 01:00 PM', '01:30 PM - 05:00 PM'],
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'camp-past-2',
    slug: 'world-blood-donor-day-camp-2026',
    title: 'World Blood Donor Day Commemorative Camp',
    subtitle: 'Celebrating voluntary blood donors across Narowal district',
    description:
      'Celebrated on campus with guest pediatricians from DHQ Hospital Narowal. 185 units collected along with voluntary screening and donor appreciation medals.',
    date: '2026-06-14',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Mechanical Engineering Department Lawn, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 150,
    collectedUnits: 185,
    registeredCount: 210,
    capacity: 200,
    status: 'Completed',
    featuredImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal in collaboration with DHQ Narowal',
    eligibilityNotes: ['Concluded successfully with certified blood bank team.'],
    timeSlots: ['10:00 AM - 01:00 PM', '01:30 PM - 04:00 PM'],
    createdAt: '2026-05-15T09:00:00Z',
  },
  {
    id: 'camp-past-3',
    slug: 'freshers-orientation-blood-drive',
    title: 'Freshers Orientation Blood Awareness & Screening Camp',
    subtitle: 'Welcoming the incoming batch of engineering students',
    description:
      'Orientation week awareness booth and voluntary typing camp. Over 300 students tested for their blood group with 120 voluntary units safely donated.',
    date: '2025-11-12',
    startTime: '09:00 AM',
    endTime: '04:30 PM',
    venue: 'CS & Electrical Block Main Lobby, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 100,
    collectedUnits: 120,
    registeredCount: 140,
    capacity: 150,
    status: 'Completed',
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Outreach Wing',
    eligibilityNotes: ['Concluded with high first-time donor participation.'],
    timeSlots: ['09:00 AM - 12:00 PM', '01:00 PM - 04:30 PM'],
    createdAt: '2025-10-20T11:00:00Z',
  },
  {
    id: 'camp-past-4',
    slug: 'emergency-trauma-relief-blood-drive-2025',
    title: 'District Emergency Trauma Relief Blood Drive',
    subtitle: 'Joint Initiative with Rescue 1122 Narowal & District Emergency Service',
    description:
      'A rapid-response emergency replenishment drive organized to restock regional blood reserves for accident and trauma victims in Narowal District.',
    date: '2025-08-19',
    startTime: '08:30 AM',
    endTime: '04:00 PM',
    venue: 'Civil Engineering Ground & Seminar Hall, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 160,
    collectedUnits: 178,
    registeredCount: 195,
    capacity: 200,
    status: 'Completed',
    featuredImage: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal in collaboration with Rescue 1122',
    eligibilityNotes: ['Completed successfully with 178 life-saving bags delivered directly to emergency wards.'],
    timeSlots: ['08:30 AM - 12:00 PM', '01:00 PM - 04:00 PM'],
    createdAt: '2025-07-25T08:00:00Z',
  },
  {
    id: 'camp-past-5',
    slug: 'narowal-hostelites-solidarity-camp-2025',
    title: 'All-Hostels Solidarity Blood Donation Drive',
    subtitle: 'Organized by Fatima Hall & Iqbal Hall Resident Councils',
    description:
      'An enthusiastic evening donation drive across UET Narowal residential hostels supporting regional pediatric thalassemia patients at Sughra Shafi Medical Complex.',
    date: '2025-05-18',
    startTime: '04:00 PM',
    endTime: '10:00 PM',
    venue: 'Hostel Complex Common Hall, UET Narowal',
    campus: 'UET Narowal Campus',
    city: 'Narowal',
    targetUnits: 130,
    collectedUnits: 142,
    registeredCount: 160,
    capacity: 170,
    status: 'Completed',
    featuredImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BDS UET Narowal Residential Wings',
    eligibilityNotes: ['Concluded with outstanding student volunteer turnout and midnight refreshment camp.'],
    timeSlots: ['04:00 PM - 07:00 PM', '07:30 PM - 10:00 PM'],
    createdAt: '2025-04-20T14:00:00Z',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'who-can-donate-blood-complete-eligibility-guide',
    title: 'Who Can Donate Blood? Complete Eligibility & Health Checklist',
    category: 'Eligibility',
    summary:
      'Everything you need to know about age, weight, hemoglobin levels, medical conditions, and window periods before donating whole blood.',
    content: `
### Fundamental Eligibility Criteria

Donating blood is safe and simple for healthy adults. Blood donation standards ensure the maximum safety of both the donor and the recipient.

#### 1. General Requirements
- **Age:** Between 18 and 60 years old (regular donors may donate up to 65 years with medical clearance).
- **Weight:** Minimum 50 kg (110 lbs).
- **Hemoglobin Level:** Minimum 12.5 g/dL for females and 13.0 g/dL for males. A painless drop-test is performed on-site in 15 seconds.
- **Pulse & Blood Pressure:** Pulse between 60–100 bpm; blood pressure within healthy clinical range (Systolic 100–140 mmHg, Diastolic 60–90 mmHg).

#### 2. Waiting Intervals Between Donations
- **Whole Blood:** Minimum 90 days (3 months) for males and 120 days (4 months) for females to allow iron reserves to replenish fully.
- **Platelets (Apheresis):** Every 14 days, up to 24 times per year.

#### 3. Temporary Deferral Conditions
You should postpone your donation if:
- You have had a cold, fever, or sore throat within the last 7 days.
- You have taken dental treatments or antibiotics in the last 48–72 hours.
- You have received a major tattoo or piercing within the last 6 months.
- You are pregnant or currently breastfeeding.

*Medical Notice: Final clinical eligibility is always confirmed through an on-site physical evaluation by certified blood bank professionals.*
    `,
    readTime: '4 min read',
    author: 'Dr. Shahbaz Khalid',
    authorRole: 'Consultant Hematologist & BDS UET Medical Advisor',
    publishedDate: '2026-08-10',
    updatedDate: '2026-08-28',
    tags: ['Eligibility', 'Health Check', 'Guidelines', 'Safety'],
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'art-2',
    slug: 'what-to-do-before-during-and-after-donating-blood',
    title: 'What to Do Before, During, and After Donating Blood',
    category: 'Health & Safety',
    summary:
      'A practical step-by-step preparation guide for first-time donors to guarantee a smooth, comfortable, and energetic experience.',
    content: `
### Step-by-Step Donor Preparation Guide

### Before Your Donation
1. **Hydrate Generously:** Drink an extra 2–3 glasses of water or fresh juice 2 hours before your appointment. Well-hydrated veins make donation swift and easy.
2. **Eat a Balanced Meal:** Never donate on an empty stomach. Have a wholesome breakfast or lunch rich in complex carbohydrates and iron 1–2 hours beforehand. Avoid greasy foods.
3. **Get Rest:** Aim for 7–8 hours of uninterrupted sleep the night before.
4. **Wear Comfortable Clothes:** Choose a shirt with loose sleeves that can easily be rolled up past your elbow.

### During Donation (8–10 Minutes)
- Relax in the reclined donor chair. Breathe naturally.
- Squeeze the foam stress ball rhythmically as instructed by the phlebotomist.
- Inform the staff immediately if you feel lightheaded, warm, or dizzy.

### After Donation & Recovery
- Rest in the recovery lounge for 10–15 minutes while enjoying juice and biscuits.
- Keep the bandage on for at least 4 hours.
- Avoid strenuous weightlifting, intense gym workouts, or running for the rest of the day.
- Drink extra fluids over the next 24 hours.
    `,
    readTime: '3 min read',
    author: 'Fatima Noor',
    authorRole: 'BDS UET Senior Emergency Coordinator',
    publishedDate: '2026-07-22',
    updatedDate: '2026-08-15',
    tags: ['Preparation', 'Recovery', 'First Time Donors'],
    featuredImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'art-3',
    slug: 'debunking-common-blood-donation-myths',
    title: 'Debunking Common Blood Donation Myths: Science vs Fiction',
    category: 'Science & Myths',
    summary:
      'Does donating blood make you weak? Can you catch infections? We dismantle widespread misconceptions with medical facts.',
    content: `
### Common Myths vs Medical Reality

#### Myth 1: "Donating blood makes you permanently weak or sick."
**Fact:** The adult human body contains approximately 4.5 to 5.5 liters of blood. A single standard donation takes only 450 ml (less than 10% of total volume). Your body replaces the liquid plasma within 24–48 hours and completely renews all red blood cells within weeks. Regular donors often have lower risks of cardiovascular buildup.

#### Myth 2: "I can contract infections during donation."
**Fact:** Impossible at accredited blood banks. BDS UET mandates that every single needle, blood collection bag, and swab is 100% sterile, factory-sealed, used once, and safely incinerated in medical bio-waste bins immediately after.

#### Myth 3: "Blood donation takes several hours."
**Fact:** The actual blood drawing takes only 6 to 10 minutes. The rest of the visit involves brief registration, a rapid finger-prick hemoglobin check, and relaxing with refreshments.

#### Myth 4: "People taking everyday medications can never donate."
**Fact:** Many medications like common antihistamines, birth control, or mild blood pressure regulators do not disqualify you once evaluated by on-site doctors.
    `,
    readTime: '4 min read',
    author: 'Engr. Haris Tariq',
    authorRole: 'President BDS UET',
    publishedDate: '2026-06-18',
    updatedDate: '2026-08-20',
    tags: ['Myths', 'Facts', 'Science', 'Awareness'],
    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'art-4',
    slug: 'how-emergency-blood-requests-work-in-pakistan',
    title: 'How Emergency Blood Coordination Works When Every Minute Matters',
    category: 'Emergency Guide',
    summary:
      'An inside look at the verified rapid-response workflow of BDS UET during critical surgeries, trauma cases, and rare blood needs.',
    content: `
### Behind the Scenes: BDS Emergency Dispatch Protocol

When a family faces a critical medical emergency in Lahore or surrounding Punjab districts, finding matching donors within hours is often life-saving.

1. **Intake & Triage:** Requests submitted to BDS UET are assigned an immediate urgency rank (Critical, Urgent, Scheduled) based on surgical timeline, platelet count, and cross-match readiness.
2. **Hospital & Prescription Verification:** Coordinators confirm the patient's admission, ward location, and blood requisition slip with the attending hospital blood bank.
3. **Geo-Targeted Donor Matching:** The BDS UET platform filters active, verified donors residing within close radius of the hospital whose last donation was >90 days ago.
4. **Direct Volunteer Dispatch:** Coordinators connect with the donor directly, facilitating transport, cross-match, and hospital coordination while keeping the family updated in real-time.
    `,
    readTime: '5 min read',
    author: 'Usman Ghani',
    authorRole: 'Executive Blood Coordinator',
    publishedDate: '2026-08-01',
    updatedDate: '2026-08-25',
    tags: ['Emergency', 'Workflow', 'Hospitals', 'BDS Process'],
    featuredImage: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1000&q=80',
    approvalStatus: 'approved',
  },
  {
    id: 'art-5',
    slug: 'why-is-blood-donation-important-lifesaving-impact',
    title: 'Why is Blood Donation Important? The Lifesaving Science & Real-World Impact',
    category: 'Health & Safety',
    summary:
      'A single blood donation takes just 10 minutes but can save up to 3 human lives. Discover the biological necessity, the Thalassemia crisis in Pakistan, and the surprising health benefits for donors.',
    content: `
### Why Blood Donation is Truly a Matter of Life and Death

Blood is the very essence of human vitality. Despite tremendous advancements in modern biotechnology and synthetic pharmacology, **blood cannot be manufactured in any laboratory or chemical factory**. Every single drop required to sustain a human life during a crisis must come exclusively from another human being who generously chooses to donate.

Here is the medical science and humanitarian urgency behind why voluntary blood donation is indispensable.

---

### 1. One Single Donation Can Save Up to 3 Lives
When you donate whole blood (approximately 450 to 500 ml), hospital blood banks process and centrifuge it into three distinct, life-saving therapeutic components:
- **Packed Red Blood Cells (PRBCs):** Carries oxygen to organs; vital for massive trauma casualties, surgical hemorrhage, and severe chronic anemia.
- **Platelets (Thrombocytes):** Critical for blood clotting; indispensable for acute leukemia and cancer patients undergoing chemotherapy, as well as severe dengue hemorrhagic fever cases.
- **Fresh Frozen Plasma (FFP) & Cryoprecipitate:** Rich in coagulation factors and immunoglobulins; used for severe burn victims, massive transfusions, and hemophilia patients.

By dedicating only 15 minutes of your day, your single gift branches out to safeguard up to three separate individuals and their families.

---

### 2. The Thalassemia Crisis in Pakistan
Pakistan bears one of the highest burdens of Thalassemia Major in the world, with over **100,000 registered pediatric patients** and thousands of new carrier infants diagnosed each year:
- Children suffering from Beta-Thalassemia cannot produce functioning adult hemoglobin.
- Without **regular, safe blood transfusions every 15 to 25 days**, they suffer severe bone deformities, organ failure, and premature death.
- A single Thalassemia child requires between 20 to 30 blood units every year of their life.
- Because paid blood selling is unsafe and illegal, only altruistic voluntary campus donors from societies like BDS UET provide a reliable, screened shield of life for institutions like Sundas Foundation and Fatimid Foundation.

---

### 3. Emergency Trauma, Complicated Childbirth & Intensive Care
- **Trauma & Road Incidents:** Pakistan's major highway and urban emergency wards handle hundreds of trauma cases daily. A single severe road accident victim may require 4 to 10 blood units within the first 60 minutes.
- **Maternal Mortality Prevention:** Post-partum hemorrhage (PPH) during complex childbirth remains a leading cause of maternal mortality in developing regions. Immediate availability of cross-matched blood saves mothers and prevents tragic newborn orphaning.
- **Major Surgical Procedures:** Complex cardiovascular bypass surgeries, organ transplants, and orthopedic reconstructions cannot initiate without pre-arranged blood reserves standing by.

---

### 4. Direct Clinical Health Benefits for the Donor
Altruism also yields tangible health benefits for your own physiology:
- **Free Multi-Point Health Screening:** Before donation, you receive a free clinical checkup of your hemoglobin level, blood pressure, resting pulse, and confidential lab screening for Hepatitis B, Hepatitis C, HIV, Syphilis, and Malaria.
- **Stimulates Hematopoiesis (Fresh Blood Regeneration):** Removing 450 ml triggers your bone marrow to actively synthesize young, healthy red blood cells within 48 to 72 hours, optimizing cellular oxygen transport.
- **Balances Iron Stores (Reduces Cardiovascular Strain):** Excess iron accumulation (hemochromatosis) can accelerate arterial oxidative stress and lipid oxidation. Routine blood donation safely maintains optimal iron balance, which clinical studies link to reduced heart disease risks.
- **Emotional Well-being & Mental Health:** Research indicates that voluntary acts of charity stimulate dopamine and oxytocin production, providing a profound sense of purpose, community connection, and reduced depressive feelings.

---

### 5. Why Regular Voluntary Donors Are the Gold Standard
Voluntary, non-remunerated donors are statistically the safest donors. Unlike replacement donors coerced under acute family distress or illegal commercial sellers who may conceal high-risk lifestyle factors, voluntary student donors give out of pure social responsibility, ensuring blood products of the utmost clinical purity and reliability.
    `,
    readTime: '6 min read',
    author: 'Dr. Shahbaz Khalid & BDS Medical Advisory Board',
    authorRole: 'Consultant Hematologist & BDS UET Advisor',
    publishedDate: '2026-09-15',
    updatedDate: '2026-10-01',
    tags: ['Importance', 'Lifesaving Impact', 'Thalassemia', 'Health Benefits', 'Clinical Science'],
    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'approved',
  },
  {
    id: 'art-6',
    slug: 'blood-donation-for-thalassemia-patients-lifeline-guide',
    title: 'Blood Donation for Thalassemia Children: Understanding Pakistan\'s Greatest Pediatric Need',
    category: 'Thalassemia Care',
    summary:
      'Over 100,000 children in Pakistan rely on safe, voluntary blood transfusions every 2 to 3 weeks. Learn how regular donors keep them smiling, healthy, and going to school.',
    content: `
### Supporting the Resilient Warriors of Thalassemia Major

Beta Thalassemia is an inherited blood disorder characterized by impaired or absent production of hemoglobin beta chains. In Pakistan, high rates of cousin marriages and limited pre-marital screening have led to widespread prevalence.

### The Transfusion Regimen
Children with Thalassemia Major usually manifest severe anemia within their first year of life:
- Their bone marrow struggles to produce healthy red blood cells, causing pale complexion, poor weight gain, and enlarged spleens.
- To survive and thrive normally, they must receive **washed, leukodepleted packed red blood cells every 15 to 21 days**.
- In addition to blood, they undergo nightly subcutaneous iron chelation infusions to remove excess iron deposited in the heart and liver.

### How BDS UET Supports Thalassemia Centers
BDS UET partners closely with recognized non-profit blood transfusions centers:
1. **Sundas Foundation (Lahore, Gujranwala, Faisalabad)**
2. **Fatimid Foundation (Lahore & Regional Centers)**
3. **Children\'s Hospital Hematology Oncology Units**

Every university student who adopts a quarterly donation schedule effectively sponsors a child\'s complete school term of transfusions.
    `,
    readTime: '5 min read',
    author: 'Dr. Zainab Akhtar',
    authorRole: 'Pediatric Hematology Specialist',
    publishedDate: '2026-09-20',
    updatedDate: '2026-10-05',
    tags: ['Thalassemia', 'Pediatric Care', 'Sundas Foundation', 'Lifeline'],
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'approved',
  },
  {
    id: 'art-7',
    slug: 'dietary-guide-to-boost-hemoglobin-before-donation',
    title: 'Dietary Guide to Boost Hemoglobin & Iron Levels Naturally',
    category: 'Eligibility',
    summary:
      'Were you deferred due to low hemoglobin? Here is a practical, evidence-based nutritional guide to boost your red blood cell count using affordable, accessible Pakistani foods.',
    content: `
### Overcoming Mild Anemia & Preparing for Donation

Hemoglobin is the iron-rich protein in red blood cells that transports oxygen from your lungs to the rest of your body. BDS UET requires a minimum of **12.5 g/dL for females** and **13.0 g/dL for males** before donating whole blood.

### 1. High-Bioavailability Iron Foods
Incorporate these traditional, accessible foods into your daily meals:
- **Lentils & Legumes (Daal, Chana, Lobia):** Excellent vegetarian source of non-heme iron and plant protein.
- **Dark Leafy Greens (Palak, Saag, Methi):** Abundant in folic acid and iron.
- **Dates (Khajoor) & Pomegranate (Anaar):** Traditional powerhouses rich in elemental iron, antioxidants, and minerals.
- **Lean Meat, Liver (Kaleji), and Eggs:** Heme-iron from poultry and organ meats is absorbed 2 to 3 times more efficiently than plant iron.

### 2. Pair Iron with Vitamin C (The Absorption Secret)
Plant-based non-heme iron requires an acidic gastric environment for optimal absorption:
- Squeeze fresh lemon juice over your cooked lentils and vegetables.
- Consume oranges, guavas (amrood), or fresh amla with your meals.

### 3. Avoid Iron Inhibitors During Meals
- **Chai & Green Tea:** Polyphenols and tannins in black or green tea bind to dietary iron and block up to 60% of its absorption. Wait at least 60 to 90 minutes after eating before drinking tea.
- **Calcium Supplements or Heavy Milk:** High doses of calcium compete with iron absorption; space them between meals.
    `,
    readTime: '4 min read',
    author: 'Nutritionist Mariam Tariq',
    authorRole: 'Clinical Dietitian & BDS Health Contributor',
    publishedDate: '2026-09-28',
    updatedDate: '2026-10-08',
    tags: ['Nutrition', 'Hemoglobin', 'Diet', 'Health Prep'],
    featuredImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'approved',
  },
  {
    id: 'art-8',
    slug: 'platelet-apheresis-sdp-oncology-dengue-rescue',
    title: 'Platelet Apheresis: How Single Donor Platelets (SDP) Rescue Oncology and Dengue Patients',
    category: 'Medical Science',
    summary:
      'An advanced guide explaining the clinical differences between Random Donor Platelets (RDP) and Single Donor Platelets (SDP), and why dedicated apheresis donors are vital during monsoon dengue surges.',
    content: `
### The Power of Apheresis: High-Concentration Cell Separation

During extreme dengue outbreaks or intense chemotherapy protocols for childhood leukemia, a patient\'s platelet count can plummet from a healthy 150,000–400,000/μL down to hazardous single digits (<10,000/μL), risking internal spontaneous hemorrhage.

### What is Apheresis?
Unlike whole blood donation where all components are drawn together:
1. The donor is connected to an automated cell-separator machine via a sterile closed-loop system.
2. Blood is withdrawn, spun at high RPM to separate the platelet and plasma layer, and the red blood cells are safely returned to the donor.
3. A single apheresis session yields the equivalent of **6 to 8 Random Donor Platelet (RDP) bags**, drastically minimizing recipient exposure to multiple foreign donor antibodies.

### Who Can Become an Apheresis Hero?
Donors must have a baseline platelet count > 200,000/μL and good venous access. Because red blood cells are returned, donors can donate platelets as frequently as every 14 days!
    `,
    readTime: '5 min read',
    author: 'Dr. Ayesha Munir',
    authorRole: 'Postgraduate Resident, Hematology',
    authorEmail: 'ayesha.munir.md@gmail.com',
    authorPhone: '+92 301 4455890',
    authorAffiliation: 'Services Hospital Lahore / BDS Alum',
    authorVerificationNotes: 'PMDC Reg #98412-P. BDS UET Batch 2019 Alumna. Verified clinical doctor at Services Hospital hematology unit.',
    authorCnicOrRoll: 'PMDC: 98412-P / Roll: 2019-BDS-08',
    publishedDate: '2026-10-14',
    updatedDate: '2026-10-14',
    tags: ['Platelets', 'Apheresis', 'Dengue', 'Oncology', 'Clinical'],
    featuredImage: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'pending',
    isCommunitySubmission: true,
    submittedAt: '2026-10-14T10:30:00Z',
  },
  {
    id: 'art-pre-donation',
    slug: 'pre-donation-checklist-preparation-protocol',
    title: 'Pre-Donation Guide & 24-Hour Checklist: Prepare for a Smooth Donation',
    category: 'Pre-Donation',
    summary:
      'The comprehensive 24-hour preparation checklist: hydration guidelines, iron-rich nutrition, restful sleep, medications to disclose, and required student/CNIC documents.',
    content: `
### The Complete Pre-Donation Checklist

Preparing your body before giving blood ensures a smooth donation, prevents lightheadedness, and optimizes recipient blood product quality.

#### 1. 24 Hours Before: Hydration is Key
- Drink at least 500ml to 1 liter of extra water, fresh juice, or electrolyte fluids.
- Well-hydrated blood vessels are fuller and more pliable, making vein access comfortable and rapid.
- Avoid excessive caffeine or dehydrating sugary energy drinks.

#### 2. 3 to 4 Hours Before: Wholesome Nutrition
- Never donate blood on an empty stomach.
- Eat a balanced meal rich in complex carbohydrates and iron (e.g., lentils, eggs, whole wheat roti, chicken, spinach, dates).
- Steer clear of high-fat, greasy fast food, as excess lipids can cloud blood plasma testing.

#### 3. The Night Before: Rest & Sleep
- Get 7 to 8 hours of restful, uninterrupted sleep.
- Being well-rested stabilizes blood pressure and heart rate during initial medical screening.

#### 4. What to Bring with You
- Official CNIC or UET Student ID card.
- A list of any regular medications you take (most common medications like vitamins, mild allergy relief, or thyroid supplements do not defer you).
- Wear a comfortable loose-fitting shirt with sleeves that easily roll up past your elbow.
    `,
    readTime: '4 min read',
    author: 'Dr. Shahbaz Khalid',
    authorRole: 'Consultant Hematologist & BDS UET Medical Advisor',
    publishedDate: '2026-10-01',
    updatedDate: '2026-10-15',
    tags: ['Pre-Donation', 'Preparation', 'Checklist', 'Hydration', 'Nutrition'],
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'approved',
  },
  {
    id: 'art-post-donation',
    slug: 'post-donation-care-rapid-recovery-protocol',
    title: 'Post-Donation Care & Rapid Recovery Protocol: Best Practices',
    category: 'Post-Donation',
    summary:
      'Essential aftercare guidance: refreshment lounge protocol, fluid replenishment, bandage care, managing slight dizziness, and physical activity precautions for the first 24 hours.',
    content: `
### Post-Donation Care & Recovery Protocol

Congratulations on saving lives! Your body replaces the fluid volume of your donation within 24–48 hours. Follow these simple steps for quick recovery.

#### 1. Immediate Post-Donation (First 15 Minutes)
- Rest in the donor refreshment area for at least 10–15 minutes before standing up.
- Drink juice or oral rehydration fluids and eat the provided biscuits/fruits.
- If you feel lightheaded or warm, sit down immediately, place your head between your knees, or alert a BDS volunteer.

#### 2. First 4 to 6 Hours: Bandage & Arm Care
- Keep the sterile adhesive bandage on your venipuncture site for at least 4 to 5 hours.
- Keep the site clean and dry.
- If bleeding reoccurs, raise your arm above your heart and apply firm pressure with a clean cloth for 5 minutes.

#### 3. Rest of the Day: Activity & Hydration
- Drink an additional 4 glasses of fluids throughout the day.
- Avoid heavy weightlifting, intense gym workouts, running, or pushing heavy loads for 24 hours.
- Avoid hot showers or prolonged direct sun exposure immediately after donating.
- Eat nourishing, nutrient-dense meals with protein, leafy greens, and iron.
    `,
    readTime: '3 min read',
    author: 'Fatima Noor',
    authorRole: 'BDS Senior Emergency Coordinator',
    publishedDate: '2026-10-02',
    updatedDate: '2026-10-16',
    tags: ['Post-Donation', 'Recovery', 'Aftercare', 'Safety'],
    featuredImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    approvalStatus: 'approved',
  },
];

export const INITIAL_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    title: 'Midnight O-Negative Dispatch Saves Young Mother at DHQ Hospital Narowal',
    patientReference: 'Zainab, 28-year-old mother (Emergency C-Section)',
    bloodGroup: 'O-',
    hospital: 'DHQ Hospital Narowal (Obstetrics Ward)',
    story:
      'At 1:15 AM on a rainy Thursday night, BDS UET Narowal received a critical call from the emergency blood bank at DHQ Hospital Narowal. A post-partum hemorrhage required 2 units of rare O-negative blood within 90 minutes. BDS UET automated alert reached Zain Ul Abideen (student staying at UET Narowal Hostel). Zain rushed to the hospital, completed screening by 2:00 AM, and the transfusion stabilized the patient.',
    donorQuote: '"Receiving that midnight alert made me realize how a 20-minute commitment can literally keep a mother alive. I am proud to be part of BDS UET Narowal."',
    recipientQuote: '"We were desperately running between blood banks in Narowal with no O- in stock. The BDS student arrived like a blessing in the middle of the night."',
    date: 'August 2026',
    unitsProvided: 2,
    category: 'Maternal Care',
  },
  {
    id: 'story-2',
    title: 'Supporting 8-Year-Old Rayan Through Continuous Transfusions in Narowal',
    patientReference: 'Rayan, Thalassemia Major patient',
    bloodGroup: 'B+',
    hospital: 'Sughra Shafi Medical Complex Narowal',
    story:
      'Rayan requires 2 bags of fresh washed packed red cells every 21 days. BDS UET Narowal paired his family with a dedicated student cohort of regular B+ donors from UET Narowal Computer Science and Electrical Engineering departments who rotate predictably, eliminating the monthly panic for his parents.',
    donorQuote: '"Knowing Rayan can attend school normally in Narowal because our rotation works is the most rewarding feeling in university life."',
    recipientQuote: '"BDS UET Narowal took away the constant nightmare of hunting for blood every three weeks."',
    date: 'Ongoing (2024–2026)',
    unitsProvided: 18,
    category: 'Thalassemia Support',
  },
  {
    id: 'story-3',
    title: 'Rapid Trauma Response After Muridke-Narowal Road Accident',
    patientReference: 'Rashid Khan, 42-year-old road accident victim',
    bloodGroup: 'A+',
    hospital: 'DHQ Hospital Narowal (Trauma Center)',
    story:
      'Multiple trauma fractures and internal bleeding required 3 units of A+ whole blood and platelets before immediate surgery. Two BDS UET Narowal student donors arrived at the blood bank within 35 minutes.',
    donorQuote: '"The coordination was seamless. We were met by the BDS student liaison right at the DHQ Hospital Narowal blood bank counter."',
    recipientQuote: '"The doctors said the timely availability of cross-matched blood in Narowal was the decisive factor."',
    date: 'July 2026',
    unitsProvided: 3,
    category: 'Emergency Trauma',
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Prof. Dr. Asim Lone',
    role: 'Campus Medical Incharge',
    quote:
      'BDS UET Narowal is the most active and impactful student welfare society at UET Narowal Campus. Their discipline, ethical donor management, and prompt emergency response have saved countless lives across Narowal district.',
    avatarBg: 'bg-emerald-700',
    date: '2026',
  },
  {
    id: 'test-2',
    name: 'Bilal Ahmad (CE 21)',
    role: 'Student Donor',
    bloodGroup: 'O+',
    quote:
      'I have donated 5 times through BDS UET Narowal camps and emergency calls. The process is completely transparent, painless, and professionally managed.',
    avatarBg: 'bg-[#B4232C]',
    date: '2026',
  },
  {
    id: 'test-3',
    name: 'Mrs. Parveen Akhtar',
    role: 'Patient Family',
    bloodGroup: 'AB-',
    quote:
      'Finding AB- blood in Narowal within 3 hours felt impossible until we reached out to the BDS UET Narowal helpline. A coordinator connected us immediately with a verified student donor.',
    avatarBg: 'bg-indigo-700',
    date: '2026',
  },
  {
    id: 'test-4',
    name: 'Ali Shair',
    role: 'President — Blood Donor Society (BDS), UET',
    quote:
      'Pakeeza did an excellent job understanding our requirements and turning our ideas into a professional and user-friendly website for BDS UET. What stood out was her willingness to take feedback, solve problems, and continuously improve the project. Her dedication and attention to detail made a real difference.',
    avatarBg: 'bg-[#B47E3A]',
    date: '2026',
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I submit an emergency blood request in Narowal?',
    answer:
      'Click "Emergency Blood Request" or "Need Blood" in the navigation. Fill out patient details, hospital name (e.g. DHQ Hospital Narowal, Sughra Shafi Complex), units, and blood group. A unique Request ID is generated, and on-duty BDS UET Narowal coordinators match nearby available donors immediately.',
    category: 'Requesting Blood',
  },
  {
    id: 'faq-2',
    question: 'How can I register as a blood donor at UET Narowal?',
    answer:
      'Click "Become a Donor" and complete registration with your blood group, department, contact number, and last donation date. Once verified, you will receive notifications only when someone in Narowal needs help.',
    category: 'Donating Blood',
  },
  {
    id: 'faq-3',
    question: 'Is donor registration and blood coordination free?',
    answer:
      'Yes, 100% free! BDS UET Narowal is a non-profit, student-run humanitarian society. We strictly prohibit any monetary transactions for blood.',
    category: 'General',
  },
  {
    id: 'faq-4',
    question: 'How are my personal contact details protected?',
    answer:
      'We practice Privacy by Design. Your personal phone number, hostel room, and email are never displayed publicly on the website. Requesters and coordinators initiate contact requests through our verified coordination desk.',
    category: 'General',
  },
  {
    id: 'faq-5',
    question: 'How frequently can I donate blood?',
    answer:
      'Healthy male donors can donate whole blood every 90 days (3 months), and female donors every 120 days (4 months). The human body rapidly replaces fluids in 24-48 hours.',
    category: 'Eligibility',
  },
  {
    id: 'faq-6',
    question: 'Can I temporarily pause emergency notifications?',
    answer:
      'Yes! From your Donor Dashboard, you can toggle your status between "Available" and "Unavailable" anytime or adjust your emergency call preferences with a single click.',
    category: 'Donating Blood',
  },
  {
    id: 'faq-7',
    question: 'Does BDS UET Narowal replace hospital blood banks?',
    answer:
      'No. BDS UET Narowal is a donor recruitment and volunteer coordination network. Blood collection, screening, cross-matching, and transfusions are always executed in authorized hospital blood banks like DHQ Hospital Narowal.',
    category: 'General',
  },
  {
    id: 'faq-8',
    question: 'How can UET Narowal students join as volunteers?',
    answer:
      'Visit our "Volunteers" page and fill out the volunteer application form. We recruit team members across Blood Drive Operations, Emergency Dispatch, Awareness Campaigns, Media, and Technical Development each semester.',
    category: 'Volunteering',
  },
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Muhammad Rehan',
    email: 'rehan.ee@narowal.uet.edu.pk',
    phone: '+92 300 1234567',
    campus: 'UET Narowal Campus',
    department: 'Electrical Engineering',
    batch: '2023',
    skills: ['Hospital Coordination', 'First Aid', 'Public Relations'],
    preferredRole: 'Emergency Dispatch & Hospital Liaison',
    statement: 'Passionate about organizing blood camps at UET Narowal and ensuring no emergency request goes unanswered.',
    status: 'Approved',
    appliedAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'vol-2',
    name: 'Anum Zahra',
    email: 'anum.cs@narowal.uet.edu.pk',
    phone: '+92 321 7654321',
    campus: 'UET Narowal Campus',
    department: 'Computer Science',
    batch: '2024',
    skills: ['Web Design', 'Social Media', 'Data Management'],
    preferredRole: 'Media & Awareness Wing',
    statement: 'Eager to build impactful awareness posters and manage digital campaigns for BDS UET Narowal.',
    status: 'Pending Review',
    appliedAt: '2026-08-28T14:30:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'EMERGENCY_DISPATCH_TRIGGERED',
    details: 'Emergency alert dispatched to 3 O- donors for Request BDS-2026-EM09 at DHQ Hospital Narowal.',
    performerName: 'Fatima Noor',
    performerRole: 'coordinator',
    timestamp: '2026-08-31T08:25:00Z',
    targetId: 'req-001',
  },
  {
    id: 'log-2',
    action: 'DONOR_VERIFIED',
    details: 'Donor Zain Ul Abideen (ID: donor-101) student credentials verified against UET Narowal LMS.',
    performerName: 'Engr. Haris Tariq',
    performerRole: 'admin',
    timestamp: '2026-08-20T10:00:00Z',
    targetId: 'donor-101',
  },
  {
    id: 'log-3',
    action: 'CAMPAIGN_PUBLISHED',
    details: 'Annual Grand UET Narowal Blood Drive 2026 event published with capacity of 350 donors.',
    performerName: 'Engr. Haris Tariq',
    performerRole: 'admin',
    timestamp: '2026-08-01T10:00:00Z',
    targetId: 'camp-1',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Critical Emergency: O- Blood Needed at DHQ Hospital Narowal',
    message: '2 units required for post-surgery patient. Nearby UET Narowal compatible donors alerted.',
    type: 'emergency',
    read: false,
    actionLink: 'track-request',
    timestamp: '2026-08-31T08:15:00Z',
  },
  {
    id: 'notif-2',
    title: 'Upcoming Campaign: Grand UET Narowal Blood Drive',
    message: 'Registration is open for Annual Blood Drive at UET Narowal Main Lawn (Sept 15).',
    type: 'campaign',
    read: false,
    actionLink: 'campaigns',
    timestamp: '2026-08-30T10:00:00Z',
  },
  {
    id: 'notif-3',
    title: 'Donation Completed: BDS-2026-CP88',
    message: '2 units successfully transferred at DHQ Hospital Narowal. Thank you to our donors!',
    type: 'match',
    read: true,
    actionLink: 'stories',
    timestamp: '2026-08-27T15:00:00Z',
  },
];

export const UET_CAMPUSES = [
  'UET Narowal Campus',
  'UET Narowal (Computer Science Dept)',
  'UET Narowal (Electrical Engg Dept)',
  'UET Narowal (Mechanical Engg Dept)',
  'UET Narowal (Civil Engg Dept)',
  'UET Narowal (Biomedical & Basic Sciences)',
];

export const MAJOR_HOSPITALS = [
  'DHQ Hospital Narowal',
  'Sughra Shafi Medical Complex (Narowal)',
  'Christian Hospital Narowal',
  'Fatima Memorial Hospital Clinic Narowal',
  'THQ Hospital Zafarwal (Narowal)',
  'THQ Hospital Shakargarh (Narowal)',
  'Red Crescent Blood Center Narowal',
  'Al-Rehman Blood Bank Narowal',
];
