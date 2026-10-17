import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

// Pages
import { HomePage } from './components/pages/HomePage';
import { FindDonorPage } from './components/pages/FindDonorPage';
import { BecomeDonorPage } from './components/pages/BecomeDonorPage';
import { RequestBloodPage } from './components/pages/RequestBloodPage';
import { TrackRequestPage } from './components/pages/TrackRequestPage';
import { CampaignsPage } from './components/pages/CampaignsPage';
import { CampaignDetailPage } from './components/pages/CampaignDetailPage';
import { VolunteersPage } from './components/pages/VolunteersPage';
import { GuidePage } from './components/pages/GuidePage';
import { ArticleDetailPage } from './components/pages/ArticleDetailPage';
import { StoriesPage } from './components/pages/StoriesPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DonorDashboard } from './components/pages/DonorDashboard';
import { RequesterDashboard } from './components/pages/RequesterDashboard';
import { AdminConsole } from './components/pages/AdminConsole';

const PageRenderer: React.FC = () => {
  const { currentPage } = useApp();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
      return <DonorDashboard />;
    case 'requester-dashboard':
      return <RequesterDashboard />;
    case 'admin':
      return <AdminConsole />;
    default:
      return <HomePage />;
  }
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
        <Navbar />
        <main className="flex-1" id="main-app-content">
          <PageRenderer />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
