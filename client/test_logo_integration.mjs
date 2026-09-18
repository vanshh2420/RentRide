import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

async function testLogo() {
  const dir = 'screenshots';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Launching browser via msedge...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop Homepage (Navbar Logo & Favicon)
  {
    console.log('Testing Desktop Homepage Navbar...');
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Verify favicon tag in DOM
    const faviconHref = await page.locator('link[rel="icon"]').getAttribute('href');
    console.log('Configured Favicon href:', faviconHref);

    // Screenshot Desktop Navbar
    const nav = page.locator('nav').first();
    const navShot = path.resolve('screenshots/navbar_desktop_logo.png');
    await nav.screenshot({ path: navShot });
    console.log('Desktop Navbar screenshot saved:', navShot);

    // Verify logo link
    const logoLink = page.locator('a[aria-label="RentRide — Smart Mobility Marketplace Home"]').first();
    console.log('Found Logo Link:', await logoLink.isVisible());

    // Click logo link and verify route remains home
    await logoLink.click();
    await page.waitForTimeout(500);
    console.log('URL after clicking logo:', page.url());

    await context.close();
  }

  // 2. Mobile Navbar (375px)
  {
    console.log('Testing Mobile Navbar...');
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const nav = page.locator('nav').first();
    const mobileNavShot = path.resolve('screenshots/navbar_mobile_logo.png');
    await nav.screenshot({ path: mobileNavShot });
    console.log('Mobile Navbar screenshot saved:', mobileNavShot);
    await context.close();
  }

  // 3. Login Page Logo
  {
    console.log('Testing Login Page Logo...');
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const loginShot = path.resolve('screenshots/login_logo.png');
    await page.screenshot({ path: loginShot });
    console.log('Login Page screenshot saved:', loginShot);
    await context.close();
  }

  await browser.close();
  console.log('All branding tests completed successfully!');
}

testLogo().catch(err => {
  console.error('Error testing logo:', err);
  process.exit(1);
});
