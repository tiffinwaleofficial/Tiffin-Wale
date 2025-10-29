import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
  trackButtonClick,
  trackLinkClick,
  trackSectionImpression,
  trackPageExit,
  trackGeographicData
} from '@/services/analytics';

interface UseAnalyticsOptions {
  pageName: string;
  trackScroll?: boolean;
  trackTime?: boolean;
  autoTrack?: boolean;
  sections?: Array<{ name: string; elementId?: string }>;
}

/**
 * Comprehensive Analytics Hook
 * Automatically tracks page views, scroll depth, time on page, and section impressions
 */
export const useAnalytics = (options: UseAnalyticsOptions) => {
  const { pageName, trackScroll = true, trackTime = true, autoTrack = true, sections = [] } = options;
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const maxScrollRef = useRef<number>(0);
  const pageHeightRef = useRef<number>(0);

  // Track page view on mount and location change
  useEffect(() => {
    if (autoTrack) {
      trackPageView({
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }

    // Fetch and track geographic data (once on initial load)
    trackGeographicData();

    // Reset tracking when page changes
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    pageHeightRef.current = document.documentElement.scrollHeight;
  }, [location, pageName, autoTrack]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScroll) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = Math.round(
        ((scrollTop + window.innerHeight) / pageHeightRef.current) * 100
      );

      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
        trackScrollDepth(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll]);

  // Track time on page
  useEffect(() => {
    if (!trackTime) return;

    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnPage(timeOnPage);
    }, 30000); // Track every 30 seconds

    return () => clearInterval(interval);
  }, [trackTime]);

  // Track section impressions using Intersection Observer
  useEffect(() => {
    if (!sections.length) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach((section, index) => {
      const element = section.elementId
        ? document.getElementById(section.elementId)
        : document.querySelector(`[data-section="${section.name}"]`);

      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && currentSection !== section.name) {
              setCurrentSection(section.name);
              trackSectionImpression(section.name, index + 1, {
                section_id: section.elementId,
                page_name: pageName
              });
            }
          });
        },
        {
          root: null,
          rootMargin: '-20% 0px',
          threshold: 0.5
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, currentSection, pageName]);

  // Track page exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackPageExit(location, timeOnPage, {
        max_scroll: maxScrollRef.current,
        page_name: pageName
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location, pageName]);

  // Utility functions for manual tracking
  const trackClick = (buttonName: string, buttonLocation: string, additionalParams?: any) => {
    trackButtonClick(buttonName, buttonLocation, {
      ...additionalParams,
      page_name: pageName
    });
  };

  const trackLink = (linkName: string, linkDestination: string, additionalParams?: any) => {
    trackLinkClick(linkName, linkDestination, {
      ...additionalParams,
      page_name: pageName
    });
  };

  return {
    trackClick,
    trackLink,
    currentSection,
    timeOnPage: Math.floor((Date.now() - startTimeRef.current) / 1000),
    scrollDepth: maxScrollRef.current
  };
};

