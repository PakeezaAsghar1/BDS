import React, { useEffect, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

// Homepage is loaded eagerly for instant FCP/LCP
import { HomePage } from './components/pages/HomePage';

// Route-level code splitting: all secondary pages loaded on-demand
const FindDonorPage = lazy(() => import('./components/pages/FindDonorPage').then(m => ({ default: m.FindDonorPage })));
const BecomeDonorPage = lazy(() => import('./components/pages/BecomeDonorPage').then(m => ({ default: m.BecomeDonorPage })));
const RequestBloodPage = lazy(() => import('./components/pages/RequestBloodPage').then(m => ({ default: m.RequestBloodPage })));
const TrackRequestPage = lazy(() => import('./components/pages/TrackRequestPage').then(m => ({ default: m.TrackRequestPage })));
const CampaignsPage = lazy(() => import('./components/pages/CampaignsPage').then(m => ({ default: m.CampaignsPage })));
const CampaignDetailPage = lazy(() => import('./components/pages/CampaignDetailPage').then(m => ({ default: m.CampaignDetailPage })));
const VolunteersPage = lazy(() => import('./components/pages/VolunteersPage').then(m => ({ default: m.VolunteersPage })));
const GuidePage = lazy(() => import('./components/pages/GuidePage').then(m => ({ default: m.GuidePage })));
const ArticleDetailPage = lazy(() => import('./components/pages/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const StoriesPage = lazy(() => import('./components/pages/StoriesPage').then(m => ({ default: m.StoriesPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DonorDashboard = lazy(() => import('./components/pages/DonorDashboard').then(m => ({ default: m.DonorDashboard })));
const RequesterDashboard = lazy(() => import('./components/pages/RequesterDashboard').then(m => ({ default: m.RequesterDashboard })));
const AdminConsole = lazy(() => import('./components/pages/AdminConsole').then(m => ({ default: m.AdminConsole })));
const GalleryPage = lazy(() => import('./components/pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const TeamPage = lazy(() => import('./components/pages/TeamPage').then(m => ({ default: m.TeamPage })));
const TeamDashboard = lazy(() => import('./components/pages/TeamDashboard').then(m => ({ default: m.TeamDashboard })));
const AuthPage = lazy(() => import('./components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const Chatbot = lazy(() => import('./components/common/Chatbot').then(m => ({ default: m.Chatbot })));

const PageLoader: React.FC = () => (
  <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-pulse">
    <div className="w-9 h-9 rounded-full border-3 border-[#B4232C] border-t-transparent animate-spin mb-3" />
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading BDS...</span>
  </div>
);

interface PageRendererProps {
  authScreen: 1 | 2;
  setAuthScreen: (screen: 1 | 2) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({ authScreen: _authScreen, setAuthScreen }) => {
  const { currentPage } = useApp();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'find-donor':
        return <FindDonorPage />;
      case 'become-donor':
        return <BecomeDonorPage />;
      case 'request-blood':
        return <RequestBloodPage isEmergencyDefault={false} />;
      case 'emergency-request':
        return <RequestBloodPage isEmergencyDefault={true} />;
      case 'track-request':
        return <TrackRequestPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'campaign-detail':
        return <CampaignDetailPage />;
      case 'volunteers':
        return <VolunteersPage />;
      case 'guide':
        return <GuidePage />;
      case 'article-detail':
        return <ArticleDetailPage />;
      case 'stories':
        return <StoriesPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'donor-dashboard':
      case 'donor/dashboard':
      case '/donor/dashboard':
        return <DonorDashboard />;
      case 'team-dashboard':
      case 'team/dashboard':
      case '/team/dashboard':
        return <TeamDashboard />;
      case 'requester-dashboard':
        return <RequesterDashboard />;
      case 'admin':
      case 'admin-dashboard':
      case 'admin/dashboard':
      case '/admin/dashboard':
        return <AdminConsole />;
      case 'gallery':
        return <GalleryPage />;
      case 'team':
        return <TeamPage />;
      case 'login':
        return <AuthPage key="login" initialMode="login" onScreenChange={setAuthScreen} />;
      case 'register':
        return <AuthPage key="register" initialMode="register" onScreenChange={setAuthScreen} />;
      case 'auth':
        return <AuthPage key="auth" initialMode="login" onScreenChange={setAuthScreen} />;
      default:
        return <HomePage />;
    }
  };

  if (currentPage === 'home') {
    return renderContent();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      {renderContent()}
    </Suspense>
  );
};

const AppContent: React.FC<{ quotaExceeded: boolean }> = ({ quotaExceeded }) => {
  const { currentPage } = useApp();
  const [authScreen, setAuthScreen] = React.useState<1 | 2>(1);

  // Reset to Screen 1 whenever route changes
  React.useEffect(() => {
    setAuthScreen(1);
  }, [currentPage]);

  const isAuthPage = currentPage === 'login' || currentPage === 'register' || currentPage === 'auth';
  const isDashboardPage =
    currentPage === 'donor-dashboard' ||
    currentPage === 'donor/dashboard' ||
    currentPage === '/donor/dashboard' ||
    currentPage === 'admin' ||
    currentPage === 'admin-dashboard' ||
    currentPage === 'team-dashboard' ||
    currentPage === 'team/dashboard' ||
    currentPage === 'requester-dashboard' ||
    currentPage?.includes('dashboard');

  // Keep navbar on the first page of login/register (Screen 1) and hide on Screen 2; hide on donor, team, and admin dashboards
  const showNavbar = (!isAuthPage || authScreen === 1) && !isDashboardPage;
  const showFooter = !isAuthPage && !isDashboardPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {showNavbar && <Navbar />}
      <main className="flex-1 flex flex-col" id="main-app-content">
        <PageRenderer authScreen={authScreen} setAuthScreen={setAuthScreen} />
      </main>
      {showFooter && <Footer />}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = React.useState(false);

  React.useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  return (
    <AppProvider>
      <AppContent quotaExceeded={quotaExceeded} />
    </AppProvider>
  );
}
