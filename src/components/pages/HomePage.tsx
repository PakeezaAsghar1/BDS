import React from 'react';
import { HeroSection } from '../home/HeroSection';
import { KnowledgeCardsSection } from '../home/KnowledgeCardsSection';
import { ImpactBar } from '../home/ImpactBar';
import { AboutSection } from '../home/AboutSection';
import { HeroSearchSection } from '../home/HeroSearchSection';
import { HowItWorks } from '../home/HowItWorks';
import { CampaignsPreview } from '../home/CampaignsPreview';
import { BloodGroupExplorer } from '../home/BloodGroupExplorer';
import { StoriesSection } from '../home/StoriesSection';
import { GallerySection } from '../home/GallerySection';
import { VolunteerCTA } from '../home/VolunteerCTA';
import { FAQSection } from '../home/FAQSection';

export const HomePage: React.FC = () => {
  return (
    <div id="home-page-container">
      <HeroSection />
      <ImpactBar />
      <KnowledgeCardsSection />
      <HeroSearchSection />
      <HowItWorks />
      <CampaignsPreview />
      <BloodGroupExplorer />
      <AboutSection />
      <GallerySection />
      <StoriesSection />
      <VolunteerCTA />
      <FAQSection />
    </div>
  );
};
