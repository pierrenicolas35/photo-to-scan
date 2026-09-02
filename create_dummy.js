const fs = require('fs');
const { createCanvas } = require('canvas');
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// white background
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, 800, 600);

// draw a document
ctx.fillStyle = '#ffffff';
ctx.shadowColor = 'rgba(0,0,0,0.5)';
ctx.shadowBlur = 10;
ctx.fillRect(100, 50, 600, 500);

// draw some text lines on document
ctx.fillStyle = '#000000';
ctx.shadowBlur = 0;
for(let i=0; i<10; i++) {
    ctx.fillRect(150, 100 + i*40, 500, 10);
}

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('dummy.png', buffer);
