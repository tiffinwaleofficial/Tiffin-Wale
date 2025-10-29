import { analytics, logEvent, setUserProperties, setUserId } from "@/lib/firebase";

/**
 * Comprehensive Analytics Service
 * Tracks user behavior, demographics, engagement, and conversions
 */

interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

interface UserEngagementParams {
  engagement_time_msec?: number;
  scroll_depth?: number;
  time_on_page?: number;
}

interface CustomEventParams {
  [key: string]: any;
}

/**
 * Track page view with detailed parameters including geographic info
 */
export const trackPageView = (params: PageViewParams & UserEngagementParams & CustomEventParams = {}) => {
  if (!analytics) {
    console.warn('⚠️ Firebase Analytics not initialized');
    return;
  }

  // Enhanced tracking with geographic information
  const eventParams: any = {
    page_title: params.page_title || document.title,
    page_location: params.page_location || window.location.href,
    page_path: params.page_path || window.location.pathname,
    ...params
  };

  console.log('📊 Tracking page view:', eventParams);

  // Get geographic information from IP-based detection if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Include location data if user has granted permission
        eventParams.latitude = position.coords.latitude;
        eventParams.longitude = position.coords.longitude;
      },
      () => {
        // Silently fail if geolocation is not available or denied
      }
    );
  }

  logEvent(analytics, 'page_view', eventParams);
};

/**
 * Track user scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  if (!analytics) return;

  logEvent(analytics, 'scroll', {
    scroll_depth: depth,
    value: depth
  });

  // Track milestone events
  if (depth >= 25 && depth < 50) {
    logEvent(analytics, 'scroll_25_percent');
  } else if (depth >= 50 && depth < 75) {
    logEvent(analytics, 'scroll_50_percent');
  } else if (depth >= 75 && depth < 90) {
    logEvent(analytics, 'scroll_75_percent');
  } else if (depth >= 90) {
    logEvent(analytics, 'scroll_90_percent');
  }
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (timeInSeconds: number) => {
  if (!analytics) return;

  logEvent(analytics, 'timing_complete', {
    name: 'time_on_page',
    value: timeInSeconds
  });

  // Track milestone events
  if (timeInSeconds >= 30 && timeInSeconds < 60) {
    logEvent(analytics, 'time_30_seconds');
  } else if (timeInSeconds >= 60 && timeInSeconds < 120) {
    logEvent(analytics, 'time_1_minute');
  } else if (timeInSeconds >= 120 && timeInSeconds < 180) {
    logEvent(analytics, 'time_2_minutes');
  } else if (timeInSeconds >= 180) {
    logEvent(analytics, 'time_3_plus_minutes');
  }
};

/**
 * Track button click with context
 */
export const trackButtonClick = (buttonName: string, buttonLocation: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    ...additionalParams
  });

  // Track CTA specifically
  if (buttonName.toLowerCase().includes('cta') || buttonLocation.includes('cta')) {
    logEvent(analytics, 'cta_click', {
      cta_name: buttonName,
      cta_location: buttonLocation,
      ...additionalParams
    });
  }
};

/**
 * Track link click
 */
export const trackLinkClick = (linkName: string, linkDestination: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'link_click', {
    link_name: linkName,
    link_destination: linkDestination,
    ...additionalParams
  });
};

/**
 * Track section impression (when user views a section)
 */
export const trackSectionImpression = (sectionName: string, sectionPosition: number, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'section_impression', {
    section_name: sectionName,
    section_position: sectionPosition,
    ...additionalParams
  });
};

/**
 * Track user engagement (interactions on page)
 */
export const trackEngagement = (eventName: string, engagementType: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'user_engagement', {
    event_name: eventName,
    engagement_type: engagementType,
    ...additionalParams
  });
};

/**
 * Track form interaction
 */
export const trackFormInteraction = (formName: string, interactionType: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'form_interaction', {
    form_name: formName,
    interaction_type: interactionType,
    ...additionalParams
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'search', {
    search_term: searchTerm,
    ...additionalParams
  });
};

