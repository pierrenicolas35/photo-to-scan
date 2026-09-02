const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/index.html');

  await page.setInputFiles('#file-input', 'image.png');
  await page.waitForTimeout(2000);

  const c1 = await page.evaluate(() => corners);
  console.log("Corners initially:", c1);

  await page.click('button[title="Pivoter à gauche"]');
  await page.waitForTimeout(2000);

  const c2 = await page.evaluate(() => corners);
  console.log("Corners after rotate:", c2);

  await page.click('#btn-auto-crop');
  await page.waitForTimeout(2000);

  const c3 = await page.evaluate(() => corners);
  console.log("Corners after auto crop click:", c3);

  await browser.close();
})();
