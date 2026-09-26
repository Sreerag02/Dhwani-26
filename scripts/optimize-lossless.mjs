// Re-encode raster artwork only when smaller, preserving decoded visible pixels.
// Run with: node scripts/optimize-lossless.mjs
import fs from 'node:fs/promises';
import sharp from 'sharp';

async function smallerLossless(input) {
  const output = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
  if (output.length >= input.length) return input;
  const before = await sharp(input).ensureAlpha().raw().toBuffer();
  const after = await sharp(output).ensureAlpha().raw().toBuffer();
  if (before.length !== after.length) throw new Error('Image dimensions changed');
  for (let i = 0; i < before.length; i += 4) {
    if (before[i + 3] !== after[i + 3] ||
      (before[i + 3] && (before[i] !== after[i] || before[i + 1] !== after[i + 1] || before[i + 2] !== after[i + 2]))) {
      throw new Error('Visible pixels changed');
    }
  }
  return output;
}

const files = [
  'public/assets/elements/CLOUDS.svg',
  'public/assets/elements/title.svg',
  'public/assets/merch/tshirt/tshirt-back.webp',
  'public/assets/merch/fanny/fanny 1.webp',
  'public/assets/merch/fanny/fanny 2.webp',
  'public/assets/merch/fanny/fanny 3.webp',
  'public/assets/merch/sec2_left.png',
];
for (const file of files) {
  const input = await fs.readFile(file);
  let output;
  if (file.endsWith('.svg')) {
    let svg = input.toString();
    for (const match of svg.matchAll(/data:image\/png;base64,([^"']+)/g)) {
      const raster = Buffer.from(match[1], 'base64');
      const optimized = await smallerLossless(raster);
      if (optimized !== raster) svg = svg.replace(match[0], `data:image/webp;base64,${optimized.toString('base64')}`);
    }
    output = Buffer.from(svg);
  } else if (file.endsWith('.webp')) {
    output = await smallerLossless(input);
  } else {
    // Keep PNG URLs and format intact; optimize its entropy coding losslessly.
    output = await sharp(input).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  }
  if (output.length < input.length) {
    await fs.writeFile(file, output);
    console.log(`${file}: ${input.length} → ${output.length} bytes`);
  }
}
