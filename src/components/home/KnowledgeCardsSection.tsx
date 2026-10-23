import React from 'react';
import { ArrowRight, BookOpen, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';

interface PinProps {
  color: 'coral' | 'blue' | 'purple';
  offsetY?: number;
  offsetX?: number;
  isRevealed?: boolean;
  enterX?: number;
  enterDelay?: number;
  hasSettled?: boolean;
}

const PushPin: React.FC<PinProps> = ({
  color,
  offsetY = 0,
  offsetX = 0,
  isRevealed = true,
  enterX = 0,
  enterDelay = 0,
  hasSettled = false,
}) => {
  const colorMap = {
    coral: {
      headGrad1: '#FF5E4D',
      headGrad2: '#D92D20',
      shadow: 'rgba(217, 45, 32, 0.4)',
      highlight: '#FFB2A8',
      base: '#991B1B',
      glow: 'rgba(239, 68, 68, 0.28)',
    },
    blue: {
      headGrad1: '#3B82F6',
      headGrad2: '#1D4ED8',
      shadow: 'rgba(29, 78, 216, 0.4)',
      highlight: '#BFDBFE',
      base: '#1E3A8A',
      glow: 'rgba(59, 130, 246, 0.28)',
    },
    purple: {
      headGrad1: '#8B5CF6',
      headGrad2: '#6D28D9',
      shadow: 'rgba(109, 40, 217, 0.4)',
      highlight: '#DDD6FE',
      base: '#4C1D95',
      glow: 'rgba(139, 92, 246, 0.28)',
    },
  };

  const c = colorMap[color];

  return (
    <div
      className="absolute -top-3.5 left-1/2 z-20 pointer-events-none select-none will-change-transform"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: !isRevealed
          ? `translate3d(calc(-50% + ${enterX}px), 0, 0)`
          : hasSettled
          ? `translate3d(calc(-50% + ${offsetX}px), ${offsetY}px, 0)`
          : 'translate3d(-50%, 0, 0)',
        transition: !isRevealed
          ? 'none'
          : hasSettled
          ? 'transform 100ms ease-out, opacity 300ms ease-out'
          : `opacity 750ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms, transform 750ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms`,
      }}
    >
      {/* Soft color glow matching reference image */}
      <div
        className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-[6px] pointer-events-none -z-10"
        style={{ backgroundColor: c.glow }}
      />

      {/* 3D Push Pin with realistic highlight and ambient shadow */}
      <svg
        className="w-6 h-7 drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)]"
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient pin shadow */}
          <radialGradient id={`shadow-${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Main translucent pin head gradient */}
          <linearGradient id={`pinHead-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.headGrad1} />
            <stop offset="100%" stopColor={c.headGrad2} />
          </linearGradient>
          {/* Top specular highlight */}
          <linearGradient id={`pinSpec-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Needle shadow */}
        <ellipse cx="16" cy="33" rx="4.5" ry="2" fill={`url(#shadow-${color})`} />
        {/* Needle metal tip */}
        <path d="M15 20 L16 32 L17 20 Z" fill="#94A3B8" />

        {/* Pin base disc */}
        <ellipse cx="16" cy="19" rx="7.5" ry="3.5" fill={c.base} opacity="0.9" />
        <ellipse cx="16" cy="18.5" rx="7" ry="3" fill={`url(#pinHead-${color})`} />

        {/* Pin middle stem */}
        <path
          d="M11.5 10 C11.5 15, 13 18, 16 18 C19 18, 20.5 15, 20.5 10 Z"
          fill={`url(#pinHead-${color})`}
        />

        {/* Pin spherical head */}
        <circle cx="16" cy="9" r="7.5" fill={`url(#pinHead-${color})`} />
        {/* Specular glossy glass highlight */}
        <ellipse cx="13.5" cy="6.5" rx="3.5" ry="2" fill={`url(#pinSpec-${color})`} />
      </svg>
    </div>
  );
};

