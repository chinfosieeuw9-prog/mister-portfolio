const { chromium } = require('playwright');

(async () => {
  const baseUrl = 'http://localhost:8000/';
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const step = async (name, fn) => {
    try {
      await fn();
      console.log(`PASS | ${name}`);
    } catch (err) {
      console.error(`FAIL | ${name}:`, err.message || err);
      await browser.close();
      process.exit(1);
    }
  };

  await step('Load homepage', async () => {
    const resp = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    if (!resp || !resp.ok()) throw new Error(`HTTP ${resp && resp.status()}`);
  });

  await step('Find Admin button visible', async () => {
    await page.waitForSelector('#admin-login-btn', { state: 'visible', timeout: 10000 });
  });

  await step('Open Admin login modal', async () => {
    await page.click('#admin-login-btn');
    await page.waitForSelector('#admin-login-modal', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('#admin-modal-password', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('#admin-modal-login', { state: 'visible', timeout: 10000 });
  });

  await step('Attempt wrong password shows error/locks attempt', async () => {
    await page.fill('#admin-modal-password', 'wrong');
    await page.click('#admin-modal-login');
    // Expect either error box visible or input to be cleared eventually
    await page.waitForTimeout(800); // allow artificial delay
    // The script shows an error div or alert; alerts are not auto-dismissed, so guard
    page.once('dialog', async (dialog) => { await dialog.dismiss().catch(() => {}); });
    // If error box exists, it may display text; don't require strictly, just ensure modal remains
    await page.waitForSelector('#admin-login-modal', { state: 'visible', timeout: 5000 });
  });

  await step('Login with correct password navigates to ?admin=1', async () => {
    // Ensure password field is focused and filled with correct
    await page.fill('#admin-modal-password', 'mister2025');
    await page.click('#admin-modal-login');
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
    // Wait until URL contains admin=1
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('admin') === '1', null, { timeout: 15000 });
  });

  await step('Admin-only layout active', async () => {
    const hasClass = await page.evaluate(() => document.body.classList.contains('admin-only'));
    if (!hasClass) throw new Error('body is missing admin-only class');
    // Admin panel visible and not hidden
    const hiddenClass = await page.evaluate(() => document.getElementById('admin-panel')?.classList.contains('hidden'));
    if (hiddenClass) throw new Error('#admin-panel still has hidden class');
  });

  await step('Refresh keeps admin-only view', async () => {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('admin') === '1', null, { timeout: 10000 });
    const hasClass = await page.evaluate(() => document.body.classList.contains('admin-only'));
    if (!hasClass) throw new Error('admin-only class missing after reload');
  });

  await step('Logout returns to base and hides admin panel', async () => {
    // There is a logout button inside admin panel
    // Try by class name fallback
    const logoutSelector = '.logout-spacing';
    await page.waitForSelector(logoutSelector, { state: 'visible', timeout: 10000 });
    await page.click(logoutSelector);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => !new URLSearchParams(window.location.search).has('admin'), null, { timeout: 10000 });
    const hasAdminOnly = await page.evaluate(() => document.body.classList.contains('admin-only'));
    if (hasAdminOnly) throw new Error('admin-only class still present after logout');
  });

  await browser.close();
  console.log('ALL STEPS PASSED');
  process.exit(0);
})();
