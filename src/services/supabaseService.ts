import { supabase, checkSupabaseConnection } from '../lib/supabase';
import {
  Donor,
  BloodRequest,
  Campaign,
  CampaignRegistration,
  Volunteer,
  Article,
  SuccessStory,
  FAQItem,
  NotificationItem,
  AuditLog,
  User,
  UserRole,
  RequestStatus,
  DonorAvailability,
  VerificationStatus,
  BloodGroup,
  DonationRecord,
} from '../types';

export interface SupabaseContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'New' | 'In Review' | 'Resolved';
  resolved_by?: string;
  created_at: string;
}

export interface SupabaseEmergencyAlert {
  id: string;
  request_id?: string;
  patient_name: string;
  blood_group: BloodGroup;
  hospital: string;
  city: string;
  contact_phone: string;
  units_needed: number;
  is_active: boolean;
  broadcast_notes?: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// HELPER: Convert between DB column names (snake_case) & App Types (camelCase)
// -----------------------------------------------------------------------------

export function mapDonorFromDb(row: any): Donor {
  return {
    id: row.id,
    userId: row.user_id || '',
    name: row.name,
    email: row.email || '',
    phone: row.phone,
    bloodGroup: row.blood_group as BloodGroup,
    city: row.city || 'Narowal',
    campus: row.campus || 'UET Narowal Campus',
    area: row.area || '',
    age: Number(row.age) || 21,
    gender: (row.gender as any) || 'Male',
    lastDonationDate: row.last_donation_date || undefined,
    availabilityStatus: (row.availability_status as DonorAvailability) || 'Available',
    emergencyAvailable: Boolean(row.emergency_available),
    verificationStatus: (row.verification_status as VerificationStatus) || 'Verified',
    donationCount: Number(row.donation_count) || 0,
    willingToTravelKm: Number(row.willing_to_travel_km) || 20,
    notes: row.notes || undefined,
    studentBatch: row.student_batch || undefined,
    affiliation: row.affiliation || 'Student',
    occupation: row.occupation || undefined,
    hasDiseases: Boolean(row.has_diseases),
    diseaseDetails: row.disease_details || undefined,
    hasDonatedBefore: Boolean(row.has_donated_before),
    isPublic: row.is_public !== false,
    notificationsEnabled: row.notifications_enabled !== false,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapDonorToDb(d: Partial<Donor>): any {
  return {
    id: d.id,
    user_id: d.userId,
    name: d.name,
    email: d.email,
    phone: d.phone,
    blood_group: d.bloodGroup,
    city: d.city || 'Narowal',
    campus: d.campus || 'UET Narowal Campus',
    area: d.area,
    age: d.age,
    gender: d.gender,
    last_donation_date: d.lastDonationDate,
    availability_status: d.availabilityStatus || 'Available',
    emergency_available: d.emergencyAvailable !== false,
    verification_status: d.verificationStatus || 'Pending',
    donation_count: d.donationCount || 0,
    willing_to_travel_km: d.willingToTravelKm || 20,
    notes: d.notes,
    student_batch: d.studentBatch,
    affiliation: d.affiliation || 'Student',
    occupation: d.occupation,
    has_diseases: d.hasDiseases || false,
    disease_details: d.diseaseDetails,
    has_donated_before: d.hasDonatedBefore || false,
    is_public: d.isPublic !== false,
    notifications_enabled: d.notificationsEnabled !== false,
    updated_at: new Date().toISOString(),
  };
}

export function mapRequestFromDb(row: any): BloodRequest {
  return {
    id: row.id,
    requestCode: row.request_code,
    requesterId: row.requester_id || undefined,
    requesterName: row.requester_name,
    requesterPhone: row.requester_phone,
    alternativePhone: row.alternative_phone || undefined,
    relationshipToPatient: row.relationship_to_patient || 'Family Member',
    patientName: row.patient_name,
    patientAge: row.patient_age ? Number(row.patient_age) : undefined,
    bloodGroup: row.blood_group as BloodGroup,
    unitsRequired: Number(row.units_required) || 1,
    hospitalName: row.hospital_name,
    hospitalCity: row.hospital_city || 'Narowal',
    hospitalCampusArea: row.hospital_campus_area || undefined,
    urgency: row.urgency || 'Urgent',
    requiredDate: row.required_date,
    requiredTime: row.required_time || 'As soon as possible',
    caseDescription: row.case_description || undefined,
    status: (row.status as RequestStatus) || 'Submitted',
    assignedCoordinatorId: row.assigned_coordinator_id || undefined,
    assignedCoordinatorName: row.assigned_coordinator_name || undefined,
    matchedDonorIds: Array.isArray(row.matched_donor_ids) ? row.matched_donor_ids : [],
    confirmedDonorId: row.confirmed_donor_id || undefined,
    statusUpdates: Array.isArray(row.status_updates) ? row.status_updates : [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapRequestToDb(r: Partial<BloodRequest>): any {
  return {
    id: r.id,
    request_code: r.requestCode,
    requester_id: r.requesterId,
    requester_name: r.requesterName,
    requester_phone: r.requesterPhone,
    alternative_phone: r.alternativePhone,
    relationship_to_patient: r.relationshipToPatient,
    patient_name: r.patientName,
    patient_age: r.patientAge,
    blood_group: r.bloodGroup,
    units_required: r.unitsRequired,
    hospital_name: r.hospitalName,
    hospital_city: r.hospitalCity,
    hospital_campus_area: r.hospitalCampusArea,
    urgency: r.urgency,
    required_date: r.requiredDate,
    required_time: r.requiredTime,
    case_description: r.caseDescription,
    status: r.status,
    assigned_coordinator_id: r.assignedCoordinatorId,
    assigned_coordinator_name: r.assignedCoordinatorName,
    matched_donor_ids: r.matchedDonorIds || [],
    confirmed_donor_id: r.confirmedDonorId,
    status_updates: r.statusUpdates || [],
    updated_at: new Date().toISOString(),
  };
}

export function mapArticleFromDb(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary || '',
    content: row.content,
    readTime: row.read_time || '4 min read',
    author: row.author,
    authorRole: row.author_role || 'Contributor',
    authorEmail: row.author_email || undefined,
    authorPhone: row.author_phone || undefined,
    authorAffiliation: row.author_affiliation || undefined,
    authorVerificationNotes: row.author_verification_notes || undefined,
    authorCnicOrRoll: row.author_cnic_or_roll || undefined,
    approvalStatus: row.approval_status || 'approved',
    rejectionReason: row.rejection_reason || undefined,
    publishedDate: row.published_date,
    updatedDate: row.updated_date,
    tags: Array.isArray(row.tags) ? row.tags : [],
    featuredImage: row.featured_image || '',
    isCommunitySubmission: Boolean(row.is_community_submission),
    submittedAt: row.submitted_at || undefined,
    reviewedBy: row.reviewed_by || undefined,
    reviewedAt: row.reviewed_at || undefined,
  };
}

export function mapArticleToDb(a: Partial<Article>): any {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    summary: a.summary,
    content: a.content,
    read_time: a.readTime,
    author: a.author,
    author_role: a.authorRole,
    author_email: a.authorEmail,
    author_phone: a.authorPhone,
    author_affiliation: a.authorAffiliation,
    author_verification_notes: a.authorVerificationNotes,
    author_cnic_or_roll: a.authorCnicOrRoll,
    approval_status: a.approvalStatus,
    rejection_reason: a.rejectionReason,
    published_date: a.publishedDate,
    updated_date: a.updatedDate,
    tags: a.tags || [],
    featured_image: a.featuredImage,
    is_community_submission: a.isCommunitySubmission || false,
    submitted_at: a.submittedAt,
    reviewed_by: a.reviewedBy,
    reviewed_at: a.reviewedAt,
  };
}

export function mapCampaignFromDb(row: any): Campaign {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    date: row.date,
    startTime: row.start_time || '09:00 AM',
    endTime: row.end_time || '04:00 PM',
    venue: row.venue,
    campus: row.campus || 'UET Narowal Campus',
    city: row.city || 'Narowal',
    targetUnits: Number(row.target_units) || 100,
    collectedUnits: Number(row.collected_units) || 0,
    registeredCount: Number(row.registered_count) || 0,
    capacity: Number(row.capacity) || 150,
    status: row.status || 'Upcoming',
    featuredImage: row.featured_image || '',
    organizer: row.organizer || 'Blood Donor Society UET Narowal',
    eligibilityNotes: Array.isArray(row.eligibility_notes) ? row.eligibility_notes : [],
    timeSlots: Array.isArray(row.time_slots) ? row.time_slots : ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'],
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapCampaignToDb(c: Partial<Campaign>): any {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    date: c.date,
    start_time: c.startTime,
    end_time: c.endTime,
    venue: c.venue,
    campus: c.campus,
    city: c.city,
    target_units: c.targetUnits,
    collected_units: c.collectedUnits,
    registered_count: c.registeredCount,
    capacity: c.capacity,
    status: c.status,
    featured_image: c.featuredImage,
    organizer: c.organizer,
    eligibility_notes: c.eligibilityNotes || [],
    time_slots: c.timeSlots || [],
  };
}

// -----------------------------------------------------------------------------
// SERVICE API METHODS
// -----------------------------------------------------------------------------

export const SupabaseDataService = {
  // Test connection
  checkConnection: checkSupabaseConnection,

  // 1. AUTH & USERS
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    department?: string;
    batch?: string;
    campus?: string;
    specialId?: string;
    bloodGroup?: BloodGroup;
  }): Promise<User> {
    const userId = `u-${Date.now().toString(36)}`;
    const userRow = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      phone: userData.phone.trim(),
      role: userData.role,
      campus: userData.campus || 'UET Narowal Campus',
      department: userData.department,
      student_batch: userData.batch,
      special_id: userData.specialId,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('users').insert(userRow).select().single();
      if (error) {
        console.warn('Supabase registerUser warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase registerUser network/cache note:', err);
    }

    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      campus: userData.campus,
      department: userData.department,
      createdAt: new Date().toISOString(),
    };
  },

  async loginUser(email: string, role?: UserRole): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email.trim())
        .limit(1)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: (data.role as UserRole) || role || 'donor',
          campus: data.campus,
          department: data.department,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Supabase loginUser query note:', err);
    }
    return null;
  },

  // 2. DONORS
  async getDonors(): Promise<Donor[] | null> {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDonorFromDb);
    } catch (err) {
      return null;
    }
  },

  async saveDonor(donor: Partial<Donor>): Promise<Donor> {
    const id = donor.id || `d-${Date.now().toString(36)}`;
    const fullDonor: Donor = {
      id,
      userId: donor.userId || `u-${Date.now().toString(36)}`,
      name: donor.name || 'Anonymous Donor',
      email: donor.email || '',
      phone: donor.phone || '',
      bloodGroup: donor.bloodGroup || 'O+',
      city: donor.city || 'Narowal',
      campus: donor.campus || 'UET Narowal Campus',
      area: donor.area || 'Narowal',
      age: donor.age || 21,
      gender: donor.gender || 'Male',
      lastDonationDate: donor.lastDonationDate,
      availabilityStatus: donor.availabilityStatus || 'Available',
      emergencyAvailable: donor.emergencyAvailable !== false,
      verificationStatus: donor.verificationStatus || 'Pending',
      donationCount: donor.donationCount || 0,
      willingToTravelKm: donor.willingToTravelKm || 20,
      notes: donor.notes,
      studentBatch: donor.studentBatch,
      affiliation: donor.affiliation || 'Student',
      occupation: donor.occupation,
      hasDiseases: donor.hasDiseases || false,
      diseaseDetails: donor.diseaseDetails,
      hasDonatedBefore: donor.hasDonatedBefore || false,
      isPublic: donor.isPublic !== false,
      notificationsEnabled: donor.notificationsEnabled !== false,
      createdAt: donor.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const row = mapDonorToDb(fullDonor);
      const { error } = await supabase.from('donors').upsert(row);
      if (error) console.warn('Supabase saveDonor notice:', error.message);
    } catch (err) {
      console.warn('Supabase saveDonor network notice:', err);
    }
    return fullDonor;
  },

  async updateDonor(id: string, updates: Partial<Donor>): Promise<void> {
    try {
      const dbUpdates: any = {};
      if (updates.availabilityStatus) dbUpdates.availability_status = updates.availabilityStatus;
      if (updates.emergencyAvailable !== undefined) dbUpdates.emergency_available = updates.emergencyAvailable;
      if (updates.verificationStatus) dbUpdates.verification_status = updates.verificationStatus;
      if (updates.donationCount !== undefined) dbUpdates.donation_count = updates.donationCount;
      if (updates.lastDonationDate) dbUpdates.last_donation_date = updates.lastDonationDate;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.campus) dbUpdates.campus = updates.campus;
      if (updates.city) dbUpdates.city = updates.city;
      if (updates.area) dbUpdates.area = updates.area;
      if (updates.studentBatch) dbUpdates.student_batch = updates.studentBatch;
      if (updates.notes) dbUpdates.notes = updates.notes;
      dbUpdates.updated_at = new Date().toISOString();

      await supabase.from('donors').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateDonor error:', err);
    }
  },

  // 2.1 DONATION RECORDS
  async getDonationRecords(donorId?: string): Promise<DonationRecord[] | null> {
    try {
      let query = supabase.from('donations').select('*').order('donation_date', { ascending: false });
      if (donorId) {
        query = query.eq('donor_id', donorId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        donorId: row.donor_id,
        donationDate: row.donation_date,
        hospitalOrVenue: row.hospital_or_venue,
        donationType: row.donation_type || 'Whole Blood',
        units: Number(row.units) || 1,
        verificationStatus: row.verification_status as VerificationStatus,
        verifiedBy: row.verified_by,
        verifiedAt: row.verified_at,
        certificateId: row.certificate_id,
        notes: row.notes,
        createdAt: row.created_at,
      }));
    } catch (err) {
      return null;
    }
  },

  async saveDonationRecord(rec: Partial<DonationRecord>): Promise<DonationRecord> {
    const id = rec.id || `don-rec-${Date.now().toString(36)}`;
    const fullRec: DonationRecord = {
      id,
      donorId: rec.donorId || '',
      donationDate: rec.donationDate || new Date().toISOString().split('T')[0],
      hospitalOrVenue: rec.hospitalOrVenue || 'DHQ Hospital Narowal',
      donationType: rec.donationType || 'Whole Blood',
      units: rec.units || 1,
      verificationStatus: rec.verificationStatus || 'Pending',
      verifiedBy: rec.verifiedBy,
      verifiedAt: rec.verifiedAt,
      certificateId: rec.certificateId || `BDS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: rec.notes,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from('donations').insert({
        id: fullRec.id,
        donor_id: fullRec.donorId,
        donation_date: fullRec.donationDate,
        hospital_or_venue: fullRec.hospitalOrVenue,
        donation_type: fullRec.donationType,
        units: fullRec.units,
        verification_status: fullRec.verificationStatus,
        verified_by: fullRec.verifiedBy,
        verified_at: fullRec.verifiedAt,
        certificate_id: fullRec.certificateId,
        notes: fullRec.notes,
        created_at: fullRec.createdAt,
      });
    } catch (err) {
      console.warn('Supabase saveDonationRecord notice:', err);
    }
    return fullRec;
  },

  // 3. BLOOD REQUESTS
  async getBloodRequests(): Promise<BloodRequest[] | null> {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRequestFromDb);
    } catch (err) {
      return null;
    }
  },

  async saveBloodRequest(req: Partial<BloodRequest>): Promise<BloodRequest> {
    const id = req.id || `req-${Date.now().toString(36)}`;
    const requestCode =
      req.requestCode ||
      `BDS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const fullRequest: BloodRequest = {
      id,
      requestCode,
      requesterId: req.requesterId,
      requesterName: req.requesterName || 'Emergency Requester',
      requesterPhone: req.requesterPhone || '+92 300 0000000',
      alternativePhone: req.alternativePhone,
      relationshipToPatient: req.relationshipToPatient || 'Family Member',
      patientName: req.patientName || 'Emergency Patient',
      patientAge: req.patientAge,
      bloodGroup: req.bloodGroup || 'O+',
      unitsRequired: req.unitsRequired || 1,
      hospitalName: req.hospitalName || 'DHQ Hospital Narowal',
      hospitalCity: req.hospitalCity || 'Narowal',
      hospitalCampusArea: req.hospitalCampusArea,
      urgency: req.urgency || 'Urgent',
      requiredDate: req.requiredDate || new Date().toISOString().split('T')[0],
      requiredTime: req.requiredTime || 'As soon as possible',
      caseDescription: req.caseDescription,
      status: req.status || 'Submitted',
      assignedCoordinatorId: req.assignedCoordinatorId,
      assignedCoordinatorName: req.assignedCoordinatorName,
      matchedDonorIds: req.matchedDonorIds || [],
      confirmedDonorId: req.confirmedDonorId,
      statusUpdates: req.statusUpdates || [
        {
          id: `su-${Date.now()}`,
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: 'Emergency blood request registered into BDS system.',
          updatedBy: 'System Intake',
        },
      ],
      createdAt: req.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const row = mapRequestToDb(fullRequest);
      await supabase.from('blood_requests').upsert(row);

      // If urgent or critical, also log to emergency_alerts table
      if (fullRequest.urgency === 'Critical' || fullRequest.urgency === 'Urgent') {
        await supabase.from('emergency_alerts').upsert({
          id: `emg-${id}`,
          request_id: id,
          patient_name: fullRequest.patientName,
          blood_group: fullRequest.bloodGroup,
          hospital: fullRequest.hospitalName,
          city: fullRequest.hospitalCity,
          contact_phone: fullRequest.requesterPhone,
          units_needed: fullRequest.unitsRequired,
          is_active: true,
          broadcast_notes: `${fullRequest.urgency} request for ${fullRequest.patientName} at ${fullRequest.hospitalName}`,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Supabase saveBloodRequest notice:', err);
    }
    return fullRequest;
  },

  async updateBloodRequest(id: string, updates: Partial<BloodRequest>): Promise<void> {
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assignedCoordinatorId) dbUpdates.assigned_coordinator_id = updates.assignedCoordinatorId;
      if (updates.assignedCoordinatorName) dbUpdates.assigned_coordinator_name = updates.assignedCoordinatorName;
      if (updates.matchedDonorIds) dbUpdates.matched_donor_ids = updates.matchedDonorIds;
      if (updates.confirmedDonorId) dbUpdates.confirmed_donor_id = updates.confirmedDonorId;
      if (updates.statusUpdates) dbUpdates.status_updates = updates.statusUpdates;
      dbUpdates.updated_at = new Date().toISOString();

      await supabase.from('blood_requests').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateBloodRequest error:', err);
    }
  },

  // 4. CONTACT MESSAGES
  async submitContactMessage(msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<SupabaseContactMessage> {
    const newMsg: SupabaseContactMessage = {
      id: `msg-${Date.now().toString(36)}`,
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      subject: msg.subject,
      message: msg.message,
      status: 'New',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('contact_messages').insert({
        id: newMsg.id,
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        subject: newMsg.subject,
        message: newMsg.message,
        status: newMsg.status,
        created_at: newMsg.created_at,
      });
    } catch (err) {
      console.warn('Supabase submitContactMessage notice:', err);
    }
    return newMsg;
  },

  async getContactMessages(): Promise<SupabaseContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      return [];
    }
  },

  // 5. ARTICLES
  async getArticles(): Promise<Article[] | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapArticleFromDb);
    } catch (err) {
      return null;
    }
  },

  async saveArticle(article: Partial<Article>): Promise<Article> {
    const id = article.id || `art-${Date.now().toString(36)}`;
    const slug =
      article.slug ||
      (article.title || 'article')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${Date.now().toString(36).slice(-4)}`;

    const fullArticle: Article = {
      id,
      slug,
      title: article.title || 'Untitled Article',
      category: article.category || 'General',
      summary: article.summary || '',
      content: article.content || '',
      readTime: article.readTime || '4 min read',
      author: article.author || 'BDS Contributor',
      authorRole: article.authorRole || 'Contributor',
      authorEmail: article.authorEmail,
      authorPhone: article.authorPhone,
      authorAffiliation: article.authorAffiliation,
      authorVerificationNotes: article.authorVerificationNotes,
      authorCnicOrRoll: article.authorCnicOrRoll,
      approvalStatus: article.approvalStatus || 'approved',
      rejectionReason: article.rejectionReason,
      publishedDate: article.publishedDate || new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      tags: article.tags || ['Blood Donation', 'UET Narowal'],
      featuredImage: article.featuredImage || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&h=600&fit=crop',
      isCommunitySubmission: article.isCommunitySubmission || false,
      submittedAt: article.submittedAt,
      reviewedBy: article.reviewedBy,
      reviewedAt: article.reviewedAt,
    };

    try {
      const row = mapArticleToDb(fullArticle);
      await supabase.from('articles').upsert(row);
    } catch (err) {
      console.warn('Supabase saveArticle notice:', err);
    }
    return fullArticle;
  },

  async updateArticleStatus(id: string, status: 'approved' | 'rejected', notes?: string, reviewer?: string): Promise<void> {
    try {
      const updates: any = {
        approval_status: status,
        reviewed_by: reviewer || 'BDS Admin',
        reviewed_at: new Date().toISOString(),
      };
      if (status === 'rejected' && notes) {
        updates.rejection_reason = notes;
      }
      await supabase.from('articles').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateArticleStatus notice:', err);
    }
  },

  async deleteArticle(id: string): Promise<void> {
    try {
      await supabase.from('articles').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteArticle notice:', err);
    }
  },

  // 6. CAMPAIGNS & EVENTS
  async getCampaigns(): Promise<Campaign[] | null> {
    try {
      const { data, error } = await supabase
        .from('events_campaigns')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return (data || []).map(mapCampaignFromDb);
    } catch (err) {
      return null;
    }
  },

  async saveCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const id = campaign.id || `camp-${Date.now().toString(36)}`;
    const slug =
      campaign.slug ||
      (campaign.title || 'campaign')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString(36).slice(-4)}`;

    const fullCampaign: Campaign = {
      id,
      slug,
      title: campaign.title || 'Campus Blood Camp',
      subtitle: campaign.subtitle || 'Organized by BDS UET Narowal',
      description: campaign.description || '',
      date: campaign.date || new Date().toISOString().split('T')[0],
      startTime: campaign.startTime || '09:00 AM',
      endTime: campaign.endTime || '04:00 PM',
      venue: campaign.venue || 'Central Campus Library Foyer',
      campus: campaign.campus || 'UET Narowal Campus',
      city: campaign.city || 'Narowal',
      targetUnits: campaign.targetUnits || 100,
      collectedUnits: campaign.collectedUnits || 0,
      registeredCount: campaign.registeredCount || 0,
      capacity: campaign.capacity || 150,
      status: campaign.status || 'Upcoming',
      featuredImage: campaign.featuredImage || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&h=600&fit=crop',
      organizer: campaign.organizer || 'Blood Donor Society UET Narowal',
      eligibilityNotes: campaign.eligibilityNotes || [],
      timeSlots: campaign.timeSlots || ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'],
      createdAt: campaign.createdAt || new Date().toISOString(),
    };

    try {
      const row = mapCampaignToDb(fullCampaign);
      await supabase.from('events_campaigns').upsert(row);
    } catch (err) {
      console.warn('Supabase saveCampaign notice:', err);
    }
    return fullCampaign;
  },

  async registerForCampaign(reg: Partial<CampaignRegistration>): Promise<CampaignRegistration> {
    const id = reg.id || `reg-${Date.now().toString(36)}`;
    const registrationCode =
      reg.registrationCode ||
      `DRIVE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const fullReg: CampaignRegistration = {
      id,
      registrationCode,
      campaignId: reg.campaignId || '',
      campaignTitle: reg.campaignTitle || '',
      userName: reg.userName || '',
      userEmail: reg.userEmail || '',
      userPhone: reg.userPhone || '',
      bloodGroup: reg.bloodGroup || 'O+',
      timeSlot: reg.timeSlot || '09:00 AM - 11:00 AM',
      userCategory: reg.userCategory || 'UET Student',
      department: reg.department,
      batch: reg.batch,
      status: reg.status || 'Registered',
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from('campaign_registrations').insert({
        id: fullReg.id,
        registration_code: fullReg.registrationCode,
        campaign_id: fullReg.campaignId,
        campaign_title: fullReg.campaignTitle,
        user_name: fullReg.userName,
        user_email: fullReg.userEmail,
        user_phone: fullReg.userPhone,
        blood_group: fullReg.bloodGroup,
        time_slot: fullReg.timeSlot,
        user_category: fullReg.userCategory,
        department: fullReg.department,
        batch: fullReg.batch,
        status: fullReg.status,
        created_at: fullReg.createdAt,
      });

      // Increment campaign registered count
      if (fullReg.campaignId) {
        try {
          await supabase.rpc('increment_campaign_reg', { camp_id: fullReg.campaignId });
        } catch {
          // ignore RPC error if procedure is not registered
        }
      }
    } catch (err) {
      console.warn('Supabase registerForCampaign notice:', err);
    }
    return fullReg;
  },

  // 7. VOLUNTEERS
  async applyVolunteer(vol: Partial<Volunteer>): Promise<Volunteer> {
    const id = vol.id || `vol-${Date.now().toString(36)}`;
    const fullVol: Volunteer = {
      id,
      name: vol.name || '',
      email: vol.email || '',
      phone: vol.phone || '',
      campus: vol.campus || 'UET Narowal Campus',
      department: vol.department || '',
      batch: vol.batch || '',
      skills: vol.skills || [],
      preferredRole: vol.preferredRole || 'Campus Coordination',
      statement: vol.statement || '',
      status: 'Pending Review',
      appliedAt: new Date().toISOString(),
    };

    try {
      await supabase.from('volunteers').insert({
        id: fullVol.id,
        name: fullVol.name,
        email: fullVol.email,
        phone: fullVol.phone,
        campus: fullVol.campus,
        department: fullVol.department,
        batch: fullVol.batch,
        skills: fullVol.skills,
        preferred_role: fullVol.preferredRole,
        statement: fullVol.statement,
        status: fullVol.status,
        applied_at: fullVol.appliedAt,
      });
    } catch (err) {
      console.warn('Supabase applyVolunteer notice:', err);
    }
    return fullVol;
  },

  async updateVolunteerStatus(volId: string, status: Volunteer['status']): Promise<void> {
    try {
      await supabase.from('volunteers').update({ status }).eq('id', volId);
    } catch (err) {
      console.warn('Supabase updateVolunteerStatus notice:', err);
    }
  },

  // 8. AUDIT LOGS & NOTIFICATIONS
  async logAudit(action: string, details: string, performerName: string, performerRole: string): Promise<void> {

    try {
      await supabase.from('audit_logs').insert({
        id: `aud-${Date.now().toString(36)}`,
        action,
        details,
        performer_name: performerName,
        performer_role: performerRole,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      // Non-blocking
    }
  },

  async createNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    const fullNotif: NotificationItem = {
      id: `notif-${Date.now().toString(36)}`,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      recipientRole: notif.recipientRole,
      actionLink: notif.actionLink,
      read: false,
      timestamp: new Date().toISOString(),
    };
    try {
      await supabase.from('notifications').insert({
        id: fullNotif.id,
        user_id: fullNotif.userId,
        recipient_role: fullNotif.recipientRole,
        title: fullNotif.title,
        message: fullNotif.message,
        type: fullNotif.type,
        read: fullNotif.read,
        action_link: fullNotif.actionLink,
        timestamp: fullNotif.timestamp,
      });
    } catch (err) {
      // Non-blocking
    }
    return fullNotif;
  },
};
