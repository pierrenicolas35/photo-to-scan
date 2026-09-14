const fs = require('fs');
const { execSync } = require('child_process');

function createSvg(size) {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'>
      <rect width="24" height="24" fill="white"/>
      <path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' fill='#0056b3'/>
      <circle cx='17' cy='17' r='4' fill='#28a745'/>
      <path d='M15.8 17l-1.2-1.2-.8.8 2 2 3.2-3.2-.8-.8z' fill='white'/>
    </svg>`;
}

fs.writeFileSync('icon-192.svg', createSvg(192));
fs.writeFileSync('icon-512.svg', createSvg(512));

try {
    execSync('rsvg-convert -w 192 -h 192 icon-192.svg -o icon-192.png');
    execSync('rsvg-convert -w 512 -h 512 icon-512.svg -o icon-512.png');
    console.log("PNG icons generated successfully.");
} catch (e) {
    console.log("rsvg-convert not found. Using SVG files directly.");
}
