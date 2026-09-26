// Keep supplied PNGs intact. Generate lossless display copies for the chapter.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const chapters = {
  'six eight': ['artist main', 'artist background', 'Six Eight Logo', 'base clouddd', 'cloud base 1', 'cloud base 2', 'title starvalue', 'dhwani logo png og', 'blue note', 'blue note 1', 'blue note 2', 'blue note 3', 'note', 'note 1', 'note 2', 'note 3'],
  srishti: ['Shape backround', 'Shape title background', 'title', 'Creating the resonance', 'Srishti LOGO', 'base cloud left', 'base cloud right', 'cloud 1', 'cloud 2', 'cloud 3', 'head effect 1', 'head effect 2', 'yellow note music', 'note', 'note 2', ...Array.from({length:7}, (_, i) => `man${i + 1}`)],
};
for (const [folder, names] of Object.entries(chapters)) {
  const source = `public/assets/artists/${folder}/`;
  const target = `public/assets/artists/optimized/${folder}/`;
  await fs.mkdir(target, {recursive:true});
  let before = 0, after = 0;
  for (const name of names) {
    before += (await fs.stat(source + name + '.png')).size;
    const result = await sharp(source + name + '.png').webp({lossless:true, effort:5}).toFile(target + name + '.webp');
    after += result.size;
  }
  console.log(`${folder}: ${before} → ${after} bytes (${names.length} assets)`);
}
