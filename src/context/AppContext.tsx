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
  DonationRecord,
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
  INITIAL_DONATION_RECORDS,
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
  
  donationRecords: DonationRecord[];
  
  // Navigation & User Management
  navigate: (page: string, params?: { requestId?: string; campaignSlug?: string; articleSlug?: string }) => void;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
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
    donorId?: string;
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
  updateContactMessageStatus: (id: string, status: 'New' | 'In Review' | 'Resolved') => void;
  
  // Actions
  addBloodRequest: (reqData: Partial<BloodRequest>) => Promise<BloodRequest>;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, note: string) => void;
  assignCoordinator: (requestId: string, coordinatorId: string, coordinatorName: string) => void;
  matchDonorsToRequest: (requestId: string, donorIds: string[]) => void;
  confirmDonation: (requestId: string, donorId: string, note?: string) => void;
  
  addDonor: (donorData: Partial<Donor>) => Promise<Donor>;
  updateDonorAvailability?: (donorId: string, status: DonorAvailability, emergencyAvailable?: boolean) => void;
  updateDonorProfile: (donorId: string, updates: Partial<Donor>) => Promise<void>;
  logDonationForDonor?: (donorId: string, hospital: string, date?: string) => void;
  addDonationRecord: (record: Partial<DonationRecord>) => Promise<DonationRecord>;
  toggleDonorAvailability: (donorId: string, status: DonorAvailability) => void;
  toggleDonorEmergency: (donorId: string, emergencyAvailable: boolean) => void;
  verifyDonor: (donorId: string, status: VerificationStatus, reasonOrNotes?: string) => void;
  
  registerForCampaign: (regData: Partial<CampaignRegistration>) => Promise<CampaignRegistration>;
  createCampaign: (campData: Partial<Campaign>) => Promise<Campaign>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  applyAsVolunteer: (volData: Partial<Volunteer>) => Promise<Volunteer>;
  updateVolunteerStatus: (volId: string, status: Volunteer['status']) => void;
  approveVolunteer: (volId: string, reviewerNotes?: string) => void;
  rejectVolunteer: (volId: string, reason: string) => void;

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
  DONATIONS: 'bds_uet_donations_v1',
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
    if (!saved) return INITIAL_REQUESTS;
    try {
      const parsed: BloodRequest[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((r) => r.id));
      const missingInitial = INITIAL_REQUESTS.filter((r) => !existingIds.has(r.id));
      return missingInitial.length > 0 ? [...parsed, ...missingInitial] : parsed;
    } catch {
      return INITIAL_REQUESTS;
    }
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg-001',
        name: 'Engr. Tariq Mehmood',
        email: 'tariq.mehmood@uet.edu.pk',
        phone: '+92 300 4521980',
        subject: 'Blood Donation Camp Collaboration for Faculty & Staff',
        message:
          'Assalam-o-Alaikum, we would like to organize a dedicated blood donation camp in the Electrical Engineering Department next month. Could your team share the logistics checklist and requirements?',
        status: 'New',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'msg-002',
        name: 'Dr. Samina Kausar',
        email: 'dr.samina@dhqnarowal.gov.pk',
        phone: '+92 321 8891023',
        subject: 'Platelet Unit Protocol for Thalassemia Ward',
        message:
          'DHQ Hospital Narowal is planning a thalassemia registry update. We wish to coordinate with BDS UET Narowal coordinators to establish a weekly roster of 4 verified O+ and B+ donors.',
        status: 'In Review',
        resolved_by: 'Fatima Noor (BDS Coordinator)',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
      {
        id: 'msg-003',
        name: 'Bilal Ahmad (Student 2023-CS-41)',
        email: 'bilal.ahmad@student.uet.edu.pk',
        phone: '+92 313 7762910',
        subject: 'Query regarding Blood Donation Certificate Issuance',
        message:
          'I donated blood during the Spring 2026 Camp at Student Center. How can I download my verified digital volunteer certificate for my academic portfolio?',
        status: 'Resolved',
        resolved_by: 'BDS Desk Coordinator',
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
    ];
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<SupabaseEmergencyAlert[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    if (!saved) return INITIAL_DONATION_RECORDS;
    try {
      const parsed: DonationRecord[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((r) => r.id));
      const missing = INITIAL_DONATION_RECORDS.filter((r) => !existingIds.has(r.id));
      return missing.length > 0 ? [...parsed, ...missing] : parsed;
    } catch {
      return INITIAL_DONATION_RECORDS;
    }
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
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donationRecords));
  }, [donationRecords]);

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
        const [remoteDonors, remoteRequests, remoteCampaigns, remoteArticles, remoteMessages, remoteDonations] =
          await Promise.all([
            SupabaseDataService.getDonors(),
            SupabaseDataService.getBloodRequests(),
            SupabaseDataService.getCampaigns(),
            SupabaseDataService.getArticles(),
            SupabaseDataService.getContactMessages(),
            SupabaseDataService.getDonationRecords(),
          ]);

        if (remoteDonors && remoteDonors.length > 0) {
          setDonors(remoteDonors);
        }
        if (remoteRequests && remoteRequests.length > 0) {
          setRequests(remoteRequests);
        }
        if (remoteDonations && remoteDonations.length > 0) {
          setDonationRecords(remoteDonations);
        }
        if (remoteCampaigns && remoteCampaigns.length > 0) {
          const remoteIds = new Set(remoteCampaigns.map((c) => c.id));
          const remoteSlugs = new Set(remoteCampaigns.map((c) => c.slug));
          const missingInitial = INITIAL_CAMPAIGNS.filter(
            (c) => !remoteIds.has(c.id) && !remoteSlugs.has(c.slug)
          );
          setCampaigns([...remoteCampaigns, ...missingInitial]);
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

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.ROLE, 'guest');
    setCurrentPage('home');
    showToast('Logged Out', 'You have been logged out securely.', 'info');
  };

  // Supabase Auth Methods
  const loginWithSupabase = async (
    email: string,
    password?: string,
    specialId?: string,
    role?: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedSpecialId = specialId ? specialId.trim().toUpperCase() : '';

      // Check if matches INITIAL_USERS
      const matchedInitialUser = INITIAL_USERS.find((u) => {
        const emailMatch = u.email.toLowerCase() === trimmedEmail;
        const idMatch = u.id.toLowerCase() === trimmedEmail || u.donorProfileId?.toLowerCase() === trimmedEmail;
        const donorIdMatch = u.donorId?.toLowerCase() === trimmedEmail || (trimmedSpecialId && u.donorId?.toUpperCase() === trimmedSpecialId);
        return emailMatch || idMatch || donorIdMatch;
      });

      if (matchedInitialUser) {
        const finalUser: User = {
          ...matchedInitialUser,
          donorId: matchedInitialUser.donorId || trimmedSpecialId || 'BDS-DNR-101',
          specialId: trimmedSpecialId || matchedInitialUser.specialId,
        };
        setCurrentUser(finalUser);
        setCurrentRole(finalUser.role);
        recordAudit('USER_LOGIN', `User ${finalUser.name} (${finalUser.role}, Donor ID: ${finalUser.donorId || 'N/A'}) logged in successfully.`, finalUser.id);
        return { success: true, user: finalUser };
      }

      // Check if user exists in live donors list
      const matchedDonor = donors.find((d) => {
        return (
          d.email.toLowerCase() === trimmedEmail ||
          d.id.toLowerCase() === trimmedEmail ||
          (d.donorId && d.donorId.toLowerCase() === trimmedEmail) ||
          (trimmedSpecialId && ((d.donorId && d.donorId.toUpperCase() === trimmedSpecialId) || d.id.toUpperCase() === trimmedSpecialId))
        );
      });

      if (matchedDonor) {
        const donorUser: User = {
          id: matchedDonor.userId || `u-${matchedDonor.id}`,
          name: matchedDonor.name,
          email: matchedDonor.email,
          phone: matchedDonor.phone,
          role: 'donor',
          campus: matchedDonor.campus,
          department: matchedDonor.area,
          donorProfileId: matchedDonor.id,
          donorId: matchedDonor.donorId || trimmedSpecialId || `BDS-DNR-${matchedDonor.id.replace('donor-', '')}`,
          verificationStatus: matchedDonor.verificationStatus,
          createdAt: matchedDonor.createdAt,
        };
        setCurrentUser(donorUser);
        setCurrentRole('donor');
        recordAudit('USER_LOGIN', `Verified Donor ${donorUser.name} (ID: ${donorUser.donorId}) logged in successfully.`, donorUser.id);
        return { success: true, user: donorUser };
      }

      const userFromDb = await SupabaseDataService.loginUser(email, role);
      if (userFromDb) {
        const finalUser: User = {
          ...userFromDb,
          donorId: userFromDb.donorId || (role === 'donor' ? trimmedSpecialId : undefined),
          specialId: trimmedSpecialId,
        };
        setCurrentUser(finalUser);
        setCurrentRole(finalUser.role);
        recordAudit('USER_LOGIN_SUPABASE', `User ${finalUser.name} (${finalUser.role}) authenticated via Supabase.`, finalUser.id);
        return { success: true, user: finalUser };
      }

      // Fallback matching default roles or creating session
      const fallbackUser: User = {
        id: `u-${Date.now().toString(36)}`,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email: email.trim(),
        phone: '+92 300 0000000',
        role: role || 'donor',
        campus: 'UET Narowal Campus',
        donorId: role === 'donor' ? (trimmedSpecialId || `BDS-DNR-2026-${Math.floor(100 + Math.random() * 900)}`) : undefined,
        specialId: trimmedSpecialId,
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
    donorId?: string;
    bloodGroup?: BloodGroup;
    password?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const newUser = await SupabaseDataService.registerUser(userData);
      const userWithDonorId: User = {
        ...newUser,
        donorId: userData.donorId || (userData.role === 'donor' ? userData.specialId : undefined),
        specialId: userData.specialId,
      };
      setCurrentUser(userWithDonorId);
      setCurrentRole(userWithDonorId.role);

      recordAudit(
        'USER_REGISTER_SUPABASE',
        `New ${userWithDonorId.role} account registered: ${userWithDonorId.name} (${userWithDonorId.email}, Unique Donor ID: ${userWithDonorId.donorId || 'N/A'}).`,
        userWithDonorId.id
      );

      return { success: true, user: userWithDonorId };
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

  const updateContactMessageStatus = (id: string, status: 'New' | 'In Review' | 'Resolved') => {
    const resolver = currentUser ? `${currentUser.name} (BDS Coordinator)` : 'BDS Desk Coordinator';
    setContactMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              resolved_by: status === 'Resolved' ? resolver : m.resolved_by,
            }
          : m
      )
    );
    recordAudit('CONTACT_INQUIRY_STATUS', `Inquiry ${id} status updated to ${status}.`, id);
    showToast('Inquiry Updated', `Status changed to ${status}.`, 'success');
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

    // Real-time sync: when blood is arranged (Donation Confirmed or Completed), add to Donation Records
    if (newStatus === 'Donation Confirmed' || newStatus === 'Completed') {
      const targetReq = requests.find((r) => r.id === requestId);
      if (targetReq) {
        setDonationRecords((prev) => {
          const alreadyExists = prev.some(
            (rec) => rec.requestId === requestId || (rec.requestCode && rec.requestCode === targetReq.requestCode)
          );
          if (alreadyExists) return prev;

          const donorId = targetReq.confirmedDonorId || targetReq.matchedDonorIds?.[0] || 'donor-101';
          const targetDonor = donors.find((d) => d.id === donorId || d.donorId === donorId);
          const certId = `BDS-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

          const newDonationRecord: DonationRecord = {
            id: `don-rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            donorId: targetDonor?.donorId || targetDonor?.id || donorId,
            donorName: targetDonor?.name || 'Verified BDS Donor',
            donorBloodGroup: targetDonor?.bloodGroup || targetReq.bloodGroup || 'O+',
            donorPhone: targetDonor?.phone || '',
            patientName: targetReq.patientName || 'Emergency Patient',
            requestCode: targetReq.requestCode,
            requestId: targetReq.id,
            donationDate: new Date().toISOString().split('T')[0],
            hospitalOrVenue: targetReq.hospitalName || 'DHQ Hospital Narowal',
            hospitalCity: targetReq.hospitalCity || 'Narowal',
            donationType: 'Whole Blood',
            units: targetReq.unitsRequired || 1,
            verificationStatus: 'Verified',
            verifiedBy: currentUser ? `${currentUser.name} (${currentRole})` : 'BDS Medical Coordinator',
            verifiedAt: new Date().toISOString(),
            certificateId: certId,
            notes: note || `Blood arranged & confirmed for patient ${targetReq.patientName} (${targetReq.requestCode}) at ${targetReq.hospitalName}.`,
            createdAt: new Date().toISOString(),
          };

          SupabaseDataService.saveDonationRecord(newDonationRecord);
          recordAudit(
            'REALTIME_DONATION_LOGGED',
            `Real-time donation record ${newDonationRecord.certificateId} created for arranged blood request ${targetReq.requestCode} (${targetReq.patientName})`,
            newDonationRecord.id
          );

          return [newDonationRecord, ...prev];
        });
      }
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

    // Real-time addition to Donation Records when donation is arranged/confirmed
    const targetReq = requests.find((r) => r.id === requestId);
    const targetDonor = donors.find((d) => d.id === donorId || d.donorId === donorId);
    const certNum = `BDS-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const confirmedRecord: DonationRecord = {
      id: `don-rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      donorId: targetDonor?.donorId || targetDonor?.id || donorId,
      donorName: targetDonor?.name || 'Verified BDS Donor',
      donorBloodGroup: targetDonor?.bloodGroup || targetReq?.bloodGroup || 'O+',
      donorPhone: targetDonor?.phone || '',
      patientName: targetReq?.patientName || 'Emergency Patient',
      requestCode: targetReq?.requestCode || 'BDS-REQ',
      requestId: requestId,
      donationDate: new Date().toISOString().split('T')[0],
      hospitalOrVenue: targetReq?.hospitalName || 'DHQ Hospital Narowal',
      hospitalCity: targetReq?.hospitalCity || 'Narowal',
      donationType: 'Whole Blood',
      units: targetReq?.unitsRequired || 1,
      verificationStatus: 'Verified',
      verifiedBy: currentUser ? `${currentUser.name} (${currentRole})` : 'BDS Medical Coordinator',
      verifiedAt: new Date().toISOString(),
      certificateId: certNum,
      notes: note || `Blood arranged and successfully delivered for ${targetReq?.patientName || 'patient'} (${targetReq?.requestCode || 'BDS-REQ'}) at ${targetReq?.hospitalName || 'DHQ Hospital Narowal'}.`,
      createdAt: new Date().toISOString(),
    };

    setDonationRecords((prev) => {
      const exists = prev.some((r) => r.requestId === requestId || (targetReq && r.requestCode === targetReq.requestCode));
      if (exists) {
        return prev.map((r) =>
          r.requestId === requestId || (targetReq && r.requestCode === targetReq.requestCode)
            ? { ...r, verificationStatus: 'Verified', verifiedAt: new Date().toISOString(), notes: confirmedRecord.notes }
            : r
        );
      }
      return [confirmedRecord, ...prev];
    });

    SupabaseDataService.saveDonationRecord(confirmedRecord);

    recordAudit('DONATION_CONFIRMED', `Donation completed for request ${requestId} by donor ${donorId}. Certificate ${certNum} generated.`, requestId);
    showToast('Donation Completed & Logged!', 'Arranged blood donation registered in real-time to Donation History.', 'success');
  };

  // Add donor
  const addDonor = async (donorData: Partial<Donor>): Promise<Donor> => {
    const assignedDonorId =
      donorData.donorId ||
      currentUser?.donorId ||
      `BDS-DNR-${Math.floor(100 + Math.random() * 900)}`;

    const newDonorPayload: Partial<Donor> = {
      id: donorData.id || `donor-${Date.now()}`,
      donorId: assignedDonorId,
      userId: currentUser ? currentUser.id : `u-${Date.now()}`,
      name: donorData.name || 'Anonymous Donor',
      email: donorData.email || '',
      phone: donorData.phone || '',
      bloodGroup: donorData.bloodGroup || 'O+',
      city: donorData.city || 'Narowal',
      campus: donorData.campus || 'UET Narowal Campus',
      department: donorData.department || (donorData.affiliation === 'Student' ? 'UET Narowal' : 'General Public'),
      area: donorData.area || 'Narowal City / District',
      age: donorData.age || 21,
      gender: donorData.gender || 'Male',
      lastDonationDate: donorData.lastDonationDate,
      availabilityStatus: 'Available',
      emergencyAvailable: donorData.emergencyAvailable ?? true,
      verificationStatus: donorData.verificationStatus || 'Pending',
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
      'DONOR_APPLICATION_SUBMITTED',
      `New voluntary donor registration submitted by ${savedDonor.name} (${savedDonor.bloodGroup}, Email: ${savedDonor.email}). Application placed in pending review for admin/team verification.`,
      savedDonor.id
    );
    
    // Notification for admin/team to review
    addNotification({
      title: 'New Donor Application Submitted',
      message: `${savedDonor.name} (${savedDonor.bloodGroup}) registered. Application is pending administrative review and verification.`,
      type: 'system',
      recipientRole: 'admin',
      actionLink: 'admin',
    });

    showToast(
      'Registration Submitted for Review',
      `Application received for ${savedDonor.name}. It will be reviewed by the BDS clinical team, and a status email will be sent to ${savedDonor.email}.`,
      'success'
    );
    return savedDonor;
  };

  const updateDonorAvailability = async (donorId: string, status: DonorAvailability, emergencyAvailable?: boolean) => {
    setDonors((prev) => {
      const exists = prev.some((d) => d.id === donorId);
      if (exists) {
        return prev.map((d) => {
          if (d.id === donorId) {
            return {
              ...d,
              availabilityStatus: status,
              ...(typeof emergencyAvailable === 'boolean' ? { emergencyAvailable } : {}),
              updatedAt: new Date().toISOString(),
            };
          }
          return d;
        });
      }

      // Upsert fallback donor into list if not already in memory
      const newDonorEntry: Donor = {
        id: donorId,
        userId: currentUser?.id || 'u-donor-1',
        name: currentUser?.name || 'Zain Ul Abideen',
        email: currentUser?.email || 'donor@bds.uet.edu.pk',
        phone: currentUser?.phone || '+92 312 9901842',
        bloodGroup: ((currentUser as any)?.bloodGroup || 'O-') as BloodGroup,
        city: 'Narowal',
        campus: currentUser?.campus || 'UET Narowal Campus',
        area: 'UET Campus',
        age: 22,
        gender: 'Male',
        willingToTravelKm: 15,
        availabilityStatus: status,
        emergencyAvailable: typeof emergencyAvailable === 'boolean' ? emergencyAvailable : true,
        verificationStatus: (currentUser?.verificationStatus || 'Verified') as VerificationStatus,
        donationCount: 4,
        notificationsEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [newDonorEntry, ...prev];
    });

    // Also sync currentUser.donorProfileId if not set
    if (currentUser && (!currentUser.donorProfileId || currentUser.donorProfileId !== donorId)) {
      const updatedUser: User = { ...currentUser, donorProfileId: donorId };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }

    try {
      await SupabaseDataService.updateDonor(donorId, {
        availabilityStatus: status,
        ...(typeof emergencyAvailable === 'boolean' ? { emergencyAvailable } : {}),
      });
    } catch (err) {
      console.warn('Network sync notice for updateDonor:', err);
    }

    recordAudit('DONOR_AVAILABILITY_CHANGE', `Donor ${donorId} availability set to ${status}`, donorId);
    showToast(
      'Availability Saved',
      `Your donation status was updated to ${status}${typeof emergencyAvailable === 'boolean' ? ` (Emergency alerts: ${emergencyAvailable ? 'Enabled' : 'Paused'})` : ''}.`,
      'success'
    );
  };

  const updateDonorProfile = async (donorId: string, updates: Partial<Donor>): Promise<void> => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
    await SupabaseDataService.updateDonor(donorId, updates);
    recordAudit('DONOR_PROFILE_UPDATED', `Donor ${donorId} updated their contact and profile information.`, donorId);
    showToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

  const addDonationRecord = async (record: Partial<DonationRecord>): Promise<DonationRecord> => {
    const saved = await SupabaseDataService.saveDonationRecord(record);
    setDonationRecords((prev) => [saved, ...prev]);

    if (saved.verificationStatus === 'Verified' && saved.donorId) {
      setDonors((prev) =>
        prev.map((d) => {
          if (d.id === saved.donorId) {
            return {
              ...d,
              donationCount: (d.donationCount || 0) + (saved.units || 1),
              lastDonationDate: saved.donationDate,
            };
          }
          return d;
        })
      );
    }

    recordAudit('DONATION_LOGGED', `Donation of ${saved.units} unit(s) recorded at ${saved.hospitalOrVenue}`, saved.donorId);
    showToast('Donation Submitted', 'Your donation record was submitted for clinical verification review.', 'success');
    return saved;
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

  const verifyDonor = (donorId: string, status: VerificationStatus, reasonOrNotes?: string) => {
    const target = donors.find((d) => d.id === donorId || d.donorId === donorId);
    const donorName = target?.name || 'Voluntary Donor';
    const donorEmail =
      target?.email || `${donorName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`;
    const reviewer = currentUser ? `${currentUser.name} (${currentRole})` : 'BDS Medical Board';
    const nowIso = new Date().toISOString();

    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId || d.donorId === donorId
          ? {
              ...d,
              verificationStatus: status,
              verificationNotes: reasonOrNotes,
              verifiedBy: reviewer,
              verifiedAt: nowIso,
            }
          : d
      )
    );

    // If current user is this donor, update session
    if (currentUser && (currentUser.donorProfileId === donorId || currentUser.donorId === target?.donorId)) {
      const updatedUser: User = { ...currentUser, verificationStatus: status };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }

    SupabaseDataService.updateDonor(donorId, {
      verificationStatus: status,
      verificationNotes: reasonOrNotes,
      verifiedBy: reviewer,
      verifiedAt: nowIso,
    });

    if (status === 'Verified') {
      // Automated Verification Email Dispatch
      recordAudit(
        'DONOR_VERIFIED_EMAIL_SENT',
        `[AUTOMATED EMAIL SENT TO ${donorEmail}] Subject: BDS UET Narowal - Voluntary Donor Profile Approved & Verified. Dear ${donorName}, your voluntary donor application (ID: ${target?.donorId || donorId}, Blood Group: ${target?.bloodGroup}) has been reviewed and verified by ${reviewer}. You are now certified in the emergency donor network. Reviewer Notes: ${reasonOrNotes || 'Clinical eligibility confirmed.'}`,
        donorId
      );

      addNotification({
        title: 'Donor Verified & Email Dispatched',
        message: `${donorName} was officially verified. Automated approval email delivered to ${donorEmail}.`,
        type: 'system',
        recipientRole: 'admin',
      });

      showToast(
        'Donor Verified & Email Sent',
        `Official verification email successfully sent to ${donorEmail}.`,
        'success'
      );
    } else {
      // Unverified or Rejected
      recordAudit(
        'DONOR_UNVERIFIED_EMAIL_SENT',
        `[AUTOMATED EMAIL SENT TO ${donorEmail}] Subject: BDS UET Narowal - Donor Application Status Update (${status}). Dear ${donorName}, your voluntary donor application has been marked as ${status} by ${reviewer}. Status Details: "${reasonOrNotes || 'Verification suspended or deferred for clinical re-assessment. Contact BDS coordinator for details.'}".`,
        donorId
      );

      addNotification({
        title: `Donor Marked as ${status} & Notice Sent`,
        message: `${donorName} was marked as ${status}. Status update email delivered to ${donorEmail}.`,
        type: 'system',
        recipientRole: 'admin',
      });

      showToast(
        `Donor ${status} & Email Sent`,
        `Formal notification email successfully sent to ${donorEmail}.`,
        'info'
      );
    }
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

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>): Promise<Campaign> => {
    let updatedCampaign: Campaign | null = null;
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          updatedCampaign = { ...c, ...updates };
          return updatedCampaign;
        }
        return c;
      })
    );
    await SupabaseDataService.updateCampaign(campaignId, updates);
    recordAudit('CAMPAIGN_UPDATED', `Campaign ${campaignId} updated.`, campaignId);
    showToast('Event Updated', 'Blood drive details saved successfully.', 'success');
    return updatedCampaign || (updates as Campaign);
  };

  const deleteCampaign = async (campaignId: string): Promise<void> => {
    const target = campaigns.find((c) => c.id === campaignId);
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    await SupabaseDataService.deleteCampaign(campaignId);
    recordAudit('CAMPAIGN_DELETED', `Campaign "${target?.title || campaignId}" deleted.`, campaignId);
    showToast('Event Removed', 'Blood drive was deleted from the schedule.', 'info');
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

  const approveVolunteer = (volId: string, reviewerNotes?: string) => {
    const reviewer = currentUser ? `${currentUser.name} (${currentRole})` : 'BDS Executive Council';
    const target = volunteers.find((v) => v.id === volId);
    const targetName = target?.name || 'Volunteer Applicant';
    const targetEmail =
      target?.email || `${targetName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`;

    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volId) {
          return {
            ...v,
            status: 'Approved',
            reviewedBy: reviewer,
            reviewedAt: new Date().toISOString(),
          };
        }
        return v;
      })
    );

    SupabaseDataService.updateVolunteerStatus(volId, 'Approved', undefined, reviewer);

    // Automated Email Dispatch to Volunteer
    recordAudit(
      'VOLUNTEER_APPROVED_EMAIL_SENT',
      `[EMAIL DISPATCHED TO ${targetEmail}] Subject: BDS UET Narowal - Welcome to the Team! Your Volunteer Application Has Been Approved! Notice delivered to ${targetName}. Role: ${target?.preferredRole || 'Team Volunteer'}. Reviewer: ${reviewer}. Notes: ${reviewerNotes || 'Approved for semester activities.'}`,
      volId
    );

    addNotification({
      title: 'Volunteer Approved & Email Sent',
      message: `Application for ${targetName} was approved. Automated welcome and onboarding email delivered to ${targetEmail}.`,
      type: 'system',
      recipientRole: 'admin',
    });

    showToast(
      'Volunteer Approved & Email Sent',
      `Welcome email successfully dispatched to ${targetEmail} for ${targetName}.`,
      'success'
    );
  };

  const rejectVolunteer = (volId: string, reason: string) => {
    const target = volunteers.find((v) => v.id === volId);
    const targetName = target?.name || 'Volunteer Applicant';
    const targetEmail =
      target?.email || `${targetName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`;
    const reviewer = currentUser ? currentUser.name : 'BDS Volunteer Incharge';

    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volId) {
          return {
            ...v,
            status: 'Rejected',
            rejectionReason: reason,
            reviewedBy: reviewer,
            reviewedAt: new Date().toISOString(),
          };
        }
        return v;
      })
    );

    SupabaseDataService.updateVolunteerStatus(volId, 'Rejected', reason, reviewer);

    // Automated Email Dispatch to Applicant
    recordAudit(
      'VOLUNTEER_REJECTED_EMAIL_SENT',
      `[EMAIL DISPATCHED TO ${targetEmail}] Subject: BDS UET Narowal - Volunteer Application Status Update. Notice delivered to ${targetName}. Decision: Rejected. Reason: "${reason}". Reviewer: ${reviewer}.`,
      volId
    );

    addNotification({
      title: 'Volunteer Application Decision Sent',
      message: `Application for ${targetName} was rejected. Formal notice email dispatched to ${targetEmail}.`,
      type: 'system',
      recipientRole: 'admin',
    });

    showToast(
      'Application Rejected & Email Sent',
      `Status update email successfully sent to ${targetEmail} with the specified reason.`,
      'info'
    );
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
    const target = articles.find((a) => a.id === articleId);
    const targetTitle = target?.title || 'Educational Guide';
    const targetAuthor = target?.author || 'Contributor';
    const targetAuthorEmail =
      target?.authorEmail ||
      (target?.author
        ? `${target.author.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`
        : 'author@narowal.uet.edu.pk');

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
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

    // Automated Email Dispatch to Author
    recordAudit(
      'ARTICLE_APPROVED_EMAIL_SENT',
      `[EMAIL DISPATCHED TO ${targetAuthorEmail}] Subject: BDS UET Narowal - Your Article "${targetTitle}" Has Been Approved & Published! Notice delivered to ${targetAuthor}. Reviewer: ${reviewer}. Notes: ${reviewerNotes || 'Standard clinical standards met.'}`,
      articleId
    );

    addNotification({
      title: 'Article Approved & Email Sent to Author',
      message: `"${targetTitle}" is now published live. Automated approval confirmation email delivered to author (${targetAuthorEmail}).`,
      type: 'system',
    });

    showToast(
      'Article Approved & Email Sent',
      `"${targetTitle}" is live! Official confirmation email dispatched to ${targetAuthorEmail}.`,
      'success'
    );
  };

  const rejectArticle = (articleId: string, reason: string) => {
    const target = articles.find((a) => a.id === articleId);
    const targetTitle = target?.title || 'Educational Guide';
    const targetAuthor = target?.author || 'Contributor';
    const targetAuthorEmail =
      target?.authorEmail ||
      (target?.author
        ? `${target.author.toLowerCase().replace(/[^a-z0-9]/g, '.')}@narowal.uet.edu.pk`
        : 'author@narowal.uet.edu.pk');
    const reviewer = currentUser ? currentUser.name : 'BDS Medical Reviewer';

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            approvalStatus: 'rejected',
            rejectionReason: reason,
            reviewedBy: reviewer,
            reviewedAt: new Date().toISOString(),
          };
        }
        return art;
      })
    );

    SupabaseDataService.updateArticleStatus(articleId, 'rejected', reason);

    // Automated Email Dispatch to Author
    recordAudit(
      'ARTICLE_REJECTED_EMAIL_SENT',
      `[EMAIL DISPATCHED TO ${targetAuthorEmail}] Subject: BDS UET Narowal - Editorial Review Decision: "${targetTitle}". Rejection feedback delivered to ${targetAuthor}. Reason: ${reason}`,
      articleId
    );

    addNotification({
      title: 'Article Rejection Notice Emailed to Author',
      message: `Rejection notice with review feedback delivered to ${targetAuthorEmail} for "${targetTitle}".`,
      type: 'system',
    });

    showToast(
      'Article Rejected & Email Sent',
      `Rejection feedback and notice dispatched to author at ${targetAuthorEmail}.`,
      'info'
    );
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
        donationRecords,
        navigate,
        switchUserRole,
        setCurrentUser,
        logout,
        showToast,
        dismissToast,
        refreshFromSupabase,
        loginWithSupabase,
        registerWithSupabase,
        submitContactMessage,
        updateContactMessageStatus,
        addBloodRequest,
        updateRequestStatus,
        assignCoordinator,
        matchDonorsToRequest,
        confirmDonation,
        addDonor,
        updateDonorAvailability,
        updateDonorProfile,
        addDonationRecord,
        logDonationForDonor,
        toggleDonorAvailability,
        toggleDonorEmergency,
        verifyDonor,
        registerForCampaign,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        applyAsVolunteer,
        updateVolunteerStatus,
        approveVolunteer,
        rejectVolunteer,
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
