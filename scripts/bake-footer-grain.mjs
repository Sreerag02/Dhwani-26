// Bake the existing SVG noise once instead of filtering a viewport each frame.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0"/></filter><rect width="256" height="256" filter="url(#grain)"/></svg>`;
await fs.mkdir('public/assets/runtime/footer', { recursive: true });
await sharp(Buffer.from(svg)).webp({ lossless: true }).toFile('public/assets/runtime/footer/grain.webp');
