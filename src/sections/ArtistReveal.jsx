import useProgressWindow from "../hooks/useProgressWindow";
import { motion, useTransform } from 'motion/react';
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
  const prepared = useProgressWindow(progress, start - .10, end + .10);
  const Layer = ARTIST_LAYERS[artist.id];
  return <motion.div className="artist-chapter" data-artist={artist.id}
    style={{ opacity, visibility }}>
    {prepared && <Layer progress={chapter} />}
  </motion.div>;
}

export default function ArtistReveal({ journeyProgress }) {
  const compactProgress = useTransform(journeyProgress, [ARTIST_START, ARTIST_END], [0, 1]);
  const progress = useTransform(compactProgress, ARTIST_PROGRESS_INPUTS, ARTIST_PROGRESS_OUTPUTS);
  const visibility = useTransform(journeyProgress, value => value < ARTIST_START || value >= ARTIST_END ? 'hidden' : 'visible');
  const opacity = useTransform(progress, [0, .07 / ARTISTS.length, 1 - .11 / ARTISTS.length, 1], [0, 1, 1, 0]);
  const prepared = useProgressWindow(journeyProgress, ARTIST_START - .08, ARTIST_END + .08);
  return <motion.section className="artist-reveal" aria-label="Dhwani Artist Reveal"
    style={{ opacity, visibility }}>
    {prepared && ARTISTS.map((artist, index) => <ArtistChapter key={artist.id} artist={artist} index={index} progress={progress} />)}
  </motion.section>;
}
