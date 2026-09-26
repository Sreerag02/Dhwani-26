// Run after prepare-artist-chapters.mjs. Supply smaller lossless images on
// narrow/standard-density screens, keeping full sources for high-density displays.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const manifest = {};
let bytes = 0;
for (const folder of ['six eight', 'srishti']) {
  const dir = `public/assets/artists/optimized/${folder}/`;
  for (const name of (await fs.readdir(dir)).filter(name => name.endsWith('.webp') && !name.endsWith('-small.webp'))) {
    const meta = await sharp(dir + name).metadata();
    const key = `${folder}/${name.slice(0, -5)}`;
    manifest[key] = { width: meta.width, height: meta.height };
    if (meta.width < 700) { bytes += (await fs.stat(dir + name)).size; continue; }
    const width = Math.round(meta.width / 2);
    const result = await sharp(dir + name).resize({width}).webp({lossless:true, effort:5}).toFile(dir + name.replace('.webp', '-small.webp'));
    manifest[key].smallWidth = width;
    bytes += result.size;
  }
}
await fs.writeFile('src/sections/artists/imageSizes.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Small-screen asset set: ${bytes} bytes`);
