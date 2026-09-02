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

    // Screenshot to verify the squished buttons are fixed
    await page.screenshot({ path: '/home/jules/verification/buttons_verification.png', fullPage: true });

    // Rotate left and re-screenshot to check crop visual
    await page.evaluate(() => window.rotateSource(-90));
    await page.waitForTimeout(1000);

    // Trigger auto-crop manually again to ensure OpenCV isn't breaking with jpeg export
    await page.evaluate(() => {
        resetPoints(false);
        autoDetectFrame();
    });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/crop_verification.png', fullPage: true });

    await browser.close();
})();
