const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('file://' + __dirname + '/index.html');

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles('image.png');

    await page.waitForTimeout(1000);

    const dim1 = await page.evaluate(() => [sourceCanvas.width, sourceCanvas.height, rawImage.width, rawImage.height]);
    console.log("Before rotate:", dim1);

    // Click rotate
    await page.click('button[title="Pivoter à droite"]');
    await page.waitForTimeout(2000);

    const dim2 = await page.evaluate(() => [sourceCanvas.width, sourceCanvas.height, rawImage.width, rawImage.height]);
    console.log("After rotate:", dim2);

    // Click auto crop again
    await page.click('#btn-auto-crop');
    await page.waitForTimeout(2000);

    const corners = await page.evaluate(() => corners);
    console.log("Corners:", corners);

    await browser.close();
})();
