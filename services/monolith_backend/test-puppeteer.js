const puppeteer = require('puppeteer');

async function testPuppeteer() {
  console.log('Testing Puppeteer...');
  
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-ipc-flooding-protection',
        '--memory-pressure-off',
        '--max_old_space_size=4096'
      ],
      timeout: 0,
      protocolTimeout: 0,
    });
    
    console.log('Browser launched successfully!');
    
    const page = await browser.newPage();
    console.log('New page created!');
    
    await page.setContent('<html><body><h1>Test PDF</h1></body></html>');
    console.log('Content set!');
    
    const pdf = await page.pdf({ format: 'A4' });
    console.log('PDF generated successfully! Size:', pdf.length, 'bytes');
    
    await browser.close();
    console.log('Browser closed!');
    
    console.log('✅ Puppeteer test passed!');
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPuppeteer();
