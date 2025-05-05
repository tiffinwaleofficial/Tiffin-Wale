/**
 * Script to fix missing images and create placeholder files to prevent 404 errors
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const assetsDir = path.resolve(publicDir, 'assets');
const imagesDir = path.resolve(assetsDir, 'images');

// Ensure directories exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Create a placeholder image if the file doesn't exist
function createPlaceholderImage(filePath, url = null) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder for: ${filePath}`);
    
    if (url) {
      // Try to download the image from URL
      downloadImage(url, filePath);
    } else {
      // Create a basic 1x1 transparent PNG as placeholder
      const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      fs.writeFileSync(filePath, transparentPixel);
    }
  }
}

// Download an image from URL
function downloadImage(url, outputPath) {
  console.log(`Downloading image from ${url} to ${outputPath}`);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${outputPath} successfully`);
      });
    } else {
      console.error(`Failed to download: ${url}, status code: ${response.statusCode}`);
      // Create a basic placeholder instead
      const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      fs.writeFileSync(outputPath, transparentPixel);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
    // Create a basic placeholder instead
    const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    fs.writeFileSync(outputPath, transparentPixel);
  });
}

// Fix the known 404 images
async function fixMissingImages() {
  try {
    // Ensure directories exist
    ensureDirectoryExists(publicDir);
    ensureDirectoryExists(assetsDir);
    ensureDirectoryExists(imagesDir);
    
    // Create essential files that might be referenced by code
    const filesToFix = [
      // Root level favicon files
      { path: path.resolve(publicDir, 'favicon.ico'), url: 'https://www.tiffin-wale.com/favicon.ico' },
      { path: path.resolve(publicDir, 'favicon.png'), url: 'https://www.tiffin-wale.com/favicon.png' },
      { path: path.resolve(publicDir, 'apple-touch-icon.png'), url: 'https://www.tiffin-wale.com/apple-touch-icon.png' },
      
      // Asset level favicon files
      { path: path.resolve(imagesDir, 'favicon.ico'), url: 'https://www.tiffin-wale.com/favicon.ico' },
      { path: path.resolve(imagesDir, 'favicon.png'), url: 'https://www.tiffin-wale.com/favicon.png' },
      { path: path.resolve(imagesDir, 'apple-touch-icon.png'), url: 'https://www.tiffin-wale.com/apple-touch-icon.png' },
      { path: path.resolve(imagesDir, 'icon.png'), url: 'https://www.tiffin-wale.com/assets/images/icon.png' },
      
      // Open Graph images
      { path: path.resolve(imagesDir, 'og-image.jpg'), url: 'https://www.tiffin-wale.com/assets/images/og-image.jpg' },
      { path: path.resolve(imagesDir, 'twitter-card.jpg'), url: 'https://www.tiffin-wale.com/assets/images/twitter-card.jpg' },
      
      // The specific 404 image from error logs
      { path: path.resolve(imagesDir, 'payment-methods.png'), url: null },
      { path: path.resolve(imagesDir, 'tiffinwale-storefront.jpg'), url: null }
    ];
    
    // Process each file
    for (const file of filesToFix) {
      createPlaceholderImage(file.path, file.url);
    }
    
    // Create robots.txt and sitemap.xml if they don't exist
    if (!fs.existsSync(path.resolve(publicDir, 'robots.txt'))) {
      console.log('Creating robots.txt');
      fs.writeFileSync(
        path.resolve(publicDir, 'robots.txt'),
        'User-agent: *\nAllow: /\nSitemap: https://www.tiffin-wale.com/sitemap.xml'
      );
    }
    
    if (!fs.existsSync(path.resolve(publicDir, 'sitemap.xml'))) {
      console.log('Creating sitemap.xml');
      fs.writeFileSync(
        path.resolve(publicDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.tiffin-wale.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.tiffin-wale.com/tiffin-service</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.tiffin-wale.com/pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
      );
    }
    
    // Create manifest.json if it doesn't exist
    if (!fs.existsSync(path.resolve(publicDir, 'manifest.json'))) {
      console.log('Creating manifest.json');
      fs.writeFileSync(
        path.resolve(publicDir, 'manifest.json'),
        JSON.stringify({
          "name": "TiffinWale - Delicious Home-Cooked Meals",
          "short_name": "TiffinWale",
          "description": "TiffinWale delivers nutritious, home-cooked meals right to your doorstep.",
          "start_url": "/",
          "display": "standalone",
          "background_color": "#ffffff",
          "theme_color": "#FF9F43",
          "icons": [
            {
              "src": "/assets/images/icon.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/apple-touch-icon.png",
              "sizes": "180x180",
              "type": "image/png"
            }
          ]
        }, null, 2)
      );
    }
    
    console.log('All missing images and files have been fixed!');
  } catch (error) {
    console.error('Error fixing missing images:', error);
  }
}

// Run the script
fixMissingImages(); 