-- ==============================================================================
-- Blood Donor Society (BDS) UET Narowal - Supabase Database Schema
-- Project ID: zrmajldxzdkokgayhsbg
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zrmajldxzdkokgayhsbg/sql/new
-- ==============================================================================

-- 1. USERS & PROFILES TABLE (Login, Roles, Admin/Team/Donor accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'donor', -- 'admin', 'coordinator'/'team', 'donor', 'requester'
  campus TEXT DEFAULT 'UET Narowal Campus',
  department TEXT,
  student_batch TEXT,
  special_id TEXT, -- e.g. BDS-PATRON-01 or BDS-COORD-2026
  donor_profile_id TEXT,
  avatar_url TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DONORS DIRECTORY & SEARCH TABLE
CREATE TABLE IF NOT EXISTS public.donors (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Narowal',
  campus TEXT NOT NULL DEFAULT 'UET Narowal Campus',
  area TEXT,
  age INTEGER DEFAULT 21,
  gender TEXT DEFAULT 'Male',
  last_donation_date TEXT,
  availability_status TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'Unavailable', 'Temporarily Ineligible'
  emergency_available BOOLEAN NOT NULL DEFAULT true,
  verification_status TEXT NOT NULL DEFAULT 'Verified', -- 'Verified', 'Pending', 'Rejected'
  donation_count INTEGER NOT NULL DEFAULT 0,
  willing_to_travel_km INTEGER NOT NULL DEFAULT 20,
  notes TEXT,
  student_batch TEXT,
  affiliation TEXT DEFAULT 'Student',
  occupation TEXT,
  has_diseases BOOLEAN DEFAULT false,
  disease_details TEXT,
  has_donated_before BOOLEAN DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOOD REQUESTS & TRACKING TABLE
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id TEXT PRIMARY KEY,
  request_code TEXT UNIQUE NOT NULL,
  requester_id TEXT,
  requester_name TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  alternative_phone TEXT,
  relationship_to_patient TEXT DEFAULT 'Family Member',
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  blood_group TEXT NOT NULL,
  units_required INTEGER NOT NULL DEFAULT 1,
  hospital_name TEXT NOT NULL,
  hospital_city TEXT NOT NULL DEFAULT 'Narowal',
  hospital_campus_area TEXT,
  urgency TEXT NOT NULL DEFAULT 'Urgent', -- 'Critical', 'Urgent', 'Scheduled'
  required_date TEXT NOT NULL,
  required_time TEXT DEFAULT 'As soon as possible',
  case_description TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Donor Search Active', 'Donor Found', 'Donation Confirmed', 'Completed', 'Cancelled'
  assigned_coordinator_id TEXT,
  assigned_coordinator_name TEXT,
  matched_donor_ids JSONB DEFAULT '[]'::jsonb,
  confirmed_donor_id TEXT,
  status_updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMERGENCY ALERTS & LIVE DISPATCH TABLE
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
  id TEXT PRIMARY KEY,
  request_id TEXT REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  hospital TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Narowal',
  contact_phone TEXT NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  broadcast_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT & INQUIRY MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'In Review', 'Resolved'
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ARTICLES & KNOWLEDGE BASE TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  read_time TEXT DEFAULT '4 min read',
  author TEXT NOT NULL,
  author_role TEXT DEFAULT 'BDS Medical Contributor',
  author_email TEXT,
  author_phone TEXT,
  author_affiliation TEXT,
  author_verification_notes TEXT,
  author_cnic_or_roll TEXT,
  approval_status TEXT NOT NULL DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
  rejection_reason TEXT,
  published_date TEXT NOT NULL,
  updated_date TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,
  is_community_submission BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVENTS & CAMPAIGNS (UPCOMING & PAST)
CREATE TABLE IF NOT EXISTS public.events_campaigns (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  date TEXT NOT NULL,
  start_time TEXT DEFAULT '09:00 AM',
  end_time TEXT DEFAULT '04:00 PM',
  venue TEXT NOT NULL,
  campus TEXT NOT NULL DEFAULT 'UET Narowal Campus',
  city TEXT NOT NULL DEFAULT 'Narowal',
  target_units INTEGER NOT NULL DEFAULT 100,
  collected_units INTEGER NOT NULL DEFAULT 0,
  registered_count INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 150,
  status TEXT NOT NULL DEFAULT 'Upcoming', -- 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'
  featured_image TEXT,
  organizer TEXT DEFAULT 'Blood Donor Society UET Narowal',
  eligibility_notes JSONB DEFAULT '[]'::jsonb,
  time_slots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CAMPAIGN REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.campaign_registrations (
  id TEXT PRIMARY KEY,
  registration_code TEXT UNIQUE NOT NULL,
  campaign_id TEXT REFERENCES public.events_campaigns(id) ON DELETE CASCADE,
  campaign_title TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  time_slot TEXT,
  user_category TEXT,
  department TEXT,
  batch TEXT,
  status TEXT NOT NULL DEFAULT 'Registered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS public.volunteers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  campus TEXT NOT NULL DEFAULT 'UET Narowal Campus',
  department TEXT NOT NULL,
  batch TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  preferred_role TEXT,
  statement TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUCCESS STORIES TABLE
CREATE TABLE IF NOT EXISTS public.success_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  patient_reference TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  hospital TEXT NOT NULL,
  story TEXT NOT NULL,
  donor_quote TEXT,
  recipient_quote TEXT,
  date TEXT NOT NULL,
  units_provided INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'Emergency Trauma',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  recipient_role TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'emergency',
  read BOOLEAN NOT NULL DEFAULT false,
  action_link TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  performer_name TEXT NOT NULL,
  performer_role TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  target_id TEXT,
  ip_address TEXT
);

-- ==============================================================================
-- INDEXES FOR FAST QUERIES & REAL-TIME SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_city ON public.donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_avail ON public.donors(availability_status);
CREATE INDEX IF NOT EXISTS idx_donors_emergency ON public.donors(emergency_available);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_blood ON public.blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON public.blood_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.events_campaigns(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for the web client anon API key
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Users
  DROP POLICY IF EXISTS "Public access users" ON public.users;
  CREATE POLICY "Public access users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  
  -- Donors
  DROP POLICY IF EXISTS "Public access donors" ON public.donors;
  CREATE POLICY "Public access donors" ON public.donors FOR ALL USING (true) WITH CHECK (true);
  
  -- Blood Requests
  DROP POLICY IF EXISTS "Public access requests" ON public.blood_requests;
  CREATE POLICY "Public access requests" ON public.blood_requests FOR ALL USING (true) WITH CHECK (true);

  -- Emergency Alerts
  DROP POLICY IF EXISTS "Public access emergency" ON public.emergency_alerts;
  CREATE POLICY "Public access emergency" ON public.emergency_alerts FOR ALL USING (true) WITH CHECK (true);

  -- Contact Messages
  DROP POLICY IF EXISTS "Public access contact" ON public.contact_messages;
  CREATE POLICY "Public access contact" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

  -- Articles
  DROP POLICY IF EXISTS "Public access articles" ON public.articles;
  CREATE POLICY "Public access articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

  -- Events & Campaigns
  DROP POLICY IF EXISTS "Public access events" ON public.events_campaigns;
  CREATE POLICY "Public access events" ON public.events_campaigns FOR ALL USING (true) WITH CHECK (true);

  -- Registrations
  DROP POLICY IF EXISTS "Public access reg" ON public.campaign_registrations;
  CREATE POLICY "Public access reg" ON public.campaign_registrations FOR ALL USING (true) WITH CHECK (true);

  -- Volunteers
  DROP POLICY IF EXISTS "Public access volunteers" ON public.volunteers;
  CREATE POLICY "Public access volunteers" ON public.volunteers FOR ALL USING (true) WITH CHECK (true);

  -- Success Stories
  DROP POLICY IF EXISTS "Public access stories" ON public.success_stories;
  CREATE POLICY "Public access stories" ON public.success_stories FOR ALL USING (true) WITH CHECK (true);

  -- Notifications
  DROP POLICY IF EXISTS "Public access notif" ON public.notifications;
  CREATE POLICY "Public access notif" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

  -- Audit Logs
  DROP POLICY IF EXISTS "Public access audit" ON public.audit_logs;
  CREATE POLICY "Public access audit" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- INITIAL SEED DATA (BDS UET Narowal Initial Real-World Baseline)
-- ==============================================================================

-- Seed Admin, Team and Initial Users
INSERT INTO public.users (id, email, name, phone, role, campus, department, special_id)
VALUES 
  ('u-admin', 'president.bds@narowal.uet.edu.pk', 'Engr. Haris Tariq', '+92 300 8472910', 'admin', 'UET Narowal Campus', 'Electrical Engineering, UET Narowal', 'BDS-PATRON-01'),
  ('u-coord', 'coordinator.emergency@narowal.uet.edu.pk', 'Fatima Noor', '+92 321 4458921', 'coordinator', 'UET Narowal Campus', 'Computer Science, UET Narowal', 'BDS-COORD-2026'),
  ('u-donor-1', 'zain.abideen@student.uet.edu.pk', 'Zain Ul Abideen', '+92 312 9901842', 'donor', 'UET Narowal Campus', 'Mechanical Engineering, UET Narowal', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Donors
INSERT INTO public.donors (
  id, user_id, name, email, phone, blood_group, city, campus, area, age, gender, 
  last_donation_date, availability_status, emergency_available, verification_status, 
  donation_count, willing_to_travel_km, notes, student_batch, affiliation, is_public
)
VALUES 
  ('d-001', 'u-donor-1', 'Zain Ul Abideen', 'zain.abideen@student.uet.edu.pk', '+92 312 9901842', 'O+', 'Narowal', 'UET Narowal Campus', 'Department of Mechanical Engineering, UET Narowal', 22, 'Male', '2024-01-15', 'Available', true, 'Verified', 4, 25, 'Always available for thalassemia pediatric calls at DHQ Hospital.', '2021-2025', 'Student', true),
  ('d-002', 'u-coord', 'Fatima Noor', 'coordinator.emergency@narowal.uet.edu.pk', '+92 321 4458921', 'A+', 'Narowal', 'UET Narowal Campus', 'Department of Computer Science, UET Narowal', 21, 'Female', '2024-02-10', 'Available', true, 'Verified', 3, 15, 'Executive coordinator; campus hall donation drive leader.', '2022-2026', 'Student', true),
  ('d-003', NULL, 'Dr. Muhammad Bilal', 'm.bilal@narowal.uet.edu.pk', '+92 301 7789012', 'B+', 'Narowal', 'UET Narowal Campus', 'Faculty Hostels, UET Narowal', 34, 'Male', '2023-11-20', 'Available', true, 'Verified', 12, 30, 'Senior faculty mentor. Regular O/B positive donor.', 'Faculty', 'Faculty', true),
  ('d-004', NULL, 'Hamza Rafique', 'hamza.rafique@student.uet.edu.pk', '+92 333 5512398', 'O-', 'Narowal', 'UET Narowal Campus', 'Department of Electrical Engineering, UET Narowal', 23, 'Male', '2023-12-05', 'Available', true, 'Verified', 5, 40, 'Universal donor (O-). Critical emergency contact.', '2021-2025', 'Student', true),
  ('d-005', NULL, 'Usman Tariq', 'usman.tariq@gmail.com', '+92 300 6678912', 'AB+', 'Narowal', 'Narowal City & District (General Public)', 'Katchery Road, Narowal City', 28, 'Male', '2024-03-01', 'Available', false, 'Verified', 2, 10, 'Alumni donor resident in Narowal city center.', 'Alumni (2018)', 'Alumni', true),
  ('d-006', NULL, 'Ayesha Siddiqa', 'ayesha.s@student.uet.edu.pk', '+92 345 8890123', 'A-', 'Narowal', 'UET Narowal Campus', 'Girls Hostel Block A, UET Narowal', 20, 'Female', '2024-01-20', 'Available', true, 'Verified', 2, 15, 'Verified negative donor for maternal care.', '2023-2027', 'Student', true),
  ('d-007', NULL, 'Bilal Hassan', 'bilal.h@student.uet.edu.pk', '+92 313 4456789', 'B-', 'Narowal', 'UET Narowal Campus', 'Department of Civil Engineering, UET Narowal', 22, 'Male', '2023-10-18', 'Available', true, 'Verified', 3, 20, 'Civil dept coordinator.', '2022-2026', 'Student', true),
  ('d-008', NULL, 'Saad Mehmood', 'saad.m@student.uet.edu.pk', '+92 322 1122334', 'AB-', 'Narowal', 'UET Narowal Campus', 'Department of Computer Science, UET Narowal', 21, 'Male', '2024-02-28', 'Available', true, 'Verified', 1, 35, 'Rare AB- donor available for emergency plasma/RBC.', '2023-2027', 'Student', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Blood Requests
INSERT INTO public.blood_requests (
  id, request_code, requester_name, requester_phone, patient_name, patient_age, 
  blood_group, units_required, hospital_name, hospital_city, urgency, required_date, 
  case_description, status, assigned_coordinator_name
)
VALUES 
  ('req-001', 'BDS-2026-N01', 'Tariq Mehmood', '+92 300 7891234', 'Zainab Bibi', 32, 'O-', 2, 'DHQ Hospital (Narowal)', 'Narowal', 'Critical', '2026-10-23', 'Post-partum hemorrhage emergency surgery. Need immediate matched O- donors.', 'Donor Search Active', 'Fatima Noor'),
  ('req-002', 'BDS-2026-N02', 'Nadeem Akhtar', '+92 321 6549870', 'Rehan (Thalassemia Patient)', 7, 'B+', 1, 'Sughra Shafi Medical Complex (Narowal)', 'Narowal', 'Urgent', '2026-10-24', 'Routine bi-weekly transfusion for registered pediatric thalassemia patient.', 'Donor Found', 'Engr. Haris Tariq'),
  ('req-003', 'BDS-2026-N03', 'Kashif Ali', '+92 333 4455667', 'Muhammad Iqbal', 58, 'A+', 2, 'Christian Hospital Narowal', 'Narowal', 'Scheduled', '2026-10-25', 'Elective orthopedic surgery scheduled for Sunday morning.', 'Submitted', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Emergency Alert
INSERT INTO public.emergency_alerts (
  id, request_id, patient_name, blood_group, hospital, city, contact_phone, units_needed, is_active, broadcast_notes
)
VALUES 
  ('emg-001', 'req-001', 'Zainab Bibi', 'O-', 'DHQ Hospital (Narowal)', 'Narowal', '+92 300 7891234', 2, true, 'CRITICAL: Immediate O- Negative donors needed at DHQ Emergency OT!')
ON CONFLICT (id) DO NOTHING;

-- Seed Events / Campaigns
INSERT INTO public.events_campaigns (
  id, slug, title, subtitle, description, date, start_time, end_time, venue, campus, city, target_units, collected_units, registered_count, capacity, status, featured_image
)
VALUES 
  ('camp-001', 'uet-spring-mega-blood-camp-2026', 'Annual Spring Mega Blood Camp 2026', 'Saving Lives Across Narowal District with Red Crescent', 'Join BDS UET Narowal in our flagship semester blood drive. Free CBC test, blood grouping, snacks, and official social internship certificate provided to every donor.', '2026-11-10', '09:00 AM', '04:30 PM', 'Central Library Auditorium & Medical Center', 'UET Narowal Campus', 'Narowal', 120, 0, 48, 150, 'Upcoming', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&h=600&fit=crop'),
  ('camp-002', 'cs-it-departmental-drive-2026', 'CS & IT Departmental Blood Drive', 'Code for Hope & Life', 'Department-wide blood donation drive organized by CS students & faculty in collaboration with Sughra Shafi Medical Complex.', '2026-10-15', '09:30 AM', '03:00 PM', 'CS Department Foyer, Academic Block', 'UET Narowal Campus', 'Narowal', 45, 52, 55, 60, 'Completed', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&h=600&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Seed Success Stories
INSERT INTO public.success_stories (
  id, title, patient_reference, blood_group, hospital, story, donor_quote, recipient_quote, date, units_provided, category
)
VALUES 
  ('story-001', '35 Minutes to Midnight: Saving Little Ahmed', 'Ahmed, 8-year-old Thalassemia patient', 'B+', 'Sughra Shafi Medical Complex (Narowal)', 'When Ahmed HB count plummeted to 4.2 g/dL during a severe anemia episode, BDS emergency hotline was dialed at 11:20 PM. Within 35 minutes, mechanical engineering student Zain arrived on a motorcycle and donated directly.', 'Seeing Ahmed smile when the bag was connected made every late-night ride worth it.', 'We thought we would have to rush to Lahore. UET boys saved our only child.', '2024-03-12', 1, 'Thalassemia Support'),
  ('story-002', 'Emergency Trauma Response for Road Accident Victim', 'Bashir Ahmed, 46, Farmer', 'O-', 'DHQ Hospital (Narowal)', 'Two critically injured accident victims arrived simultaneously at DHQ trauma room. Rare O- negative blood was completely out of stock. BDS emergency broadcast matched 3 UET electrical engineering students within 20 minutes.', 'As universal donors, we are on constant standby. Donating blood is our national duty.', 'Doctors said he wouldn’t have survived the night without those two pints.', '2024-02-18', 2, 'Emergency Trauma')
ON CONFLICT (id) DO NOTHING;
