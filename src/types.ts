export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Scheduled';

export type RequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Donor Search Active'
  | 'Donor Found'
  | 'Donation Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Expired';

export type DonorAvailability =
  | 'Available'
  | 'Busy'
  | 'On Break'
  | 'Emergency On-Call'
  | 'Unavailable'
  | 'Temporarily Ineligible';

export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export type UserRole = 'guest' | 'donor' | 'requester' | 'coordinator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  campus?: string;
  department?: string;
  avatarUrl?: string;
  donorProfileId?: string;
  donorId?: string; // Unique Donor ID e.g. BDS-DNR-101
  specialId?: string;
  verificationStatus?: VerificationStatus;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string;
  hospitalOrVenue: string;
  donationType: 'Whole Blood' | 'Platelets' | 'Plasma' | 'Packed Red Cells' | string;
  units: number;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  certificateId?: string;
  notes?: string;
  createdAt?: string;
}

export type DonorAffiliation = 'Student' | 'Faculty' | 'Alumni' | 'Citizen';

export interface Donor {
  id: string;
  donorId?: string; // Unique Donor ID e.g. BDS-DNR-101
  userId: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  campus: string; // e.g. "UET Narowal Campus", "Narowal City (General Public)"
  area: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastDonationDate?: string; // YYYY-MM-DD
  availabilityStatus: DonorAvailability;
  emergencyAvailable: boolean;
  verificationStatus: VerificationStatus;
  donationCount: number;
  willingToTravelKm: number;
  notes?: string;
  studentBatch?: string;
  affiliation?: DonorAffiliation;
  occupation?: string;
  hasDiseases?: boolean;
  diseaseDetails?: string;
  hasDonatedBefore?: boolean;
  isPublic?: boolean; // true = listed on public Find Donor page; false = private/confidential
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  requestCode: string; // e.g. BDS-2026-X801
  requesterId?: string;
  requesterName: string;
  requesterPhone: string;
  alternativePhone?: string;
  relationshipToPatient: string;
  patientName: string;
  patientAge?: number;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalCity: string;
  hospitalCampusArea?: string;
  urgency: UrgencyLevel;
  requiredDate: string; // YYYY-MM-DD
  requiredTime?: string;
  caseDescription?: string;
  status: RequestStatus;
  assignedCoordinatorId?: string;
  assignedCoordinatorName?: string;
  matchedDonorIds: string[];
  confirmedDonorId?: string;
  statusUpdates: RequestStatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface RequestStatusUpdate {
  id: string;
  status: RequestStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface DonorMatch {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  matchScore: number;
  status: 'Pending Contact' | 'Contacted' | 'Accepted' | 'Declined' | 'Completed';
  contactedAt?: string;
  responseAt?: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  campus: string;
  city: string;
  targetUnits: number;
  collectedUnits: number;
  registeredCount: number;
  capacity: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  featuredImage: string;
  organizer: string;
  eligibilityNotes: string[];
  faqs?: { question: string; answer: string }[];
  timeSlots: string[];
  createdAt: string;
}

export interface CampaignRegistration {
  id: string;
  registrationCode: string;
  campaignId: string;
  campaignTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bloodGroup: BloodGroup;
  timeSlot: string;
  userCategory: 'UET Student' | 'UET Faculty / Staff' | 'UET Alumni' | 'Community Member';
  department?: string;
  batch?: string;
  status: 'Registered' | 'Checked In' | 'Donated' | 'Cancelled';
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  department: string;
  batch: string;
  skills: string[];
  preferredRole: string;
  statement: string;
  status: 'Pending Review' | 'Approved' | 'Active Coordinator' | 'Rejected';
  appliedAt: string;
}

export type ArticleApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  author: string;
  authorRole: string;
  authorEmail?: string;
  authorPhone?: string;
  authorAffiliation?: string;
  authorVerificationNotes?: string;
  authorCnicOrRoll?: string;
  approvalStatus?: ArticleApprovalStatus;
  rejectionReason?: string;
  publishedDate: string;
  updatedDate: string;
  tags: string[];
  featuredImage: string;
  isCommunitySubmission?: boolean;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  patientReference: string; // anonymized e.g. "Ahmed, 8-year-old Thalassemia patient"
  bloodGroup: BloodGroup;
  hospital: string;
  story: string;
  donorQuote?: string;
  recipientQuote?: string;
  date: string;
  unitsProvided: number;
  category: 'Emergency Trauma' | 'Thalassemia Support' | 'Surgical Case' | 'Maternal Care';
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Donor' | 'Patient Family' | 'Volunteer' | 'Campus Doctor' | 'Campus Medical Incharge' | 'Student Donor' | string;
  quote: string;
  bloodGroup?: BloodGroup;
  avatarBg: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Donating Blood' | 'Requesting Blood' | 'Eligibility' | 'Volunteering';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  recipientRole?: UserRole;
  title: string;
  message: string;
  type: 'emergency' | 'match' | 'campaign' | 'system' | 'reminder';
  read: boolean;
  actionLink?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performerName: string;
  performerRole: string;
  timestamp: string;
  targetId?: string;
  ipAddress?: string;
}

export const UET_CAMPUSES = [
  'UET Narowal Campus',
  'UET Narowal (Computer Science Dept)',
  'UET Narowal (Electrical Engg Dept)',
  'UET Narowal (Mechanical Engg Dept)',
  'UET Narowal (Civil Engg Dept)',
  'UET Narowal (Biomedical & Basic Sciences)',
  'Narowal City & District (General Public)',
  'Surrounding Areas / External Donor',
] as const;

export const MAJOR_HOSPITALS = [
  'DHQ Hospital (Narowal)',
  'Sughra Shafi Medical Complex (Narowal)',
  'Christian Hospital Narowal',
  'Fatima Memorial Hospital Clinic Narowal',
  'THQ Hospital Zafarwal (Narowal)',
  'THQ Hospital Shakargarh (Narowal)',
  'Red Crescent Blood Center Narowal',
] as const;

