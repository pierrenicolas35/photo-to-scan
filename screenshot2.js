const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000); // Wait for potential animations
  await page.screenshot({ path: 'index_preview.png' });
  await browser.close();
})();
