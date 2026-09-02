const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('file://' + __dirname + '/index.html');

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles('image.png');
    await page.waitForTimeout(1000);

    // rotate
    await page.click('button[title="Pivoter à gauche"]');
    await page.waitForTimeout(2000);

    const dataUrl = await page.evaluate(() => rawImage.src);
    fs.writeFileSync('rawImage_after_rotate.png', dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

    await browser.close();
})();
