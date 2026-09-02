const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/index.html');

  await page.setInputFiles('#file-input', 'image.png');
  await page.waitForTimeout(2000);

  await page.click('button[title="Pivoter à gauche"]');
  await page.waitForTimeout(2000);

  // click "Cadrage Automatique"
  await page.evaluate(() => autoDetectFrame());
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'after_recadrage_issue.png' });

  await browser.close();
})();
