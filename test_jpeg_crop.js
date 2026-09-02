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

    // Override rotateSource locally to use JPEG
    await page.evaluate(() => {
        window.rotateSource = function(degrees) {
            const tempCanvas = document.createElement('canvas');
            const tCtx = tempCanvas.getContext('2d');

            if (Math.abs(degrees) === 90) {
                tempCanvas.width = rawImage.height;
                tempCanvas.height = rawImage.width;
            } else {
                tempCanvas.width = rawImage.width;
                tempCanvas.height = rawImage.height;
            }

            // FILL WITH WHITE BACKGROUND FOR JPEG
            tCtx.fillStyle = 'white';
            tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            tCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tCtx.rotate((degrees * Math.PI) / 180);
            tCtx.drawImage(rawImage, -rawImage.width / 2, -rawImage.height / 2);

            rawImage = new Image();
            rawImage.onload = () => {
                setupSourceCanvas();
                analyzeSourceImage();
                resetPoints(false);
                hideResultAlert();
                autoDetectFrame();
            };
            rawImage.src = tempCanvas.toDataURL('image/jpeg', 1.0);
        };
    });

    // Perform left rotate
    await page.evaluate(() => window.rotateSource(-90));
    await page.waitForTimeout(1000);

    const corners = await page.evaluate(() => corners);
    console.log("Corners after left rotate with JPEG:", corners);

    await browser.close();
})();
