import { useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'motion/react';
import { ARTISTS, ARTIST_START, ARTIST_END, ARTIST_PROGRESS_INPUTS, ARTIST_PROGRESS_OUTPUTS } from './artistTimeline';
import KanikaLayer from './artists/KanikaLayer';
import SixEightLayer from './artists/SixEightLayer';
import SrishtiLayer from './artists/SrishtiLayer';
import './ArtistReveal.css';

const ARTIST_LAYERS = {
  'kanika-kapoor': KanikaLayer,
  'six-eight': SixEightLayer,
  srishti: SrishtiLayer,
};

function ArtistChapter({ artist, index, progress }) {
  const count = ARTISTS.length;
  // Overlap adjacent chapters so the incoming art arrives before the outgoing
  // composition clears. The existing Khai/merch transitions own the two ends.
  const start = index / count - (index ? .035 : 0);
  const end = (index + 1) / count + (index < count - 1 ? .035 : 0);
  const chapter = useTransform(progress, [start, end], [0, 1]);
  const visibility = useTransform(progress, value => value >= start && value <= end ? 'visible' : 'hidden');
  const opacity = useTransform(chapter, [0, .10, .90, 1], [0, 1, 1, 0]);
  const [prepared, setPrepared] = useState(() => progress.get() >= start - .10);
  useMotionValueEvent(progress, 'change', value => {
    if (!prepared && value >= start - .10) setPrepared(true);
  });
  const Layer = ARTIST_LAYERS[artist.id];
  return <motion.div className="artist-chapter" data-artist={artist.id}
    style={{ opacity, visibility, contentVisibility: visibility }}>
    {prepared && <Layer progress={chapter} />}
  </motion.div>;
}

export default function ArtistReveal({ journeyProgress }) {
  const compactProgress = useTransform(journeyProgress, [ARTIST_START, ARTIST_END], [0, 1]);
  const progress = useTransform(compactProgress, ARTIST_PROGRESS_INPUTS, ARTIST_PROGRESS_OUTPUTS);
  const visibility = useTransform(journeyProgress, value => value < ARTIST_START || value >= ARTIST_END ? 'hidden' : 'visible');
  const opacity = useTransform(progress, [0, .07 / ARTISTS.length, 1 - .11 / ARTISTS.length, 1], [0, 1, 1, 0]);
  const [prepared, setPrepared] = useState(() => journeyProgress.get() >= ARTIST_START - .12);
  useMotionValueEvent(journeyProgress, 'change', value => {
    if (!prepared && value >= ARTIST_START - .12) setPrepared(true);
  });
  return <motion.section className="artist-reveal" aria-label="Dhwani Artist Reveal"
    style={{ opacity, visibility, contentVisibility: visibility }}>
    {prepared && ARTISTS.map((artist, index) => <ArtistChapter key={artist.id} artist={artist} index={index} progress={progress} />)}
  </motion.section>;
}
