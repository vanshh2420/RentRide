import { chromium } from 'playwright-core';
import fs from 'fs';

async function run() {
  fs.mkdirSync('screenshots/after', { recursive: true });
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Explore & get vehicle ID
  await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle' });
  const vehicleLink = await page.$eval('a[href^="/vehicles/"]', el => el.getAttribute('href'));
  const vehicleId = vehicleLink.replace('/vehicles/', '');
  console.log('Using vehicle ID:', vehicleId);

  // 2. Log in as Customer using the quick-fill button
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Customer")');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 3. Checkout Page (authenticated customer)
  await page.goto(`http://localhost:5173/checkout/${vehicleId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/after/06_checkout_auth.png', fullPage: false });
  console.log('Authenticated Checkout page captured!');

  // 4. Customer Bookings Page
  await page.goto('http://localhost:5173/my-bookings', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/after/09_my_bookings.png', fullPage: false });
  console.log('Customer Bookings page captured!');

  // 5. Customer Profile
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/after/10_customer_profile.png', fullPage: false });
  console.log('Customer Profile page captured!');

  // 6. Log out and log in as Vendor
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Vendor")');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 7. Vendor Dashboard
  await page.goto('http://localhost:5173/vendor/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/after/11_vendor_dashboard.png', fullPage: false });
  console.log('Vendor Dashboard captured!');

  // 8. Log out and log in as Admin
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Admin")');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 9. Admin Dashboard
  await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/after/12_admin_dashboard.png', fullPage: false });
  console.log('Admin Dashboard captured!');

  await browser.close();
  console.log('All authenticated portals captured successfully!');
}

run().catch(console.error);
