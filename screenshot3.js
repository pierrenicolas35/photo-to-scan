const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);

  // Set a dummy image so the workspace shows
  await page.evaluate(() => {
    document.getElementById('drop-zone').style.display = 'none';
    document.getElementById('workspace').style.display = 'flex';
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'index_workspace.png' });
  await browser.close();
})();
