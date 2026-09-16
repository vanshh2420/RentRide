import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\vansh\\.gemini\\antigravity-ide\\brain\\c87915a2-d152-4653-91eb-2492f373965c\\screenshots';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

async function capture() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  let executablePath = null;
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    throw new Error('No local Chrome/Edge executable found!');
  }

  console.log(`🚀 Launching browser via: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    { name: 'homepage', url: 'http://localhost:5173/' },
    { name: 'explore', url: 'http://localhost:5173/explore' },
    { name: 'login', url: 'http://localhost:5173/login' },
    { name: 'register', url: 'http://localhost:5173/register' }
  ];

  for (const route of routes) {
    try {
      console.log(`📸 Navigating to ${route.url}...`);
      await page.goto(route.url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise((r) => setTimeout(r, 1500));

      const filePath = path.join(SCREENSHOT_DIR, `${route.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✅ Saved screenshot: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to capture ${route.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 Screenshot capture completed!');
}

capture().catch((err) => {
  console.error('Fatal error capturing screenshots:', err);
  process.exit(1);
});
