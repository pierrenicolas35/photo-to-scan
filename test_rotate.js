const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/index.html');

  await page.setInputFiles('#file-input', 'dummy.png');
  await page.waitForTimeout(1000);

  await page.click('button[title="Pivoter à gauche"]');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'after_rotate_dummy.png' });

  await page.click('button[title="Générer l\'aperçu"]');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'after_recadrage_dummy.png' });

  await browser.close();
})();
