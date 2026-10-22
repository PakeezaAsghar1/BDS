import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  BloodGroup,
  BloodRequest,
  Donor,
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
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_CAMPAIGNS,
  INITIAL_ARTICLES,
  INITIAL_STORIES,
  INITIAL_FAQS,
  INITIAL_VOLUNTEERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  COMPATIBILITY_DATA,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  currentPage: string;
  selectedRequestId: string | null;
  selectedCampaignSlug: string | null;
  selectedArticleSlug: string | null;
  donors: Donor[];
  requests: BloodRequest[];
  campaigns: Campaign[];
  campaignRegistrations: CampaignRegistration[];
  volunteers: Volunteer[];
  articles: Article[];
  stories: SuccessStory[];
  faqs: FAQItem[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  unreadNotificationCount: number;
  
  // Navigation
  navigate: (page: string, params?: { requestId?: string; campaignSlug?: string; articleSlug?: string }) => void;
  switchUserRole: (role: UserRole) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Actions
  addBloodRequest: (reqData: Partial<BloodRequest>) => Promise<BloodRequest>;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, note: string) => void;
  assignCoordinator: (requestId: string, coordinatorId: string, coordinatorName: string) => void;
  matchDonorsToRequest: (requestId: string, donorIds: string[]) => void;
  confirmDonation: (requestId: string, donorId: string, note?: string) => void;
  
  addDonor: (donorData: Partial<Donor>) => Promise<Donor>;
  toggleDonorAvailability: (donorId: string, status: DonorAvailability) => void;
  toggleDonorEmergency: (donorId: string, emergencyAvailable: boolean) => void;
  verifyDonor: (donorId: string, status: VerificationStatus) => void;
  
  registerForCampaign: (regData: Partial<CampaignRegistration>) => Promise<CampaignRegistration>;
  createCampaign: (campData: Partial<Campaign>) => Promise<Campaign>;
  applyAsVolunteer: (volData: Partial<Volunteer>) => Promise<Volunteer>;
  updateVolunteerStatus: (volId: string, status: Volunteer['status']) => void;

  submitArticle: (articleData: Partial<Article>) => Promise<Article>;
  approveArticle: (articleId: string, reviewerNotes?: string) => void;
  rejectArticle: (articleId: string, reason: string) => void;
  deleteArticle: (articleId: string) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  
  getCompatibleDonorsForRequest: (req: BloodRequest) => Donor[];
  stats: {
    totalDonors: number;
    activeRequests: number;
    completedDonations: number;
    upcomingCampaigns: number;
    criticalRequestsCount: number;
    verifiedDonorsCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DONORS: 'bds_uet_donors_v1',
  REQUESTS: 'bds_uet_requests_v1',
  CAMPAIGNS: 'bds_uet_campaigns_v1',
  REGISTRATIONS: 'bds_uet_registrations_v1',
  VOLUNTEERS: 'bds_uet_volunteers_v1',
  NOTIFICATIONS: 'bds_uet_notifications_v1',
  AUDIT_LOGS: 'bds_uet_audit_logs_v1',
  ROLE: 'bds_uet_current_role_v1',
  ARTICLES: 'bds_uet_articles_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default to seeds
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'guest';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedRole = (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'guest';
    if (savedRole === 'admin') return INITIAL_USERS[0];
    if (savedRole === 'coordinator') return INITIAL_USERS[1];
    if (savedRole === 'donor') return INITIAL_USERS[2];
    return null;
  });
  
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string | null>(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DONORS);
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (!saved) return INITIAL_CAMPAIGNS;
    try {
      const parsed: Campaign[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((c) => c.id));
      const missingInitial = INITIAL_CAMPAIGNS.filter((c) => !existingIds.has(c.id));
      return missingInitial.length > 0 ? [...parsed, ...missingInitial] : parsed;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [campaignRegistrations, setCampaignRegistrations] = useState<CampaignRegistration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (saved) {
      try {
        const parsed: Article[] = JSON.parse(saved);
        const existingSlugs = new Set(parsed.map((a) => a.slug));
        const missing = INITIAL_ARTICLES.filter((a) => !existingSlugs.has(a.slug));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_ARTICLES;
      }
    }
    return INITIAL_ARTICLES;
  });
  const [stories] = useState<SuccessStory[]>(INITIAL_STORIES);
  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(campaignRegistrations));
  }, [campaignRegistrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  // Toast system
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add audit log entry
  const recordAudit = (action: string, details: string, targetId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      performerName: currentUser ? currentUser.name : 'Public User / Guest',
      performerRole: currentRole,
      timestamp: new Date().toISOString(),
      targetId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add in-app notification
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...notif,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Navigation
  const navigate = (
    page: string,
    params?: { requestId?: string; campaignSlug?: string; articleSlug?: string }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    if (params?.requestId) setSelectedRequestId(params.requestId);
    if (params?.campaignSlug) setSelectedCampaignSlug(params.campaignSlug);
    if (params?.articleSlug) setSelectedArticleSlug(params.articleSlug);
  };

  // Switch role helper for demonstration & access
  const switchUserRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin') {
      setCurrentUser(INITIAL_USERS[0]);
      showToast('Admin Mode Active', 'Switched to BDS UET President & Admin Console.', 'info');
    } else if (role === 'coordinator') {
      setCurrentUser(INITIAL_USERS[1]);
      showToast('Coordinator Mode Active', 'Logged in as Emergency Blood Coordinator.', 'info');
    } else if (role === 'donor') {
      setCurrentUser(INITIAL_USERS[2]);
      showToast('Donor Portal Active', 'Logged in as Registered Donor (Zain Ul Abideen).', 'info');
    } else {
      setCurrentUser(null);
      showToast('Guest Visitor', 'Browsing public view as guest visitor.', 'info');
    }
  };

  // Add blood request
  const addBloodRequest = async (reqData: Partial<BloodRequest>): Promise<BloodRequest> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestCode = `BDS-2026-${reqData.urgency === 'Critical' ? 'EM' : 'REQ'}${randomSuffix}`;
    const newReq: BloodRequest = {
      id: `req-${Date.now()}`,
      requestCode,
      requesterName: reqData.requesterName || 'Anonymous Requester',
      requesterPhone: reqData.requesterPhone || '',
      alternativePhone: reqData.alternativePhone,
      relationshipToPatient: reqData.relationshipToPatient || 'Relative',
      patientName: reqData.patientName || 'Patient',
      patientAge: reqData.patientAge,
      bloodGroup: reqData.bloodGroup || 'O+',
      unitsRequired: reqData.unitsRequired || 1,
      hospitalName: reqData.hospitalName || 'DHQ Hospital Narowal',
      hospitalCity: reqData.hospitalCity || 'Narowal',
      hospitalCampusArea: reqData.hospitalCampusArea,
      urgency: reqData.urgency || 'Urgent',
      requiredDate: reqData.requiredDate || new Date().toISOString().split('T')[0],
      requiredTime: reqData.requiredTime || 'As soon as possible',
      caseDescription: reqData.caseDescription,
      status: reqData.urgency === 'Critical' ? 'Donor Search Active' : 'Submitted',
      matchedDonorIds: [],
      statusUpdates: [
        {
          id: `su-${Date.now()}`,
          status: reqData.urgency === 'Critical' ? 'Donor Search Active' : 'Submitted',
          timestamp: new Date().toISOString(),
          note:
            reqData.urgency === 'Critical'
              ? 'Critical emergency logged. High-priority donor alert broadcasted.'
              : 'Blood request registered successfully. Under verification by BDS coordinators.',
          updatedBy: 'System',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // Record audit and notification
    recordAudit('BLOOD_REQUEST_SUBMITTED', `New ${newReq.urgency} request ${newReq.requestCode} for ${newReq.bloodGroup} at ${newReq.hospitalName}`, newReq.id);
    
    addNotification({
      title: `${newReq.urgency.toUpperCase()}: ${newReq.bloodGroup} Blood Request`,
      message: `${newReq.unitsRequired} unit(s) requested for ${newReq.patientName} at ${newReq.hospitalName}. (Code: ${newReq.requestCode})`,
      type: newReq.urgency === 'Critical' ? 'emergency' : 'system',
      actionLink: 'track-request',
    });

    showToast(
      'Request Submitted',
      `Request ID ${requestCode} generated! Our coordination team is searching for donors.`,
      'success'
    );

    return newReq;
  };

  // Update request status
  const updateRequestStatus = (requestId: string, newStatus: RequestStatus, note: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated: BloodRequest = {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            statusUpdates: [
              {
                id: `su-${Date.now()}`,
                status: newStatus,
                timestamp: new Date().toISOString(),
                note,
                updatedBy: currentUser ? `${currentUser.name} (${currentRole})` : 'Coordinator',
              },
              ...r.statusUpdates,
            ],
          };
          return updated;
        }
        return r;
      })
    );

    recordAudit('REQUEST_STATUS_UPDATED', `Request ${requestId} status updated to ${newStatus}. Note: ${note}`, requestId);
    showToast('Status Updated', `Request status changed to ${newStatus}`, 'success');
  };

  // Assign coordinator
  const assignCoordinator = (requestId: string, coordinatorId: string, coordinatorName: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, assignedCoordinatorId: coordinatorId, assignedCoordinatorName: coordinatorName } : r))
    );
    recordAudit('COORDINATOR_ASSIGNED', `Assigned ${coordinatorName} to request ${requestId}`, requestId);
    showToast('Coordinator Assigned', `${coordinatorName} is now leading this blood case.`, 'info');
  };

  // Match donors
  const matchDonorsToRequest = (requestId: string, donorIds: string[]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, matchedDonorIds: Array.from(new Set([...r.matchedDonorIds, ...donorIds])), status: 'Donor Search Active' } : r))
    );
    recordAudit('DONORS_DISPATCHED', `Dispatched notification to ${donorIds.length} eligible donors for request ${requestId}`, requestId);
    showToast('Donors Alerted', `${donorIds.length} donors contacted via WhatsApp / SMS dispatch queue.`, 'success');
  };

  // Confirm donation
  const confirmDonation = (requestId: string, donorId: string, note?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Completed',
              confirmedDonorId: donorId,
              statusUpdates: [
                {
                  id: `su-${Date.now()}`,
                  status: 'Completed',
                  timestamp: new Date().toISOString(),
                  note: note || `Donation successfully completed by verified donor.`,
                  updatedBy: currentUser ? currentUser.name : 'Coordinator',
                },
                ...r.statusUpdates,
              ],
            }
          : r
      )
    );

    // Update donor donation count & last donation date
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? {
              ...d,
              donationCount: d.donationCount + 1,
              lastDonationDate: new Date().toISOString().split('T')[0],
              availabilityStatus: 'Temporarily Ineligible',
            }
          : d
      )
    );

    recordAudit('DONATION_CONFIRMED', `Donation completed for request ${requestId} by donor ${donorId}`, requestId);
    showToast('Donation Completed!', 'Life-saving blood donation recorded successfully.', 'success');
  };

  // Add donor
  const addDonor = async (donorData: Partial<Donor>): Promise<Donor> => {
    const newDonor: Donor = {
      id: `donor-${Date.now()}`,
      userId: currentUser ? currentUser.id : `u-${Date.now()}`,
      name: donorData.name || 'Anonymous Donor',
      email: donorData.email || '',
      phone: donorData.phone || '',
      bloodGroup: donorData.bloodGroup || 'O+',
      city: donorData.city || 'Narowal',
      campus: donorData.campus || 'UET Narowal Campus',
      area: donorData.area || 'Narowal City / District',
      age: donorData.age || 21,
      gender: donorData.gender || 'Male',
      lastDonationDate: donorData.lastDonationDate,
      availabilityStatus: 'Available',
      emergencyAvailable: donorData.emergencyAvailable ?? true,
      verificationStatus: 'Verified',
      donationCount: donorData.donationCount ?? (donorData.hasDonatedBefore ? 1 : 0),
      willingToTravelKm: donorData.willingToTravelKm || 15,
      studentBatch: donorData.studentBatch,
      affiliation: donorData.affiliation || 'Student',
      occupation: donorData.occupation,
      hasDiseases: donorData.hasDiseases ?? false,
      diseaseDetails: donorData.diseaseDetails,
      hasDonatedBefore: donorData.hasDonatedBefore ?? false,
      isPublic: donorData.isPublic ?? true,
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDonors((prev) => [newDonor, ...prev]);
    recordAudit('DONOR_REGISTERED', `New donor ${newDonor.name} (${newDonor.bloodGroup}) registered at ${newDonor.campus}`, newDonor.id);
    
    addNotification({
      title: 'Welcome to BDS UET Narowal Network!',
      message: `Thank you ${newDonor.name} for registering as an active ${newDonor.bloodGroup} donor.`,
      type: 'system',
    });

    showToast('Registration Successful', `You are registered as an active ${newDonor.bloodGroup} donor!`, 'success');
    return newDonor;
  };

  const toggleDonorAvailability = (donorId: string, status: DonorAvailability) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, availabilityStatus: status } : d)));
    showToast('Status Updated', `Donor availability changed to ${status}`, 'info');
  };

  const toggleDonorEmergency = (donorId: string, emergencyAvailable: boolean) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, emergencyAvailable } : d)));
    showToast('Emergency Alerts', emergencyAvailable ? 'Emergency notifications enabled.' : 'Emergency alerts paused.', 'info');
  };

  const verifyDonor = (donorId: string, status: VerificationStatus) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, verificationStatus: status } : d)));
    recordAudit('DONOR_VERIFICATION_CHANGE', `Donor ${donorId} verification set to ${status}`, donorId);
    showToast('Verification Updated', `Donor verification marked as ${status}`, 'success');
  };

  // Campaign registrations
  const registerForCampaign = async (regData: Partial<CampaignRegistration>): Promise<CampaignRegistration> => {
    const regCode = `CAMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg: CampaignRegistration = {
      id: `reg-${Date.now()}`,
      registrationCode: regCode,
      campaignId: regData.campaignId || 'camp-1',
      campaignTitle: regData.campaignTitle || 'UET Narowal Blood Drive',
      userName: regData.userName || 'Donor',
      userEmail: regData.userEmail || '',
      userPhone: regData.userPhone || '',
      bloodGroup: regData.bloodGroup || 'O+',
      timeSlot: regData.timeSlot || '10:00 AM - 12:00 PM',
      userCategory: regData.userCategory || 'UET Student',
      department: regData.department,
      batch: regData.batch,
      status: 'Registered',
      createdAt: new Date().toISOString(),
    };

    setCampaignRegistrations((prev) => [newReg, ...prev]);

    // Update campaign registered count
    setCampaigns((prev) =>
      prev.map((c) => (c.id === newReg.campaignId ? { ...c, registeredCount: c.registeredCount + 1 } : c))
    );

    recordAudit('CAMPAIGN_REGISTRATION', `User ${newReg.userName} registered for ${newReg.campaignTitle} (Slot: ${newReg.timeSlot})`, newReg.id);
    showToast('Campaign Slot Booked!', `Your slot is confirmed (Code: ${regCode}). QR Pass ready.`, 'success');
    return newReg;
  };

  const createCampaign = async (campData: Partial<Campaign>): Promise<Campaign> => {
    const slug = (campData.title || 'blood-drive')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      slug,
      title: campData.title || 'New Blood Donation Camp',
      subtitle: campData.subtitle || 'UET Narowal Community Drive',
      description: campData.description || 'Blood donation drive organized by BDS UET Narowal.',
      date: campData.date || new Date().toISOString().split('T')[0],
      startTime: campData.startTime || '09:00 AM',
      endTime: campData.endTime || '05:00 PM',
      venue: campData.venue || 'UET Narowal Student Center',
      campus: campData.campus || 'UET Narowal Campus',
      city: campData.city || 'Narowal',
      targetUnits: campData.targetUnits || 100,
      collectedUnits: 0,
      registeredCount: 0,
      capacity: campData.capacity || 200,
      status: 'Upcoming',
      featuredImage: campData.featuredImage || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
      organizer: campData.organizer || 'BDS UET Narowal Executive Council',
      eligibilityNotes: campData.eligibilityNotes || [
        'Age 18-60',
        'Minimum weight 50 kg',
        'Healthy condition',
      ],
      timeSlots: campData.timeSlots || ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'],
      createdAt: new Date().toISOString(),
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    recordAudit('CAMPAIGN_CREATED', `New campaign "${newCamp.title}" created for ${newCamp.date}`, newCamp.id);
    showToast('Campaign Created', 'New blood drive published to community calendar.', 'success');
    return newCamp;
  };

  // Volunteer
  const applyAsVolunteer = async (volData: Partial<Volunteer>): Promise<Volunteer> => {
    const newVol: Volunteer = {
      id: `vol-${Date.now()}`,
      name: volData.name || 'Volunteer Applicant',
      email: volData.email || '',
      phone: volData.phone || '',
      campus: volData.campus || 'UET Narowal Campus',
      department: volData.department || 'Engineering',
      batch: volData.batch || '2024',
      skills: volData.skills || ['Communication', 'Hospital Liaison'],
      preferredRole: volData.preferredRole || 'Emergency Coordination',
      statement: volData.statement || 'Eager to serve the BDS UET Narowal community.',
      status: 'Pending Review',
      appliedAt: new Date().toISOString(),
    };

    setVolunteers((prev) => [newVol, ...prev]);
    recordAudit('VOLUNTEER_APPLIED', `New volunteer application from ${newVol.name} (${newVol.department})`, newVol.id);
    showToast('Application Submitted!', 'Thank you! The BDS team will review your application soon.', 'success');
    return newVol;
  };

  const updateVolunteerStatus = (volId: string, status: Volunteer['status']) => {
    setVolunteers((prev) => prev.map((v) => (v.id === volId ? { ...v, status } : v)));
    recordAudit('VOLUNTEER_STATUS_CHANGED', `Volunteer ${volId} status changed to ${status}`, volId);
    showToast('Volunteer Updated', `Application status changed to ${status}`, 'info');
  };

  // Article submission & review management
  const submitArticle = async (articleData: Partial<Article>): Promise<Article> => {
    const baseSlug = (articleData.title || 'community-guide')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug || 'guide'}-${Date.now().toString().slice(-4)}`;

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug,
      title: articleData.title || 'Untitled Community Guide',
      category: articleData.category || 'Health & Safety',
      summary: articleData.summary || '',
      content: articleData.content || '',
      readTime: articleData.readTime || '4 min read',
      author: articleData.author || (currentUser ? currentUser.name : 'Community Contributor'),
      authorRole: articleData.authorRole || 'Community Health Contributor',
      authorEmail: articleData.authorEmail || (currentUser ? currentUser.email : ''),
      authorPhone: articleData.authorPhone || (currentUser ? currentUser.phone : ''),
      authorAffiliation: articleData.authorAffiliation || 'UET Blood Donor Society Supporter',
      authorVerificationNotes: articleData.authorVerificationNotes || '',
      authorCnicOrRoll: articleData.authorCnicOrRoll || '',
      publishedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ['Health Literacy', 'Community Guide'],
      featuredImage:
        articleData.featuredImage ||
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      approvalStatus: 'pending',
      isCommunitySubmission: true,
      submittedAt: new Date().toISOString(),
    };

    setArticles((prev) => [newArticle, ...prev]);

    // System notification for admin review
    addNotification({
      title: 'New Guide Submitted for Review',
      message: `"${newArticle.title}" by ${newArticle.author} (${newArticle.authorAffiliation || 'Contributor'}) is waiting for clinical verification.`,
      type: 'system',
      recipientRole: 'admin',
      actionLink: 'admin',
    });

    recordAudit(
      'COMMUNITY_ARTICLE_SUBMITTED',
      `New guide "${newArticle.title}" submitted by ${newArticle.author} (${newArticle.authorEmail || 'N/A'}). Verification pending.`,
      newArticle.id
    );

    showToast(
      'Guide Submitted for Verification!',
      'Your article has been received. BDS UET medical coordinators will verify your information and review content before publishing.',
      'success'
    );

    return newArticle;
  };

  const approveArticle = (articleId: string, reviewerNotes?: string) => {
    const reviewer = currentUser ? `${currentUser.name} (${currentRole})` : 'BDS Medical Administrator';
    let targetTitle = '';
    let targetAuthor = '';

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          targetTitle = art.title;
          targetAuthor = art.author;
          return {
            ...art,
            approvalStatus: 'approved',
            reviewedBy: reviewer,
            reviewedAt: new Date().toISOString(),
            updatedDate: new Date().toISOString().split('T')[0],
          };
        }
        return art;
      })
    );

    recordAudit(
      'ARTICLE_APPROVED',
      `Approved article "${targetTitle}" by ${targetAuthor}. Reviewer: ${reviewer}. Notes: ${reviewerNotes || 'Standard clinical standards met.'}`,
      articleId
    );

    addNotification({
      title: 'Article Published to Donation Guide',
      message: `"${targetTitle}" by ${targetAuthor} has been approved and is now live in the BDS UET educational library.`,
      type: 'system',
    });

    showToast('Article Approved & Published', `"${targetTitle}" is now live in the public Donation Guide!`, 'success');
  };

  const rejectArticle = (articleId: string, reason: string) => {
    let targetTitle = '';
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          targetTitle = art.title;
          return {
            ...art,
            approvalStatus: 'rejected',
            rejectionReason: reason,
            reviewedBy: currentUser ? currentUser.name : 'BDS Medical Reviewer',
            reviewedAt: new Date().toISOString(),
          };
        }
        return art;
      })
    );

    recordAudit('ARTICLE_REJECTED', `Rejected article "${targetTitle}". Reason: ${reason}`, articleId);
    showToast('Submission Rejected', `Article status updated to rejected.`, 'info');
  };

  const deleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
    recordAudit('ARTICLE_DELETED', `Deleted article ${articleId}`, articleId);
    showToast('Article Removed', 'The article has been deleted.', 'info');
  };

  // Get compatible donors for a blood request
  const getCompatibleDonorsForRequest = (req: BloodRequest): Donor[] => {
    const compat = COMPATIBILITY_DATA[req.bloodGroup];
    if (!compat) return [];

    const allowedGroups = compat.canReceiveFrom;
    return donors.filter((d) => {
      const isGroupMatch = allowedGroups.includes(d.bloodGroup);
      const isAvailable = d.availabilityStatus === 'Available';
      return isGroupMatch && isAvailable;
    });
  };

  // Calculated overall statistics
  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const activeRequests = requests.filter(
      (r) => r.status === 'Submitted' || r.status === 'Under Review' || r.status === 'Donor Search Active'
    ).length;
    const completedDonations = requests.filter((r) => r.status === 'Completed').length;
    const upcomingCampaigns = campaigns.filter((c) => c.status === 'Upcoming').length;
    const criticalRequestsCount = requests.filter((r) => r.urgency === 'Critical' && r.status !== 'Completed').length;
    const verifiedDonorsCount = donors.filter((d) => d.verificationStatus === 'Verified').length;

    return {
      totalDonors,
      activeRequests,
      completedDonations,
      upcomingCampaigns,
      criticalRequestsCount,
      verifiedDonorsCount,
    };
  }, [donors, requests, campaigns]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentPage,
        selectedRequestId,
        selectedCampaignSlug,
        selectedArticleSlug,
        donors,
        requests,
        campaigns,
        campaignRegistrations,
        volunteers,
        articles,
        stories,
        faqs,
        notifications,
        auditLogs,
        toasts,
        unreadNotificationCount,
        navigate,
        switchUserRole,
        showToast,
        dismissToast,
        addBloodRequest,
        updateRequestStatus,
        assignCoordinator,
        matchDonorsToRequest,
        confirmDonation,
        addDonor,
        toggleDonorAvailability,
        toggleDonorEmergency,
        verifyDonor,
        registerForCampaign,
        createCampaign,
        applyAsVolunteer,
        updateVolunteerStatus,
        submitArticle,
        approveArticle,
        rejectArticle,
        deleteArticle,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        getCompatibleDonorsForRequest,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
