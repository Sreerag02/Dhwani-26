// Recompress runtime cloud artwork without changing dimensions, alpha, or
// visible pixels. Existing URLs remain valid; larger encodings are discarded.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (/\.webp$/i.test(file) && (/cloud/i.test(entry.name) || file.includes('/curtain/'))) result.push(file);
  }
  return result;
}
let beforeTotal = 0, afterTotal = 0, changed = 0;
for (const file of await walk('public/assets')) {
  const input = await fs.readFile(file);
  const output = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
  beforeTotal += input.length;
  if (output.length >= input.length) { afterTotal += input.length; continue; }
  const before = await sharp(input).ensureAlpha().raw().toBuffer();
  const after = await sharp(output).ensureAlpha().raw().toBuffer();
  if (before.length !== after.length) throw new Error(`Dimensions changed: ${file}`);
  for (let i = 0; i < before.length; i += 4) {
    if (before[i + 3] !== after[i + 3] || (before[i + 3] &&
      (before[i] !== after[i] || before[i + 1] !== after[i + 1] || before[i + 2] !== after[i + 2]))) {
      throw new Error(`Visible pixels changed: ${file}`);
    }
  }
  await fs.writeFile(file, output);
  afterTotal += output.length;
  changed++;
  console.log(`${file}: ${input.length} -> ${output.length}`);
}
console.log(JSON.stringify({ changed, beforeTotal, afterTotal, saved: beforeTotal - afterTotal }));
