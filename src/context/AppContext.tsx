import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
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
import {
  SupabaseDataService,
  SupabaseContactMessage,
  SupabaseEmergencyAlert,
} from '../services/supabaseService';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface SupabaseStatusState {
  connected: boolean;
  tablesInitialized: boolean;
  isSyncing: boolean;
  lastSyncedAt?: string;
  error?: string;
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
  contactMessages: SupabaseContactMessage[];
  emergencyAlerts: SupabaseEmergencyAlert[];
  toasts: ToastMessage[];
  unreadNotificationCount: number;
  supabaseStatus: SupabaseStatusState;
  
  // Navigation & User Management
  navigate: (page: string, params?: { requestId?: string; campaignSlug?: string; articleSlug?: string }) => void;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Supabase Auth & Synchronization
  refreshFromSupabase: () => Promise<void>;
  loginWithSupabase: (
    email: string,
    password?: string,
    specialId?: string,
    role?: UserRole
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerWithSupabase: (userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    department?: string;
    batch?: string;
    campus?: string;
    specialId?: string;
    bloodGroup?: BloodGroup;
    password?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;

  // Contact Messages & Emergency
  submitContactMessage: (msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => Promise<SupabaseContactMessage>;
  
  // Actions
  addBloodRequest: (reqData: Partial<BloodRequest>) => Promise<BloodRequest>;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, note: string) => void;
  assignCoordinator: (requestId: string, coordinatorId: string, coordinatorName: string) => void;
  matchDonorsToRequest: (requestId: string, donorIds: string[]) => void;
  confirmDonation: (requestId: string, donorId: string, note?: string) => void;
  
  addDonor: (donorData: Partial<Donor>) => Promise<Donor>;
  updateDonorAvailability?: (donorId: string, status: DonorAvailability) => void;
  logDonationForDonor?: (donorId: string, donationDate: string, hospital: string) => void;
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
  CONTACT_MSGS: 'bds_uet_contact_msgs_v1',
  CURRENT_USER: 'bds_uet_current_user_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default to seeds
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'guest';
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
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

  const [contactMessages, setContactMessages] = useState<SupabaseContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_MSGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<SupabaseEmergencyAlert[]>([]);

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

  // Supabase Connection Status
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusState>({
    connected: true,
    tablesInitialized: false,
    isSyncing: false,
  });

  // Sync to local storage for instant offline resilience
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
    localStorage.setItem(STORAGE_KEYS.CONTACT_MSGS, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Toast system
  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        dismissToast(id);
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add audit log entry
  const recordAudit = useCallback(
    (action: string, details: string, targetId?: string) => {
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
      SupabaseDataService.logAudit(action, details, newLog.performerName, currentRole);
    },
    [currentUser, currentRole]
  );

  // Add in-app notification
  const addNotification = useCallback(
    (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        ...notif,
        read: false,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      SupabaseDataService.createNotification(notif);
    },
    []
  );

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Supabase Data Sync
  const refreshFromSupabase = useCallback(async () => {
    setSupabaseStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const conn = await SupabaseDataService.checkConnection();
      setSupabaseStatus({
        connected: conn.connected,
        tablesInitialized: conn.tablesInitialized,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString(),
        error: conn.error,
      });

      if (conn.tablesInitialized) {
        // Fetch remote tables in parallel
        const [remoteDonors, remoteRequests, remoteCampaigns, remoteArticles, remoteMessages] =
          await Promise.all([
            SupabaseDataService.getDonors(),
            SupabaseDataService.getBloodRequests(),
            SupabaseDataService.getCampaigns(),
            SupabaseDataService.getArticles(),
            SupabaseDataService.getContactMessages(),
          ]);

        if (remoteDonors && remoteDonors.length > 0) {
          setDonors(remoteDonors);
        }
        if (remoteRequests && remoteRequests.length > 0) {
          setRequests(remoteRequests);
        }
        if (remoteCampaigns && remoteCampaigns.length > 0) {
          setCampaigns(remoteCampaigns);
        }
        if (remoteArticles && remoteArticles.length > 0) {
          setArticles(remoteArticles);
        }
        if (remoteMessages && remoteMessages.length > 0) {
          setContactMessages(remoteMessages);
        }
      }
    } catch (err: any) {
      setSupabaseStatus({
        connected: false,
        tablesInitialized: false,
        isSyncing: false,
        error: err?.message || 'Sync failed',
      });
    }
  }, []);

  // Initial sync on mount
  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

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

  // Switch role helper
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

  // Supabase Auth Methods
  const loginWithSupabase = async (
    email: string,
    password?: string,
    specialId?: string,
    role?: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const userFromDb = await SupabaseDataService.loginUser(email, role);
      if (userFromDb) {
        setCurrentUser(userFromDb);
        setCurrentRole(userFromDb.role);
        recordAudit('USER_LOGIN_SUPABASE', `User ${userFromDb.name} (${userFromDb.role}) authenticated via Supabase.`, userFromDb.id);
        return { success: true, user: userFromDb };
      }

      // Fallback matching default roles or creating session
      const fallbackUser: User = {
        id: `u-${Date.now().toString(36)}`,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email: email.trim(),
        phone: '+92 300 0000000',
        role: role || 'donor',
        campus: 'UET Narowal Campus',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(fallbackUser);
      setCurrentRole(fallbackUser.role);
      return { success: true, user: fallbackUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login error' };
    }
  };

  const registerWithSupabase = async (userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    department?: string;
    batch?: string;
    campus?: string;
    specialId?: string;
    bloodGroup?: BloodGroup;
    password?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const newUser = await SupabaseDataService.registerUser(userData);
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);

      recordAudit(
        'USER_REGISTER_SUPABASE',
        `New ${newUser.role} account registered: ${newUser.name} (${newUser.email}) in Supabase database.`,
        newUser.id
      );

      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration error' };
    }
  };

  // Contact Messages
  const submitContactMessage = async (msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<SupabaseContactMessage> => {
    const savedMsg = await SupabaseDataService.submitContactMessage(msg);
    setContactMessages((prev) => [savedMsg, ...prev]);

    recordAudit('CONTACT_MESSAGE_RECEIVED', `Inquiry received from ${savedMsg.name} regarding "${savedMsg.subject}".`, savedMsg.id);
    
    addNotification({
      title: 'New Contact Inquiry Received',
      message: `${savedMsg.name}: "${savedMsg.subject}"`,
      type: 'system',
      recipientRole: 'admin',
      actionLink: 'admin',
    });

    return savedMsg;
  };

  // Add blood request
  const addBloodRequest = async (reqData: Partial<BloodRequest>): Promise<BloodRequest> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestCode = `BDS-2026-${reqData.urgency === 'Critical' ? 'EM' : 'REQ'}${randomSuffix}`;
    const newReqPayload: Partial<BloodRequest> = {
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
              ? 'Critical emergency logged. High-priority donor alert broadcasted to Supabase network.'
              : 'Blood request registered successfully. Under verification by BDS coordinators.',
          updatedBy: 'System Intake',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Supabase
    const savedReq = await SupabaseDataService.saveBloodRequest(newReqPayload);

    setRequests((prev) => [savedReq, ...prev]);

    // Record audit and notification
    recordAudit(
      'BLOOD_REQUEST_SUBMITTED',
      `New ${savedReq.urgency} request ${savedReq.requestCode} for ${savedReq.bloodGroup} at ${savedReq.hospitalName}`,
      savedReq.id
    );
    
    addNotification({
      title: `${savedReq.urgency.toUpperCase()}: ${savedReq.bloodGroup} Blood Request`,
      message: `${savedReq.unitsRequired} unit(s) requested for ${savedReq.patientName} at ${savedReq.hospitalName}. (Code: ${savedReq.requestCode})`,
      type: savedReq.urgency === 'Critical' ? 'emergency' : 'system',
      actionLink: 'track-request',
    });

    showToast(
      'Request Submitted to Supabase Database',
      `Request ID ${requestCode} saved! Our coordination team is searching for donors.`,
      'success'
    );

    return savedReq;
  };

  // Update request status
  const updateRequestStatus = (requestId: string, newStatus: RequestStatus, note: string) => {
    let updatedRequest: BloodRequest | null = null;
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
          updatedRequest = updated;
          return updated;
        }
        return r;
      })
    );

    if (updatedRequest) {
      SupabaseDataService.updateBloodRequest(requestId, {
        status: newStatus,
        statusUpdates: (updatedRequest as BloodRequest).statusUpdates,
      });
    }

    recordAudit('REQUEST_STATUS_UPDATED', `Request ${requestId} status updated to ${newStatus}. Note: ${note}`, requestId);
    showToast('Status Updated', `Request status changed to ${newStatus} in Supabase`, 'success');
  };

  // Assign coordinator
  const assignCoordinator = (requestId: string, coordinatorId: string, coordinatorName: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, assignedCoordinatorId: coordinatorId, assignedCoordinatorName: coordinatorName }
          : r
      )
    );
    SupabaseDataService.updateBloodRequest(requestId, {
      assignedCoordinatorId: coordinatorId,
      assignedCoordinatorName: coordinatorName,
    });
    recordAudit('COORDINATOR_ASSIGNED', `Assigned ${coordinatorName} to request ${requestId}`, requestId);
    showToast('Coordinator Assigned', `${coordinatorName} is now leading this blood case.`, 'info');
  };

  // Match donors
  const matchDonorsToRequest = (requestId: string, donorIds: string[]) => {
    let newMatched: string[] = [];
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          newMatched = Array.from(new Set([...r.matchedDonorIds, ...donorIds]));
          return { ...r, matchedDonorIds: newMatched, status: 'Donor Search Active' };
        }
        return r;
      })
    );
    SupabaseDataService.updateBloodRequest(requestId, {
      matchedDonorIds: newMatched,
      status: 'Donor Search Active',
    });
    recordAudit('DONORS_DISPATCHED', `Dispatched notification to ${donorIds.length} eligible donors for request ${requestId}`, requestId);
    showToast('Donors Alerted', `${donorIds.length} donors contacted via WhatsApp / SMS dispatch queue.`, 'success');
  };

  // Confirm donation
  const confirmDonation = (requestId: string, donorId: string, note?: string) => {
    let updatedReq: BloodRequest | null = null;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const upd: BloodRequest = {
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
          };
          updatedReq = upd;
          return upd;
        }
        return r;
      })
    );

    if (updatedReq) {
      SupabaseDataService.updateBloodRequest(requestId, {
        status: 'Completed',
        confirmedDonorId: donorId,
        statusUpdates: (updatedReq as BloodRequest).statusUpdates,
      });
    }

    // Update donor donation count & last donation date
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const nextCount = d.donationCount + 1;
          const todayStr = new Date().toISOString().split('T')[0];
          SupabaseDataService.updateDonor(donorId, {
            donationCount: nextCount,
            lastDonationDate: todayStr,
            availabilityStatus: 'Temporarily Ineligible',
          });
          return {
            ...d,
            donationCount: nextCount,
            lastDonationDate: todayStr,
            availabilityStatus: 'Temporarily Ineligible',
          };
        }
        return d;
      })
    );

    recordAudit('DONATION_CONFIRMED', `Donation completed for request ${requestId} by donor ${donorId}`, requestId);
    showToast('Donation Completed!', 'Life-saving blood donation recorded in Supabase database.', 'success');
  };

  // Add donor
  const addDonor = async (donorData: Partial<Donor>): Promise<Donor> => {
    const newDonorPayload: Partial<Donor> = {
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

    // Save to Supabase
    const savedDonor = await SupabaseDataService.saveDonor(newDonorPayload);

    setDonors((prev) => [savedDonor, ...prev]);
    recordAudit(
      'DONOR_REGISTERED',
      `New donor ${savedDonor.name} (${savedDonor.bloodGroup}) registered at ${savedDonor.campus} in Supabase.`,
      savedDonor.id
    );
    
    addNotification({
      title: 'Welcome to BDS UET Narowal Network!',
      message: `Thank you ${savedDonor.name} for registering as an active ${savedDonor.bloodGroup} donor.`,
      type: 'system',
    });

    showToast(
      'Registration Saved to Supabase',
      `You are registered as an active ${savedDonor.bloodGroup} donor in the live database!`,
      'success'
    );
    return savedDonor;
  };

  const updateDonorAvailability = (donorId: string, status: DonorAvailability) => {
    toggleDonorAvailability(donorId, status);
  };

  const logDonationForDonor = (donorId: string, donationDate: string, hospital: string) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const nextCount = d.donationCount + 1;
          SupabaseDataService.updateDonor(donorId, {
            donationCount: nextCount,
            lastDonationDate: donationDate,
            availabilityStatus: 'Temporarily Ineligible',
          });
          return {
            ...d,
            donationCount: nextCount,
            lastDonationDate: donationDate,
            availabilityStatus: 'Temporarily Ineligible',
          };
        }
        return d;
      })
    );
    recordAudit('DONATION_LOGGED_MANUALLY', `Logged donation for donor ${donorId} at ${hospital}`, donorId);
    showToast('Donation Logged', `Donation recorded at ${hospital}. Thank you for your service!`, 'success');
  };

  const toggleDonorAvailability = (donorId: string, status: DonorAvailability) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, availabilityStatus: status } : d)));
    SupabaseDataService.updateDonor(donorId, { availabilityStatus: status });
    showToast('Status Updated', `Donor availability changed to ${status}`, 'info');
  };

  const toggleDonorEmergency = (donorId: string, emergencyAvailable: boolean) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, emergencyAvailable } : d)));
    SupabaseDataService.updateDonor(donorId, { emergencyAvailable });
    showToast('Emergency Alerts', emergencyAvailable ? 'Emergency notifications enabled.' : 'Emergency alerts paused.', 'info');
  };

  const verifyDonor = (donorId: string, status: VerificationStatus) => {
    setDonors((prev) => prev.map((d) => (d.id === donorId ? { ...d, verificationStatus: status } : d)));
    SupabaseDataService.updateDonor(donorId, { verificationStatus: status });
    recordAudit('DONOR_VERIFICATION_CHANGE', `Donor ${donorId} verification set to ${status}`, donorId);
    showToast('Verification Updated', `Donor verification marked as ${status} in Supabase`, 'success');
  };

  // Campaign registrations
  const registerForCampaign = async (regData: Partial<CampaignRegistration>): Promise<CampaignRegistration> => {
    const regCode = `CAMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRegPayload: Partial<CampaignRegistration> = {
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

    const savedReg = await SupabaseDataService.registerForCampaign(newRegPayload);
    setCampaignRegistrations((prev) => [savedReg, ...prev]);

    // Update campaign registered count
    setCampaigns((prev) =>
      prev.map((c) => (c.id === savedReg.campaignId ? { ...c, registeredCount: c.registeredCount + 1 } : c))
    );

    recordAudit(
      'CAMPAIGN_REGISTRATION',
      `User ${savedReg.userName} registered for ${savedReg.campaignTitle} (Slot: ${savedReg.timeSlot})`,
      savedReg.id
    );
    showToast('Campaign Slot Booked!', `Your slot is confirmed (Code: ${regCode}). Saved to Supabase.`, 'success');
    return savedReg;
  };

  const createCampaign = async (campData: Partial<Campaign>): Promise<Campaign> => {
    const slug = (campData.title || 'blood-drive')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCampPayload: Partial<Campaign> = {
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

    const savedCamp = await SupabaseDataService.saveCampaign(newCampPayload);
    setCampaigns((prev) => [savedCamp, ...prev]);

    recordAudit('CAMPAIGN_CREATED', `New campaign "${savedCamp.title}" created in Supabase for ${savedCamp.date}`, savedCamp.id);
    showToast('Campaign Created', 'New blood drive published to Supabase community calendar.', 'success');
    return savedCamp;
  };

  // Volunteer
  const applyAsVolunteer = async (volData: Partial<Volunteer>): Promise<Volunteer> => {
    const newVolPayload: Partial<Volunteer> = {
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

    const savedVol = await SupabaseDataService.applyVolunteer(newVolPayload);
    setVolunteers((prev) => [savedVol, ...prev]);

    recordAudit('VOLUNTEER_APPLIED', `New volunteer application from ${savedVol.name} in Supabase`, savedVol.id);
    showToast('Application Submitted!', 'Thank you! The BDS team will review your application soon.', 'success');
    return savedVol;
  };

  const updateVolunteerStatus = (volId: string, status: Volunteer['status']) => {
    setVolunteers((prev) => prev.map((v) => (v.id === volId ? { ...v, status } : v)));
    SupabaseDataService.updateVolunteerStatus(volId, status);
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

    const newArticlePayload: Partial<Article> = {
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

    const savedArt = await SupabaseDataService.saveArticle(newArticlePayload);
    setArticles((prev) => [savedArt, ...prev]);

    // System notification for admin review
    addNotification({
      title: 'New Guide Submitted for Review',
      message: `"${savedArt.title}" by ${savedArt.author} is waiting for clinical verification in Supabase.`,
      type: 'system',
      recipientRole: 'admin',
      actionLink: 'admin',
    });

    recordAudit(
      'COMMUNITY_ARTICLE_SUBMITTED',
      `New guide "${savedArt.title}" submitted by ${savedArt.author}. Saved to Supabase.`,
      savedArt.id
    );

    showToast(
      'Guide Submitted to Database!',
      'Your article has been received in Supabase. BDS UET medical coordinators will verify your information and review content.',
      'success'
    );

    return savedArt;
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

    SupabaseDataService.updateArticleStatus(articleId, 'approved', reviewerNotes, reviewer);

    recordAudit(
      'ARTICLE_APPROVED',
      `Approved article "${targetTitle}" by ${targetAuthor} in Supabase. Reviewer: ${reviewer}. Notes: ${reviewerNotes || 'Standard clinical standards met.'}`,
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

    SupabaseDataService.updateArticleStatus(articleId, 'rejected', reason);
    recordAudit('ARTICLE_REJECTED', `Rejected article "${targetTitle}". Reason: ${reason}`, articleId);
    showToast('Submission Rejected', `Article status updated in Supabase to rejected.`, 'info');
  };

  const deleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
    SupabaseDataService.deleteArticle(articleId);
    recordAudit('ARTICLE_DELETED', `Deleted article ${articleId} from Supabase`, articleId);
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
        contactMessages,
        emergencyAlerts,
        toasts,
        unreadNotificationCount,
        supabaseStatus,
        navigate,
        switchUserRole,
        setCurrentUser,
        showToast,
        dismissToast,
        refreshFromSupabase,
        loginWithSupabase,
        registerWithSupabase,
        submitContactMessage,
        addBloodRequest,
        updateRequestStatus,
        assignCoordinator,
        matchDonorsToRequest,
        confirmDonation,
        addDonor,
        updateDonorAvailability,
        logDonationForDonor,
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
