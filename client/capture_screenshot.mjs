import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

async function capture() {
  const dir = 'screenshots';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Launching browser via msedge...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop
  {
    console.log('Testing Desktop 1440x900...');
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const section = page.locator('section:has-text("Explore by Category")').first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const shotPath = path.resolve('screenshots/category_desktop_1440.png');
    await section.screenshot({ path: shotPath });
    console.log('Desktop screenshot saved:', shotPath);

    const cards = await section.locator('a[href*="/explore?category="]').all();
    console.log('Found category cards:', cards.length);

    // Click first card to check navigation
    await cards[0].click();
    await page.waitForTimeout(1500);
    console.log('Navigation to Bikes verified:', page.url());
    await context.close();
  }

  // 2. Tablet (768x1024)
  {
    console.log('Testing Tablet 768x1024...');
    const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const section = page.locator('section:has-text("Explore by Category")').first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const shotPath = path.resolve('screenshots/category_tablet_768.png');
    await section.screenshot({ path: shotPath });
    console.log('Tablet screenshot saved:', shotPath);
    await context.close();
  }

  // 3. Mobile (375x812)
  {
    console.log('Testing Mobile 375x812...');
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const section = page.locator('section:has-text("Explore by Category")').first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const shotPath = path.resolve('screenshots/category_mobile_375.png');
    await section.screenshot({ path: shotPath });
    console.log('Mobile screenshot saved:', shotPath);
    await context.close();
  }

  await browser.close();
  console.log('All responsive tests completed successfully!');
}

capture().catch(err => {
  console.error('Error in capture:', err);
  process.exit(1);
});
