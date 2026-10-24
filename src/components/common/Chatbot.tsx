import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  User,
  Trash2,
  Minimize2,
  ChevronUp,
  Copy,
  Check,
  PhoneCall,
  ShieldCheck,
  Heart,
  Calendar,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Mascot image uploaded by user
const BOT_AVATAR = '/assets/aistudio/file_0000000074808211b237624af39030a2_2ddffe91.png';

export interface ActionButton {
  label: string;
  page: string;
  description: string;
  variant?: 'primary' | 'emergency' | 'secondary';
}

export interface ChatQuestionItem {
  id: string;
  category: 'donate' | 'events' | 'emergency' | 'compatibility' | 'volunteer' | 'contact' | 'faq';
  question: string;
  shortLabel: string;
  iconName: string;
  answerMarkdown: string;
  actionButton?: ActionButton;
  suggestedFollowUps?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionButton?: ActionButton;
  suggestedFollowUps?: string[];
}

// Curated verified knowledge base for BDS UET Narowal
export const CURATED_QUESTIONS: ChatQuestionItem[] = [
  {
    id: 'how-to-donate',
    category: 'donate',
    question: 'How can I donate blood?',
    shortLabel: 'How to Donate Blood',
    iconName: 'Droplet',
    answerMarkdown: `**Blood Donation Eligibility & Requirements**

To donate blood safely with BDS UET Narowal, please review these clinical guidelines:

- **Age**: 18 to 60 years old
- **Weight**: Minimum 50 kg (110 lbs)
- **Hemoglobin**: Minimum 12.5 g/dL (tested on-the-spot in under 60 seconds)
- **Donation Gap**: At least 90 days (3 months) since your last donation (120 days for female donors)
- **Health Vitals**: Blood pressure within 100/60 to 140/90 mmHg; resting pulse 60–100 bpm; free from active cold, fever, or infectious conditions
- **Pre-Donation Prep**: Drink 500ml of water, eat a healthy breakfast/meal 2–3 hours beforehand, and ensure 6–8 hours of restful sleep

**What to Expect during Donation**:
- Total time is only **15–20 minutes** (actual blood drawing is only 8–10 minutes)
- 100% sterile, single-use disposable kits (zero infection risk)
- Free clinical screening, verified blood grouping card, official certificate, and energetic refreshments!

Ready to save lives? Click the button below to register on our **Donate** page.`,
    actionButton: {
      label: 'Fill Donor Form on Donate Page',
      page: 'become-donor',
      description: 'Takes only 2 minutes to join our active emergency donor roster.',
      variant: 'primary',
    },
    suggestedFollowUps: ['Upcoming blood camps & events', 'Blood group compatibility matrix', 'Is blood donation safe for health?'],
  },
  {
    id: 'upcoming-events',
    category: 'events',
    question: 'What are the upcoming blood camps and events?',
    shortLabel: 'Upcoming Events & Camps',
    iconName: 'Calendar',
    answerMarkdown: `**Upcoming BDS UET Narowal Blood Drives & Events**

We have two major life-saving campaigns scheduled on campus:

1. **Annual Grand UET Narowal Blood Drive 2026**
   - **Date**: September 15, 2026
   - **Timings**: 09:00 AM – 05:00 PM
   - **Venue**: Main Campus Lawn & Student Affairs Center, UET Narowal Campus
   - **Partner**: DHQ Hospital Narowal
   - **Target**: 300 Blood Units for district hospital trauma units and thalassemic children
   - **Donor Perks**: Free complete medical checkup, official Certificate of Appreciation, donor grouping card, and refreshments lounge

2. **UET Narowal Thalassemia Support & Screening Drive**
   - **Date**: September 24, 2026
   - **Timings**: 10:00 AM – 04:00 PM
   - **Venue**: Auditorium Hall, Admin Block, UET Narowal Campus
   - **Partner**: Red Crescent Narowal & District Health Authority
   - **Target**: 180 Units for pediatric thalassemia patients requiring monthly transfusions

You can reserve your preferred time slot and view full details on our **Events** page.`,
    actionButton: {
      label: 'Go to Events Page & Reserve Slot',
      page: 'campaigns',
      description: 'Browse schedules, time slots, and register for campus blood drives.',
      variant: 'primary',
    },
    suggestedFollowUps: ['How can I donate blood?', 'Thalassemia patient care in Narowal', 'Contact BDS helpline & office'],
  },
  {
    id: 'emergency-request',
    category: 'emergency',
    question: 'How to request emergency blood in Narowal?',
    shortLabel: 'Emergency Blood Request',
    iconName: 'AlertTriangle',
    answerMarkdown: `**Emergency Blood Request Protocol in Narowal**

If a patient urgently requires blood at DHQ Hospital Narowal, Christian Hospital, Sughra Shafi Hospital, or any nearby clinic:

- **Fast Dispatch**: BDS coordinators alert registered campus and city donors within **15 to 30 minutes**
- **24/7 BDS Volunteer Hotline**: **+92 312 9901842** or **+92 300 1234567**
- **Life-Threatening Trauma**: Please dial **Rescue 1122** immediately alongside your request
- **Information Needed**: Patient name, hospital name & ward number, exact blood group, required units, and attendant phone number

Please submit an **Emergency Request** immediately so our coordinators can broadcast the requirement.`,
    actionButton: {
      label: 'Submit Emergency Blood Request',
      page: 'emergency-request',
      description: 'Direct high-priority alert dispatched to available local donors.',
      variant: 'emergency',
    },
    suggestedFollowUps: ['Blood group compatibility matrix', 'Contact BDS helpline & office', 'How can I donate blood?'],
  },
  {
    id: 'compatibility-guide',
    category: 'compatibility',
    question: 'What is the blood group compatibility guide?',
    shortLabel: 'Blood Compatibility Guide',
    iconName: 'GitBranch',
    answerMarkdown: `**Blood Group Compatibility Matrix**

Knowing compatible blood types is critical during emergencies:

- **O- (Universal Red Cell Donor)**: Can donate whole red blood cells to **ALL 8 blood groups** (O-, O+, A-, A+, B-, B+, AB-, AB+). Can only receive blood from O-.
- **O+**: Can donate to O+, A+, B+, AB+. Can receive from O+ and O-.
- **A-**: Can donate to A-, A+, AB-, AB+. Can receive from A- and O-.
- **A+**: Can donate to A+ and AB+. Can receive from A+, A-, O+, O-.
- **B-**: Can donate to B-, B+, AB-, AB+. Can receive from B- and O-.
- **B+**: Can donate to B+ and AB+. Can receive from B+, B-, O+, O-.
- **AB-**: Can donate to AB- and AB+. Can receive from AB-, A-, B-, O-.
- **AB+ (Universal Recipient)**: Can receive red blood cells from **EVERY blood group**!

Looking for a specific blood group in Narowal? You can search our verified donor database.`,
    actionButton: {
      label: 'Search Compatible Donors in Narowal',
      page: 'find-donor',
      description: 'Filter verified student and community donors by blood group and city.',
      variant: 'secondary',
    },
    suggestedFollowUps: ['How can I donate blood?', 'How to request emergency blood in Narowal?', 'Upcoming blood camps & events'],
  },
  {
    id: 'thalassemia-support',
    category: 'faq',
    question: 'What is Thalassemia and how does BDS help?',
    shortLabel: 'Thalassemia Patient Care',
    iconName: 'Heart',
    answerMarkdown: `**Thalassemia Support & Patient Care at BDS UET Narowal**

- **The Challenge**: Children with Thalassemia Major cannot produce sufficient hemoglobin naturally and require fresh packed red blood cell transfusions every **15 to 21 days** for life.
- **BDS Adoption Roster**: Blood Donor Society UET Narowal maintains a specialized roster of registered repeat donors paired with pediatric thalassemia patients across Narowal district.
- **Strict Quality & Safety**: All donated units undergo thorough cross-matching and mandatory viral screenings (Hepatitis B & C, HIV, Syphilis, Malaria).
- **Preventive Screening**: BDS organizes pre-marital Thalassemia Minor screening awareness campaigns to eradicate the condition in future generations.

Learn more about BDS UET Narowal's mission and humanitarian history on our **About** page.`,
    actionButton: {
      label: 'Learn More on About Page',
      page: 'about',
      description: 'Read about BDS UET Narowal founding, values, and community impact.',
      variant: 'secondary',
    },
    suggestedFollowUps: ['Upcoming blood camps & events', 'How can I donate blood?', 'How can I join BDS UET Narowal as a volunteer?'],
  },
  {
    id: 'volunteer-join',
    category: 'volunteer',
    question: 'How can I join BDS UET Narowal as a volunteer?',
    shortLabel: 'Join BDS as Volunteer',
    iconName: 'Users',
    answerMarkdown: `**Join Blood Donor Society UET Narowal as a Volunteer**

We welcome motivated students who want to create a direct humanitarian impact:

- **Who Can Join**: All enrolled students from all departments (Electrical, Mechanical, Civil, Computer Science, Basic Sciences) and alumni of UET Narowal.
- **Volunteer Wings & Roles**:
  - **Emergency Response & Hospital Liaison**: Fast donor coordination and hospital follow-ups.
  - **Event & Camp Management**: Logistics, donor reception, and refreshments at campus drives.
  - **Media, Creative & Public Relations**: Photography, video, graphic design, and social campaigns.
  - **Donor Outreach & Community Awareness**: Class-to-class campaigns and hostel briefings.
- **Perks**: Leadership certification, management experience, official BDS merchandise, and life-saving gratification.

Submit your application today through our **Volunteers** page!`,
    actionButton: {
      label: 'Apply to Join as a Volunteer',
      page: 'volunteers',
      description: 'Fill our quick volunteer application and join the BDS family.',
      variant: 'primary',
    },
    suggestedFollowUps: ['Upcoming blood camps & events', 'Contact BDS helpline & office', 'How can I donate blood?'],
  },
  {
    id: 'contact-helpline',
    category: 'contact',
    question: 'How can I contact the BDS helpline and campus office?',
    shortLabel: 'Contact Helpline & Office',
    iconName: 'PhoneCall',
    answerMarkdown: `**Contact Blood Donor Society UET Narowal**

Our volunteer coordinators are on standby 24 hours a day, 7 days a week:

- **Campus Office**: Student Affairs Center / BDS Desk, UET Narowal Campus, Muridke-Narowal Road, Narowal.
- **24/7 Helpline & WhatsApp**: **+92 312 9901842** / **+92 300 1234567**
- **Official Email**: \`bds@narowal.uet.edu.pk\`
- **Emergency Hours**: Open 24/7 for urgent hospital blood requests in Narowal district.
- **General Inquiries**: Mon–Fri 09:00 AM – 05:00 PM.

You can also send a direct inquiry or view our campus location on our **Contact** page.`,
    actionButton: {
      label: 'Visit Official Contact Page',
      page: 'contact',
      description: 'Send an inquiry message or view our interactive location map.',
      variant: 'secondary',
    },
    suggestedFollowUps: ['How to request emergency blood in Narowal?', 'Upcoming blood camps & events', 'How can I donate blood?'],
  },
  {
    id: 'safety-benefits',
    category: 'faq',
    question: 'Is donating blood safe for my health?',
    shortLabel: 'Safety & Health Benefits',
    iconName: 'ShieldCheck',
    answerMarkdown: `**Health Benefits & Safety of Blood Donation**

Donating blood is completely safe, healthy, and highly beneficial for your body:

- **100% Sterile**: Every needle, tube, and blood collection bag is brand-new, sterile, and used once only before medical incineration.
- **Fast Natural Recovery**: Your body regenerates lost blood plasma within 24 to 48 hours. Red blood cells are replenished naturally within 4 to 6 weeks.
- **Cardiovascular Health**: Regular voluntary donation helps regulate blood viscosity and maintain healthy iron stores.
- **Free Health Check**: Every donation includes free checks for blood pressure, pulse, hemoglobin, and infectious disease screenings.
- **Mental Well-being**: The psychological satisfaction of directly saving up to 3 human lives is unmatched!

Take the step today by registering on our **Donate** page.`,
    actionButton: {
      label: 'Fill Donor Form on Donate Page',
      page: 'become-donor',
      description: 'Register as a voluntary donor and help save lives.',
      variant: 'primary',
    },
    suggestedFollowUps: ['How can I donate blood?', 'Upcoming blood camps & events', 'Blood group compatibility matrix'],
  },
];

