const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/index.html');

  await page.setInputFiles('#file-input', 'image.png');
  await page.waitForTimeout(3000);

  await page.evaluate(() => console.log("Corners initially:", corners));

  await page.click('button[title="Pivoter à gauche"]');
  await page.waitForTimeout(3000);

  await page.evaluate(() => console.log("Corners after rotate (auto crop ran):", corners));

  await page.click('#btn-auto-crop');
  await page.waitForTimeout(3000);

  await page.evaluate(() => console.log("Corners after clicking auto crop again:", corners));

  await browser.close();
})();
