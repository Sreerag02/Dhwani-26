// Prepare display copies; the supplied PNG originals remain untouched.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const source = 'public/assets/kanika assets/';
const target = 'public/assets/artists/kanika/';
await fs.mkdir(target, { recursive: true });
const files = await fs.readdir(source);
for (const file of files.filter(file => file.endsWith('.png'))) {
  const output = file.replace(/\.png$/, '.webp');
  await sharp(source + file).webp({ lossless: true, effort: 5 }).toFile(target + output);
}
console.log(`Prepared ${files.length} lossless WebP assets.`);
