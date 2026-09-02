const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    const imagePath = path.resolve(__dirname, 'image.png');
    const inputHandle = await page.$('#file-input');
    await inputHandle.setInputFiles(imagePath);
    await page.waitForTimeout(500); // Wait for load and auto-crop

    const corners1 = await page.evaluate(() => corners);
    console.log("Corners initially:", corners1);

    // Perform right rotate
    await page.evaluate(() => window.rotateSource(90));
    await page.waitForTimeout(1000);

    const corners2 = await page.evaluate(() => corners);
    console.log("Corners after right rotate:", corners2);

    await browser.close();
})();
