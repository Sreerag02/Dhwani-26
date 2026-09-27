// Add the next artist here when their artwork is ready. Each artist gets a
// full scroll chapter inside the same pinned Dhwani Artist Reveal section.
export const ARTISTS = [
  { id: 'kanika-kapoor', name: 'Kanika Kapoor' },
  { id: 'six-eight', name: 'Six Eight' },
  { id: 'srishti', name: 'Srishti' },
];
export const ORIGINAL_SCROLL = 1530;
// Keep a full viewport of hold time for each fully assembled artist chapter.
const HOLD_TRIM = 0;
export const ARTIST_SCROLL = (400 - HOLD_TRIM) * ARTISTS.length;
export const TOTAL_SCROLL = ORIGINAL_SCROLL + ARTIST_SCROLL;
export const ARTIST_INSERT = .70;
export const ARTIST_START = .65 * ORIGINAL_SCROLL / TOTAL_SCROLL;
export const ARTIST_END = (.76 * ORIGINAL_SCROLL + ARTIST_SCROLL) / TOTAL_SCROLL;

// Map the shorter scroll track back to the existing animation timeline.
// Every layer has settled by .34; the first exit starts at .84.
const originalRange = .11 * ORIGINAL_SCROLL + 400 * ARTISTS.length;
const compactRange = originalRange - HOLD_TRIM * ARTISTS.length;
export const ARTIST_PROGRESS_INPUTS = [0];
export const ARTIST_PROGRESS_OUTPUTS = [0];
ARTISTS.forEach((_, index) => {
  const start = index / ARTISTS.length - (index ? .035 : 0);
  const end = (index + 1) / ARTISTS.length + (index < ARTISTS.length - 1 ? .035 : 0);
  const holdStart = (start + (end - start) * .34) * originalRange;
  const holdEnd = (start + (end - start) * .84) * originalRange;
  ARTIST_PROGRESS_INPUTS.push(
    (holdStart - index * HOLD_TRIM) / compactRange,
    (holdEnd - (index + 1) * HOLD_TRIM) / compactRange,
  );
  ARTIST_PROGRESS_OUTPUTS.push(holdStart / originalRange, holdEnd / originalRange);
});
ARTIST_PROGRESS_INPUTS.push(1);
ARTIST_PROGRESS_OUTPUTS.push(1);

// Keep the Artists menu landing on the fully assembled first poster.
const firstPosterProgress = .4 / ARTISTS.length;
const anchorSegment = ARTIST_PROGRESS_OUTPUTS.findIndex(value => value >= firstPosterProgress);
const anchorMix = (firstPosterProgress - ARTIST_PROGRESS_OUTPUTS[anchorSegment - 1]) /
  (ARTIST_PROGRESS_OUTPUTS[anchorSegment] - ARTIST_PROGRESS_OUTPUTS[anchorSegment - 1]);
export const ARTIST_ANCHOR_PROGRESS = ARTIST_PROGRESS_INPUTS[anchorSegment - 1] +
  anchorMix * (ARTIST_PROGRESS_INPUTS[anchorSegment] - ARTIST_PROGRESS_INPUTS[anchorSegment - 1]);
