#!/usr/bin/env node

/**
 * Script to run menu API tests
 * 
 * Usage: npm run test:menu
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Running Menu API tests...');

// Use npx to run the local Jest installation
const testProcess = spawn(
  'npx', 
  ['jest', '--runInBand', '--forceExit', '--detectOpenHandles', 'menu-api.test.js'],
  { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '../tests')
  }
);

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Menu API tests completed successfully!');
  } else {
    console.error(`❌ Menu API tests failed with code ${code}`);
    process.exit(code);
  }
}); 