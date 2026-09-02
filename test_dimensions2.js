const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('file://' + __dirname + '/index.html');

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles('image.png');

    await page.waitForTimeout(1000);

    // Evaluate properties to see why OpenCV gets the wrong dimensions
    const info = await page.evaluate(() => {
        return {
            sourceCanvas: {w: sourceCanvas.width, h: sourceCanvas.height},
            rawImage: {w: rawImage.width, h: rawImage.height, nw: rawImage.naturalWidth, nh: rawImage.naturalHeight}
        };
    });
    console.log("Before:", info);

    await page.click('button[title="Pivoter à droite"]');
    await page.waitForTimeout(2000);

    const info2 = await page.evaluate(() => {
        return {
            sourceCanvas: {w: sourceCanvas.width, h: sourceCanvas.height},
            rawImage: {w: rawImage.width, h: rawImage.height, nw: rawImage.naturalWidth, nh: rawImage.naturalHeight}
        };
    });
    console.log("After:", info2);

    await browser.close();
})();
