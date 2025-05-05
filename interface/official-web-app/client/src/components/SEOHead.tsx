import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  schema?: any;
}

const defaultKeywords = [
  'tiffin wale',
  'tiffin wale bangalore',
  'tiffinwale',
  'tiffin-wale',
  'home-cooked meals',
  'tiffin service',
  'meal delivery',
  'food subscription',
  'indian food delivery',
  'daily meal service',
  'homemade food',
  'tiffin near me',
  'lunch delivery',
  'dinner delivery',
  'home style food',
  'authentic indian meals',
  'vegetarian tiffin',
  'veg meals',
  'non-veg meals',
  'healthy food delivery',
  'office lunch subscription',
  'student meal plan',
  'monthly tiffin service',
  'meal prep service',
  'fresh food delivery',
  'daily meal subscription',
  'corporate catering',
  'weekly meal plan',
  'best tiffin service',
  'affordable meal delivery'
];

const SEOHead: React.FC<SEOProps> = ({
  title = 'TiffinWale - Home-Style Meal Subscription Service | Best Tiffin Service',
  description = 'TiffinWale delivers fresh, authentic home-style meals directly to your doorstep with flexible subscription plans. Enjoy daily homemade food without the hassle of cooking. Order from India\'s best tiffin service today!',
  keywords = defaultKeywords,
  ogImage = '/logo.png',
  ogUrl = 'https://www.tiffin-wale.com',
  canonical = 'https://www.tiffin-wale.com',
  schema
}) => {
  
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'FoodService',
    name: 'TiffinWale',
    description: description,
    url: ogUrl,
    logo: `${ogUrl}${ogImage}`,
    image: `${ogUrl}${ogImage}`,
    telephone: '+91-1234567890',
    email: 'tiffinwaleofficial@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN'
    },
    priceRange: '₹₹',
    servesCuisine: 'Indian, Homestyle',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00'
      }
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '3999',
      highPrice: '7999',
      offerCount: '3'
    },
    sameAs: [
      'https://www.facebook.com/tiffinwale',
      'https://www.instagram.com/tiffinwale',
      'https://twitter.com/tiffinwale'
    ]
  };

  const schemaData = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${ogUrl}${ogImage}`} />
      <meta property="og:site_name" content="TiffinWale" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${ogUrl}${ogImage}`} />
      
      {/* Mobile Specific */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#FF9F43" />
      
      {/* Structured Data / Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="rating" content="general" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Bangalore" />
      <meta name="geo.position" content="12.9716;77.5946" />
      <meta name="ICBM" content="12.9716, 77.5946" />
      
      {/* Language and Locale */}
      <meta name="language" content="English" />
      <meta property="og:locale:alternate" content="hi_IN" />
      
      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="TiffinWale RSS Feed" href="https://www.tiffin-wale.com/feed.xml" />
    </Helmet>
  );
};

export default SEOHead;