const INITIAL_WELCOME: ChatMessage = {
  id: 'init-msg',
  role: 'assistant',
  content: `Assalam-o-Alaikum & Welcome! 👋 I am your **BDS AI Assistant** for Blood Donor Society UET Narowal.

To ensure fast, clinically verified, and accurate guidance, **freeform typing is disabled**. Please select any question below to get instant details and direct links to register, view events, or submit emergency requests.`,
  timestamp: 'Just now',
  suggestedFollowUps: [
    'How can I donate blood?',
    'What are the upcoming blood camps and events?',
    'How to request emergency blood in Narowal?',
    'What is the blood group compatibility guide?',
  ],
};

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'donate', label: '🩸 Donate Blood' },
  { id: 'events', label: '📅 Events & Camps' },
  { id: 'emergency', label: '🚨 Emergency' },
  { id: 'compatibility', label: '🧬 Compatibility' },
  { id: 'volunteer', label: '🤝 Volunteer' },
  { id: 'contact', label: '📞 Contact' },
];

export const Chatbot: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSelectQuestion = (questionItem: ChatQuestionItem) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionItem.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate natural thinking/answering latency (350ms)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: questionItem.answerMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: questionItem.actionButton,
        suggestedFollowUps: questionItem.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 350);
  };

  const handleFollowUpClick = (questionText: string) => {
    const matched = CURATED_QUESTIONS.find(
      (q) => q.question.toLowerCase() === questionText.toLowerCase() || q.shortLabel.toLowerCase() === questionText.toLowerCase()
    );
    if (matched) {
      handleSelectQuestion(matched);
    } else {
      // Find closest
      const partial = CURATED_QUESTIONS.find(
        (q) => q.question.toLowerCase().includes(questionText.toLowerCase().slice(0, 10))
      );
      if (partial) {
        handleSelectQuestion(partial);
      }
    }
  };

  const handleActionClick = (action: ActionButton) => {
    navigate(action.page);
    showToast('Navigating...', `Opened the ${action.label.replace('Go to ', '').replace('Fill ', '')} for you.`, 'info');
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied to clipboard', 'Message text copied.', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
  };

  // Filter questions by active category
  const filteredQuestions = activeCategory === 'all'
    ? CURATED_QUESTIONS
    : CURATED_QUESTIONS.filter((q) => q.category === activeCategory);

  // Formatter for rich markdown elements
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ');
      const cleanLine = isBullet ? line.trim().replace(/^[-*•]\s+/, '') : line;

      // Parse bold segments **bold**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
            <span className="text-slate-700 leading-relaxed">{renderedParts}</span>
          </div>
        );
      }

      if (!cleanLine.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="text-slate-700 leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          {/* Tooltip badge */}
          <div
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-xl border border-red-200/90 hover:border-red-400 hover:bg-red-50/70 transition-all cursor-pointer animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need Help? Ask BDS AI</span>
            <ChevronRight className="w-3.5 h-3.5 text-red-600 -ml-0.5" />
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center justify-center w-15 h-15 rounded-full bg-gradient-to-tr from-red-700 via-rose-600 to-red-600 p-0.5 text-white shadow-2xl hover:shadow-red-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500/30"
            aria-label="Open BDS Chatbot"
            title="Chat with BDS AI Assistant"
            id="bds-chatbot-launcher"
          >
            {/* Ping aura */}
            <span className="absolute -inset-1 rounded-full bg-red-500/25 animate-ping pointer-events-none" />

            {/* Mascot Icon Container */}
            <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={BOT_AVATAR}
                alt="BDS AI Mascot Icon"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 select-none"
              />
            </div>

            {/* Active Green Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
            isMinimized
              ? 'bottom-5 right-5 w-80 h-16'
              : 'bottom-3 right-3 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[430px] h-[640px] max-h-[90vh]'
          }`}
          id="bds-chatbot-window"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white select-none shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-white/40">
                <img
                  src={BOT_AVATAR}
                  alt="BDS AI Mascot"
                  className="w-full h-full object-contain select-none rounded-xl"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-red-800 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">BDS AI Assistant</h3>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-white/20 text-white rounded-md tracking-wider">
                    24/7 Verified
                  </span>
                </div>
                <p className="text-[11px] text-red-100 flex items-center gap-1">
                  <span>Blood Donor Society UET Narowal</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Emergency Fast Banner */}
              <div className="bg-red-50 border-b border-red-100 px-3.5 py-2 flex items-center justify-between text-xs text-red-900">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate font-medium">Need urgent blood in Narowal right now?</span>
                </div>
                <button
                  onClick={() => {
                    navigate('emergency-request');
                    showToast('Emergency Request', 'Redirecting to emergency dispatch form.', 'warning');
                  }}
                  className="font-bold underline text-red-700 hover:text-red-900 shrink-0 text-[11px] ml-2 cursor-pointer flex items-center gap-0.5"
                >
                  <span>Request Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs sm:text-sm">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm border border-red-200/90 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={BOT_AVATAR}
                            alt="BDS Mascot"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className="relative group max-w-[85%] sm:max-w-[80%]">
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-xs leading-relaxed text-xs sm:text-sm ${
                            isUser
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-xs font-medium'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div>
                              {renderFormattedText(msg.content)}

                              {/* Interactive Action Button embedded in message */}
                              {msg.actionButton && (
                                <div className="mt-3.5 pt-3 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => handleActionClick(msg.actionButton!)}
                                    className={`w-full group/btn flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer ${
                                      msg.actionButton.variant === 'emergency'
                                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                                        : msg.actionButton.variant === 'secondary'
                                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                        : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-red-600/25'
                                    }`}
                                  >
                                    <div className="text-left">
                                      <div className="flex items-center gap-1.5 font-bold">
                                        <span>{msg.actionButton.label}</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
                                      </div>
                                      {msg.actionButton.description && (
                                        <p className="text-[10px] text-white/85 font-normal mt-0.5">
                                          {msg.actionButton.description}
                                        </p>
                                      )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 shrink-0 group-hover/btn:translate-x-1 transition-transform ml-2" />
                                  </button>
                                </div>
                              )}

                              {/* Follow-up question chips */}
                              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                                <div className="mt-3 pt-2.5 border-t border-slate-100">
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                    Related Inquiries:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {msg.suggestedFollowUps.map((fu, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleFollowUpClick(fu)}
                                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-50/70 hover:bg-red-100/80 text-red-700 border border-red-200/70 transition-colors text-left flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>{fu}</span>
                                        <ChevronRight className="w-2.5 h-2.5 text-red-500 shrink-0" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Message Meta & Copy */}
                        <div
                          className={`flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-opacity p-0.5 cursor-pointer ml-1"
                              title="Copy response"
                              aria-label="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm border border-red-200/90 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={BOT_AVATAR}
                        alt="BDS Mascot"
                        className="w-full h-full object-contain animate-bounce"
                      />
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.3s]" />
                        <span className="text-xs text-slate-400 font-medium ml-1.5">
                          Fetching verified clinical answer...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Suggested Question Selector (Freeform typing is restricted) */}
              <div className="border-t border-slate-200/80 bg-white p-3 space-y-2.5 shadow-md">
                {/* Header note about restricted messaging */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>Choose a Question:</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Verified BDS Knowledge Base
                  </span>
                </div>

                {/* Topic Categories Filter */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Suggested Questions Grid/List */}
                <div className="max-h-36 sm:max-h-40 overflow-y-auto space-y-1.5 pr-0.5">
                  {filteredQuestions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSelectQuestion(q)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50/80 hover:border-red-300 border border-slate-200/80 transition-all flex items-center justify-between gap-2 group cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-red-700 truncate">
                          {q.question}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Footer helpline info */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Freeform typing restricted for clinical accuracy</span>
                  </span>
                  <a
                    href="tel:+923129901842"
                    className="hover:text-red-600 font-medium flex items-center gap-1 text-slate-500 transition-colors"
                  >
                    <PhoneCall className="w-2.5 h-2.5 text-red-600" />
                    <span>24/7 BDS Hotline</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
