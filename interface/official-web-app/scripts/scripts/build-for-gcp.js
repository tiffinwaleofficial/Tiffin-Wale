import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Create the build directory
console.log('📦 Building application for Google Cloud Platform...');

// Build frontend assets
console.log('🔨 Building frontend assets...');
execSync('pnpm run build', { stdio: 'inherit' });

// Create a production package.json
console.log('📝 Creating production package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Simplify package.json for production
const prodPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: "module",
  engines: {
    node: ">=20.0.0"
  },
  scripts: {
    start: "node server.js"
  },
  dependencies: packageJson.dependencies
};

// Remove development dependencies from production package.json
delete prodPackageJson.dependencies['@types/node'];
delete prodPackageJson.dependencies['@types/react'];
delete prodPackageJson.dependencies['@types/react-dom'];
delete prodPackageJson.dependencies['@vitejs/plugin-react'];
delete prodPackageJson.dependencies['autoprefixer'];
delete prodPackageJson.dependencies['postcss'];
delete prodPackageJson.dependencies['tailwindcss'];
delete prodPackageJson.dependencies['typescript'];
delete prodPackageJson.dependencies['vite'];

// Write the production package.json to disk
fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

// Copy server files
console.log('📁 Copying server files...');
execSync('mkdir -p dist/server', { stdio: 'inherit' });
execSync('cp -r server/* dist/server/', { stdio: 'inherit' });

// Rename .ts files to .js for ESM compatibility
console.log('🔄 Converting server files for ESM compatibility...');
execSync('find dist/server -name "*.ts" -exec sh -c \'mv "$1" "${1%.ts}.js"\' _ {} \\;', { stdio: 'inherit' });

// Add .js extensions to all imports in server files for ESM compatibility
console.log('🔧 Updating import paths for ESM compatibility...');
execSync('find dist/server -name "*.js" -exec sed -i -e \'s/from "\\(\\.\\.\\?\\)/from "\\1.js/g\' {} \\;', { stdio: 'inherit' });

// Copy app.yaml
console.log('📄 Copying App Engine configuration...');
execSync('cp app.yaml dist/', { stdio: 'inherit' });

// Create a simple server.js for production
console.log('🔧 Creating production server entry point...');
const serverJs = `
// This file is auto-generated for production deployment
import { createServer } from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './server/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static assets
app.use(express.static(path.join(__dirname, '/')));

// JSON body parser
app.use(express.json());

// Register API routes
const httpServer = createServer(app);
registerRoutes(app, httpServer);

// Serve SPA for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
httpServer.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

fs.writeFileSync('dist/server.js', serverJs);

console.log('✅ Build completed successfully! Your app is ready for deployment.');
console.log('');
console.log('To deploy to Google App Engine, run:');
console.log('cd dist && gcloud app deploy');