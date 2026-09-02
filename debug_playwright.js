const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Create a local server or use file://
    await page.goto('file://' + __dirname + '/index.html');

    // Inject a way to capture the tmpCanvas from detectFrameAttempt
    await page.evaluate(() => {
        window.debugImages = [];
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function(img, x, y, w, h) {
            originalDrawImage.apply(this, arguments);
            if (w && h && this.canvas.width === Math.round(w) && this.canvas.width < 1000) {
                // likely tmpCanvas in detectFrameAttempt
                window.debugImages.push(this.canvas.toDataURL());
            }
        };
    });

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles('image.png');

    await page.waitForTimeout(1000);

    // Click rotate
    await page.click('button[title="Pivoter à droite"]');
    await page.waitForTimeout(2000);

    // Click auto crop again
    await page.click('#btn-auto-crop');
    await page.waitForTimeout(2000);

    const debugImages = await page.evaluate(() => window.debugImages);
    fs.writeFileSync('debug_images.json', JSON.stringify(debugImages));

    await browser.close();
})();