/**
 * Track video interaction
 */
export const trackVideoInteraction = (videoName: string, action: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'video_interaction', {
    video_name: videoName,
    video_action: action,
    ...additionalParams
  });
};

/**
 * Track purchase intent (when user shows interest in buying)
 */
export const trackPurchaseIntent = (productId: string, productName: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'add_to_cart', {
    items: [{
      item_id: productId,
      item_name: productName
    }],
    ...additionalParams
  });
};

/**
 * Track sign up / registration intent
 */
export const trackSignUpIntent = (method: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'sign_up', {
    method: method,
    ...additionalParams
  });
};

/**
 * Track download / install intent
 */
export const trackDownloadIntent = (appType: string, appName: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'app_install_prompt', {
    app_type: appType,
    app_name: appName,
    ...additionalParams
  });
};

/**
 * Track page exit with details
 */
export const trackPageExit = (exitPath: string, timeOnPage: number, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'page_exit', {
    exit_path: exitPath,
    time_on_page: timeOnPage,
    ...additionalParams
  });
};

/**
 * Set user demographics including geographic location
 */
export const setUserDemographics = (
  age?: number, 
  gender?: string, 
  interests?: string[],
  city?: string,
  state?: string,
  country?: string,
  region?: string
) => {
  if (!analytics) return;

  const properties: any = {};
  if (age) properties.age = age;
  if (gender) properties.gender = gender;
  if (interests) properties.interests = interests.join(',');
  
  // Geographic properties
  if (city) properties.city = city;
  if (state) properties.state = state;
  if (country) properties.country = country;
  if (region) properties.region = region;

  setUserProperties(analytics, properties);
};

/**
 * Set user geographic location
 */
export const setUserLocation = (city: string, state: string, country: string, region?: string) => {
  if (!analytics) return;

  setUserProperties(analytics, {
    city,
    state,
    country,
    ...(region && { region })
  });
  
  // Also log a location event for tracking
  logEvent(analytics, 'user_location_set', {
    city,
    state,
    country,
    ...(region && { region })
  });
};

/**
 * Track geographic data on page load
 */
export const trackGeographicData = async () => {
  if (!analytics) return;

  try {
    console.log('🌍 Fetching geographic data...');
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    console.log('🌍 Location data:', data);
    
    if (data.city && data.region && data.country_name) {
      const locationProps = {
        city: data.city,
        state: data.region,
        country: data.country_name,
        country_code: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      };
      
      console.log('📍 Setting location properties:', locationProps);
      setUserProperties(analytics, locationProps);

      logEvent(analytics, 'geographic_data_detected', {
        city: data.city,
        state: data.region,
        country: data.country_name,
        country_code: data.country_code
      });
      
      console.log('✅ Geographic data set successfully!');
    }
  } catch (error) {
    console.error('❌ Error fetching location:', error);
  }
};

/**
 * Set user ID for tracking
 */
export const setUserTrackingId = (userId: string) => {
  if (!analytics) return;
  setUserId(analytics, userId);
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, params: CustomEventParams = {}) => {
  if (!analytics) return;
  logEvent(analytics, eventName, params);
};

/**
 * Track social media click
 */
export const trackSocialMediaClick = (platform: string, socialAction: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'social_media_click', {
    social_network: platform,
    social_action: socialAction,
    ...additionalParams
  });
};

/**
 * Track share
 */
export const trackShare = (method: string, contentType: string, itemId: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
    ...additionalParams
  });
};

/**
 * Track view item (when user views a product/item)
 */
export const trackViewItem = (itemId: string, itemName: string, category?: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'view_item', {
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category
    }],
    ...additionalParams
  });
};

/**
 * Track login attempt
 */
export const trackLogin = (method: string, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'login', {
    method: method,
    ...additionalParams
  });
};

/**
 * Track exception / error
 */
export const trackException = (description: string, fatal: boolean = false, additionalParams?: CustomEventParams) => {
  if (!analytics) return;

  logEvent(analytics, 'exception', {
    description: description,
    fatal: fatal,
    ...additionalParams
  });
};

