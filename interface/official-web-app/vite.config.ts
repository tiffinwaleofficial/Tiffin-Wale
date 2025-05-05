import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { imagetools } from 'vite-imagetools';
import { visualizer } from 'rollup-plugin-visualizer';

// Copy favicon files from assets to client/public for development
const assetsDir = path.resolve(import.meta.dirname, "assets");
const publicDir = path.resolve(import.meta.dirname, "client/public");

// Ensure public directory exists
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Copy favicon files to root level for proper browser detection
try {
  copyFileSync(
    path.resolve(assetsDir, "images/favicon.ico"),
    path.resolve(publicDir, "favicon.ico")
  );
  copyFileSync(
    path.resolve(assetsDir, "images/favicon.png"),
    path.resolve(publicDir, "favicon.png")
  );
  console.log("Favicon files copied successfully!");
} catch (err) {
  console.warn("Could not copy favicon files: ", err);
}

// Default environment variables
process.env.VITE_CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'tiffinwale';
// Optional API key and upload preset - these would be set in your actual environment
process.env.VITE_CLOUDINARY_API_KEY = process.env.VITE_CLOUDINARY_API_KEY || '';
process.env.VITE_CLOUDINARY_UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: new URLSearchParams([
        ['format', 'webp'],
        ['quality', '80'],
        ['as', 'picture']
      ])
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
    // Custom plugin to copy favicon files to output directory during build
    {
      name: 'copy-favicon-files',
      closeBundle() {
        const outDir = path.resolve(import.meta.dirname, "dist/public");
        try {
          copyFileSync(
            path.resolve(assetsDir, "images/favicon.ico"),
            path.resolve(outDir, "favicon.ico")
          );
          copyFileSync(
            path.resolve(assetsDir, "images/favicon.png"),
            path.resolve(outDir, "favicon.png")
          );
          console.log("Favicon files copied to build directory successfully!");
        } catch (err) {
          console.warn("Could not copy favicon files to build directory: ", err);
        }
      }
    },
    process.env.ANALYZE === 'true' ? visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/analyze.html',
    }) : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@db": path.resolve(import.meta.dirname, "db"),
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Use this instead of publicDir to avoid overwriting our custom copied favicon files
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
    // Improved production build settings
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable chunking for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom',
            'wouter',
            'framer-motion',
          ],
          ui: [
            '@/components/ui',
          ],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Enable source maps for production debugging
    sourcemap: true,
  },
  server: {
    // Improve hot module replacement
    hmr: {
      overlay: true,
    },
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 
                'https://api.tiffinwale.com' : 
                'http://localhost:3001',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter', 'framer-motion'],
  },
});
