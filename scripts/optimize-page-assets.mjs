// Generate smaller runtime copies; original artwork remains untouched.
// Re-run after changing source artwork. The manifest retains rewritten inputs.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const manifestPath = 'scripts/page-assets.json';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch(() => '{}'));
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const sources = (await walk('src')).filter(file => /\.(jsx?|css)$/.test(file));
const contents = await Promise.all(sources.map(file => fs.readFile(file, 'utf8')));
for (const content of contents) {
  for (const [url] of content.matchAll(/\/assets\/[^"'`\n)]+?\.(?:webp|png|jpe?g)/g)) {
    if (url.startsWith('/assets/runtime/')) continue;
    const file = 'public' + decodeURIComponent(url);
    const stat = await fs.stat(file).catch(() => null);
    if (!stat) continue;
    const meta = await sharp(file).metadata();
    if (stat.size < 180_000 && meta.width * meta.height < 2_000_000) continue;
    manifest[url] = '/assets/runtime/' + url.slice('/assets/'.length).replace(/\.(png|jpe?g)$/, '.$1.webp');
  }
}
let before = 0, after = 0, beforePixels = 0, afterPixels = 0;
for (const [url, target] of Object.entries(manifest)) {
  const input = 'public' + decodeURIComponent(url);
  const output = 'public' + decodeURIComponent(target);
  const original = await fs.readFile(input);
  const meta = await sharp(original).metadata();
  const { data, info } = await sharp(original)
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 5 }).toBuffer({ resolveWithObject: true });
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, data);
  before += original.length; after += data.length;
  beforePixels += meta.width * meta.height; afterPixels += info.width * info.height;
}
for (let i = 0; i < sources.length; i++) {
  let content = contents[i];
  for (const [url, target] of Object.entries(manifest)) content = content.replaceAll(url, target);
  if (content !== contents[i]) await fs.writeFile(sources[i], content);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: Object.keys(manifest).length, before, after, beforePixels, afterPixels }, null, 2));
