const fs = require('fs');
const path = require('path');

// Base domain
const domain = 'https://tiffinwale.in';

// Date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Define routes and their priority/change frequency
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/testimonials', priority: '0.7', changefreq: 'monthly' },
  { path: '/submit-testimonial', priority: '0.5', changefreq: 'monthly' },
  { path: '/faq', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.4', changefreq: 'yearly' },
  { path: '/corporate-plans', priority: '0.8', changefreq: 'monthly' },
  
  // SEO-focused landing pages
  { path: '/meal-delivery', priority: '0.9', changefreq: 'weekly' },
  { path: '/tiffin-service', priority: '0.9', changefreq: 'weekly' },
  { path: '/food-delivery-service', priority: '0.9', changefreq: 'weekly' },
  
  // Add any additional routes here
];

// Generate XML sitemap content
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

routes.forEach(route => {
  sitemap += '  <url>\n';
  sitemap += `    <loc>${domain}${route.path}</loc>\n`;
  sitemap += `    <lastmod>${today}</lastmod>\n`;
  sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
  sitemap += `    <priority>${route.priority}</priority>\n`;
  sitemap += '  </url>\n';
});

sitemap += '</urlset>';

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the sitemap to file
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully at public/sitemap.xml');