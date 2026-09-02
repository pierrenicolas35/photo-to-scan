const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('file://' + __dirname + '/index.html');

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles('image.png');

    // Wait for autoDetectFrame to finish initially
    await page.waitForTimeout(3000);

    const corners1 = await page.evaluate(() => corners);
    console.log("Corners originally:", corners1);

    // Rotate
    await page.click('button[title="Pivoter à droite"]');
    await page.waitForTimeout(3000);

    const corners2 = await page.evaluate(() => corners);
    console.log("Corners after rotate:", corners2);

    await browser.close();
})();