export const KnowledgeCardsSection: React.FC = () => {
  const { navigate } = useApp();
  const sectionRef = React.useRef<HTMLElement>(null);
  const [scrollFactor, setScrollFactor] = React.useState(0);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [hasSettled, setHasSettled] = React.useState(false);

  React.useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || 800;
        const totalDistance = windowHeight + rect.height;
        const currentPos = windowHeight - rect.top;
        const rawProgress = currentPos / totalDistance;
        const progress = Math.max(0, Math.min(1, rawProgress));
        // Normalized progress: -1 (entering viewport) to 0 (centered) to +1 (exiting viewport)
        const normalized = (progress - 0.5) * 2;
        setScrollFactor(normalized);

        // When moving down and section enters view (top is within 82% of screen)
        if (rect.top <= windowHeight * 0.82) {
          setIsRevealed(true);
        } else if (rect.top > windowHeight * 1.05) {
          // Reset if user scrolls back above the section so it re-triggers on move down
          setIsRevealed(false);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        setHasSettled(true);
      }, 1300);
      return () => clearTimeout(timer);
    } else {
      setHasSettled(false);
    }
  }, [isRevealed]);

  const cardMotions = [
    { parallaxMultiplier: 22, tiltMultiplier: 1.4, horizontalMultiplier: 42 }, // Card 1: comes from left to right as you scroll down
    { parallaxMultiplier: 34, tiltMultiplier: -1.8, horizontalMultiplier: -52 }, // Card 2: comes from right to left as you scroll down
    { parallaxMultiplier: 20, tiltMultiplier: 1.1, horizontalMultiplier: 40 }, // Card 3: comes from left to right as you scroll down
  ];

  const cards = [
    {
      num: '01',
      title: 'Why is Blood Donation Important?',
      description:
        'A single whole blood donation can save up to three lives. Blood cannot be manufactured in a lab—it relies entirely on generous voluntary donors for accident trauma cases, emergency surgeries, and thalassemic patients.',
      actionText: 'Learn More',
      color: 'coral' as const,
      rotation: 'rotate-[-2deg]',
      hoverRotation: 'hover:rotate-0',
      tintBg: 'bg-[#FFF5ED]',
      tintBorder: 'border-[#FED7CD]',
      numColor: 'text-[#E04F36]',
      buttonHover: 'hover:text-[#E04F36]',
      badge: 'Life Saver',
      icon: Heart,
      mobileAlign: 'self-start mr-auto ml-1 xs:ml-2 sm:ml-4',
      mobileMargin: 'mt-0',
      zIndex: 'z-10',
    },
    {
      num: '02',
      title: 'Who Can Donate Blood?',
      description:
        'Generally, healthy individuals aged 18–60 weighing at least 50 kg (110 lbs) with a minimum hemoglobin of 12.5 g/dL are eligible. A quick confidential screening assesses pulse, BP, and travel history to ensure 100% safety.',
      actionText: 'Check Eligibility',
      color: 'blue' as const,
      rotation: 'rotate-[2.5deg]',
      hoverRotation: 'hover:rotate-0',
      tintBg: 'bg-[#EFF3FE]',
      tintBorder: 'border-[#D0E0FF]',
      numColor: 'text-[#2563EB]',
      buttonHover: 'hover:text-[#2563EB]',
      badge: 'Donor Vitals',
      icon: ShieldCheck,
      mobileAlign: 'self-end ml-auto mr-1 xs:mr-2 sm:mr-4',
      mobileMargin: 'mt-5 sm:mt-6 md:mt-0',
      zIndex: 'z-20',
    },
    {
      num: '03',
      title: 'What to Do Before & After Donating Blood',
      description:
        'Hydrate with 500ml water and eat an iron-rich meal 2–3 hours before. After donating, relax for 10–15 minutes, enjoy refreshments, keep the bandage on for 4 hours, and avoid strenuous exercise for the day.',
      actionText: 'Read Full Checklist',
      color: 'purple' as const,
      rotation: 'rotate-[-1.5deg]',
      hoverRotation: 'hover:rotate-0',
      tintBg: 'bg-[#F7EFFF]',
      tintBorder: 'border-[#E6DAFE]',
      numColor: 'text-[#7C3AED]',
      buttonHover: 'hover:text-[#7C3AED]',
      badge: 'Health Guide',
      icon: CheckCircle2,
      mobileAlign: 'self-start mr-auto ml-1 xs:ml-2 sm:ml-4',
      mobileMargin: 'mt-5 sm:mt-6 md:mt-0',
      zIndex: 'z-10',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-10 sm:py-14 bg-white overflow-hidden border-b border-slate-200/80 select-none"
      id="donor-knowledge-pinned-cards"
    >
      {/* Background container preserved for DOM hierarchy stability */}
      <div className="absolute inset-0 pointer-events-none opacity-0" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <ScrollReveal direction="up" delayMs={0}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200/80 mb-2 shadow-2xs">
              <BookOpen className="w-3 h-3 text-[#B4232C]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B4232C]">
                Essential Donor Knowledge
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Know Before You Give
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delayMs={120}>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              Quick, verified medical facts and preparation advice for our campus donors.
            </p>
          </ScrollReveal>
        </div>

        {/* Connecting Curved Dotted Pathway (Desktop / Tablet) */}
        <div className="hidden md:block absolute top-[52%] left-1/2 -translate-x-1/2 w-4/5 h-20 pointer-events-none z-0 opacity-70">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 80" fill="none">
            <path
              d="M 40 35 Q 220 70, 350 25 T 660 50"
              stroke="#CBD5E1"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 3 Pinned Note Cards: Zigzag on Mobile (2 left, 1 right), 3-column row on Desktop */}
        <div className="relative z-10 flex flex-col md:grid md:grid-cols-3 md:gap-5 lg:gap-6 items-stretch max-w-md md:max-w-4xl mx-auto">
          
          {/* Mobile Zigzag S-Curve Dotted Line connecting Pin 1 -> Pin 2 -> Pin 3 */}
          <div className="md:hidden absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M 38 6 C 62 16, 62 36, 62 49 C 62 62, 38 82, 38 93"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {cards.map((card, index) => {
            const Icon = card.icon;
            const motion = cardMotions[index] || { parallaxMultiplier: 25, tiltMultiplier: 1.0, horizontalMultiplier: 35 };
            const currentOffset = Math.round(scrollFactor * motion.parallaxMultiplier);
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const currentOffsetX = Math.round(scrollFactor * motion.horizontalMultiplier * (isMobile ? 0.6 : 1.0));
            const currentTilt = Number((scrollFactor * motion.tiltMultiplier).toFixed(2));

            // Staggered sequence as user moves down:
            // 1st card appears from left (index 0, delay 0ms)
            // 2nd card appears from right (index 1, delay 240ms)
            // 3rd card appears from left (index 2, delay 480ms)
            const enterDelay = index === 0 ? 0 : index === 1 ? 240 : 480;
            const enterDistance = isMobile ? 85 : 130;
            const enterX = index === 1 ? enterDistance : -enterDistance;

            return (
              <div
                key={card.num}
                className={`group relative transition-all duration-300 ${card.rotation} ${card.hoverRotation} hover:scale-[1.02] hover:z-30 ${card.mobileAlign} ${card.mobileMargin} ${card.zIndex} w-[76%] xs:w-[72%] max-w-[245px] sm:max-w-[260px] md:w-full md:max-w-[275px] md:mx-auto md:self-auto`}
              >
                {/* 3D Push Pin at the top with ambient glow */}
                <PushPin
                  color={card.color}
                  offsetY={currentOffset}
                  offsetX={currentOffsetX}
                  isRevealed={isRevealed}
                  enterX={enterX}
                  enterDelay={enterDelay}
                  hasSettled={hasSettled}
                />

                {/* Compact White Paper Note Card Container */}
                <div
                  className="relative bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_5px_10px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.14),0_8px_16px_-4px_rgba(0,0,0,0.06)] border border-slate-200/80 will-change-transform flex flex-col justify-between min-h-[245px] sm:min-h-[255px]"
                  style={{
                    transformOrigin: 'top center',
                    opacity: isRevealed ? 1 : 0,
                    transform: !isRevealed
                      ? `translate3d(${enterX}px, 0, 0) rotate(${index === 1 ? 5 : -5}deg)`
                      : hasSettled
                      ? `translate3d(${currentOffsetX}px, ${currentOffset}px, 0) rotate(${currentTilt}deg)`
                      : 'translate3d(0, 0, 0) rotate(0deg)',
                    transition: !isRevealed
                      ? 'none'
                      : hasSettled
                      ? 'transform 100ms ease-out, opacity 300ms ease-out'
                      : `opacity 750ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms, transform 750ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms`,
                    pointerEvents: isRevealed ? 'auto' : 'none',
                  }}
                >
                  
                  {/* Subtle paper fold highlight in upper corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-slate-100/60 to-transparent rounded-tr-2xl pointer-events-none" />

                  {/* Inner Tinted Paper Box */}
                  <div className={`${card.tintBg} ${card.tintBorder} border rounded-xl p-3 sm:p-3.5 relative`}>
                    
                    {/* Top Row: Hand-styled Number & Category Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xl sm:text-2xl font-extrabold ${card.numColor} font-['Caveat',cursive] leading-none tracking-wider`}
                      >
                        {card.num}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-slate-600 shadow-2xs border border-white">
                        {card.badge}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight leading-snug mb-1.5 line-clamp-2">
                      {card.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed line-clamp-4">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Action Button - Redirects to Guide page */}
                  <div className="pt-2.5 mt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => navigate('guide')}
                      className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-800 ${card.buttonHover} transition-colors cursor-pointer group-hover:translate-x-0.5 duration-200`}
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors">
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom subtle note */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('guide')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#B4232C] transition-colors cursor-pointer"
          >
            <span>Have specific medical questions? Explore our Complete Donation Guide</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </section>
  );
};
