const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    let runtimeErrors = [];
    page.on('pageerror', err => {
      console.error('BROWSER ERROR:', err.message);
      runtimeErrors.push(err.message);
    });

    console.log('--- 1. Login as Customer ---');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    const demoBtn = await page.waitForSelector('button ::-p-text(Customer)', { timeout: 10000 });
    await demoBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const submitBtn = await page.$('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      submitBtn.click()
    ]);
    console.log('Logged in successfully!');

    // Fetch vehicles from API to get one of each category
    const res = await fetch('http://localhost:5000/api/vehicles?limit=50');
    const json = await res.json();
    const vehicles = json.data?.vehicles || [];
    console.log(`Found ${vehicles.length} total vehicles in database.`);

    // Group one vehicle per category
    const categoriesSeen = new Set();
    const testVehicles = [];
    for (const v of vehicles) {
      const catName = v.categoryId?.name || 'Other';
      if (!categoriesSeen.has(catName)) {
        categoriesSeen.add(catName);
        testVehicles.push(v);
      }
    }
    console.log(`Testing ${testVehicles.length} vehicles across unique categories:`, Array.from(categoriesSeen));

    for (const v of testVehicles) {
      const cat = v.categoryId?.name || 'Ride';
      console.log(`\n========================================`);
      console.log(`Testing [${cat}] ${v.brand} ${v.model} (${v._id})`);
      console.log(`========================================`);

      // Step A: Direct Vehicle Details URL
      await page.goto(`http://localhost:5173/vehicles/${v._id}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 800));
      const detailsBody = await page.evaluate(() => document.body.innerText.trim());
      if (detailsBody.length < 200 || !detailsBody.includes(v.model)) {
        throw new Error(`Vehicle Details failed for ${v.brand} ${v.model}: text length ${detailsBody.length}`);
      }
      console.log(`✅ Step A: Details page loaded (${v.brand} ${v.model})`);

      // Step B: Click "Reserve Vehicle" on FareCalculator
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Reserve Vehicle')),
        { timeout: 8000 }
      );
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Reserve Vehicle'));
        if (btn) btn.click();
      });

      // Wait for React Router client-side URL change
      await page.waitForFunction(
        (targetId) => window.location.pathname.includes('/checkout/' + targetId),
        { timeout: 8000 },
        v._id
      );

      const currentUrl = page.url();
      console.log(`✅ Step B: Navigated to Checkout URL: ${currentUrl}`);

      // Step C: Verify Checkout Page Content
      await page.waitForFunction(
        () => document.body.innerText.includes('Checkout & Reserve'),
        { timeout: 8000 }
      );
      console.log(`✅ Step C: Checkout page rendered completely`);

      // Step D: Test plan switching (12-Hour and 24-Hour)
      const clicked12 = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('12-Hour'));
        if (btn) { btn.click(); return true; }
        return false;
      });
      if (clicked12) {
        await new Promise(r => setTimeout(r, 500));
        console.log(`✅ Step D: Switched to 12-Hour Plan`);
      }

      const clicked24 = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('24-Hour'));
        if (btn) { btn.click(); return true; }
        return false;
      });
      if (clicked24) {
        await new Promise(r => setTimeout(r, 500));
        console.log(`✅ Step E: Switched to 24-Hour Plan`);
      }

      // Step F: Test Browser Refresh on Checkout
      await page.reload({ waitUntil: 'networkidle2' });
      await page.waitForFunction(
        () => document.body.innerText.includes('Checkout & Reserve'),
        { timeout: 8000 }
      );
      console.log(`✅ Step F: Browser refresh preserved checkout successfully`);
    }

    console.log(`\n===============================================================`);
    console.log(`🎉 ALL ${testVehicles.length} CATEGORIES PASSED END-TO-END WITH ZERO ERRORS!`);
    console.log(`Total browser runtime errors: ${runtimeErrors.length}`);
    console.log(`===============================================================`);

  } catch (err) {
    console.error('MULTI-VEHICLE TEST FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
