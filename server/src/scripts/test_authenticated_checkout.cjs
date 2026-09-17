const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('BROWSER RUNTIME ERROR:', err.message, err.stack));

    console.log('--- 1. Login as Customer ---');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 15000 });

    await page.waitForSelector('button', { timeout: 10000 });
    const buttons = await page.$$('button');
    let demoCustBtn = null;
    for (const b of buttons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('Customer')) {
        demoCustBtn = b;
        break;
      }
    }
    if (demoCustBtn) {
      console.log('Clicking Quick-Fill Demo Customer button...');
      await demoCustBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }

    const submitBtn = await page.$('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Nav:', e.message)),
      submitBtn.click()
    ]);
    console.log('After login URL:', page.url());

    console.log('--- 2. Navigate to Explore ---');
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle2', timeout: 15000 });

    console.log('--- 3. Click first vehicle to open Vehicle Details ---');
    await page.waitForSelector('a[href^="/vehicles/"]', { timeout: 10000 });
    const vehicleLinks = await page.$$('a[href^="/vehicles/"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Nav:', e.message)),
      vehicleLinks[0].click()
    ]);
    console.log('Vehicle Details URL:', page.url());

    console.log('--- 4. Click "Reserve Vehicle" button on FareCalculator ---');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Reserve Vehicle')),
      { timeout: 10000 }
    );
    const detailButtons = await page.$$('button');
    let reserveBtn = null;
    for (const b of detailButtons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('Reserve Vehicle')) {
        reserveBtn = b;
        break;
      }
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Nav:', e.message)),
      reserveBtn.click()
    ]);
    console.log('Checkout URL reached:', page.url());

    console.log('--- 5. Verify Checkout Page Content ---');
    await new Promise(r => setTimeout(r, 2500));
    const bodyText = await page.evaluate(() => document.body.innerText.trim());
    console.log('Checkout Page text length:', bodyText.length);

    console.log('--- 6. Click "Secure Slot & Proceed to Pay" on Checkout ---');
    await page.waitForFunction(
      () => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Secure Slot & Proceed to Pay'));
        return btn && !btn.disabled;
      },
      { timeout: 10000 }
    );

    const checkoutButtons = await page.$$('button');
    let payBtn = null;
    for (const b of checkoutButtons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('Secure Slot & Proceed to Pay')) {
        payBtn = b;
        break;
      }
    }

    if (payBtn) {
      console.log('Found enabled Secure Slot button, clicking...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Nav:', e.message)),
        payBtn.click()
      ]);
      console.log('Landed on Payment URL:', page.url());

      await new Promise(r => setTimeout(r, 2000));
      const payBody = await page.evaluate(() => document.body.innerText.trim());
      console.log('Payment Page text length:', payBody.length);
      console.log('Payment snippet:\n', payBody.substring(0, 300));

      if (payBody.includes('Complete Your Payment') || payBody.includes('Pay & Confirm Booking') || payBody.includes('Payment')) {
        console.log('ALL STEPS PASSED: Explore -> Vehicle Details -> Checkout -> Payment!');
      } else {
        console.log('Payment page content unexpected:', payBody);
      }
    }

  } catch (err) {
    console.error('Test script error:', err);
  } finally {
    await browser.close();
  }
})();
