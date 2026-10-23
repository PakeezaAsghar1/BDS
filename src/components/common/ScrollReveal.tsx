import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'none';
  as?: React.ElementType;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
  as: Component = 'div',
  threshold = 0.12,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // If prefers-reduced-motion is active, reveal immediately without animation
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    // Fallback if IntersectionObserver is not available in browser
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // If already in viewport on mount (e.g. above-the-fold or user refreshed midway), reveal immediately
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const transitionDelayStyle: React.CSSProperties = delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : {};

  return (
    <Component
      ref={elementRef}
      style={transitionDelayStyle}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none motion-reduce:opacity-100 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : `opacity-0 ${direction === 'up' ? 'translate-y-5' : ''}`
      } ${className}`}
    >
      {children}
    </Component>
  );
};
