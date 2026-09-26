import imageSizes from './imageSizes.json';
import { motion, useReducedMotion, useTransform } from 'motion/react';

export const imagePath = (file, folder = 'kanika') =>
  `/assets/artists/${folder === 'kanika' ? 'kanika' : 'optimized/' + encodeURIComponent(folder)}/${encodeURIComponent(file)}.webp`;

// Coordinates are on the reference's 3240 × 1440 artboard, never viewport
// coordinates. Keeping one aspect ratio preserves the supplied composition.
export function Art({ folder = 'kanika', file, x, y, width, className = '', alt = '', style }) {
  const source = imagePath(file, folder);
  const size = imageSizes[`${folder}/${file}`];
  const srcSet = size?.smallWidth
    ? `${imagePath(file + '-small', folder)} ${size.smallWidth}w, ${source} ${size.width}w`
    : undefined;
  return <img srcSet={srcSet} sizes={srcSet ? `${width / 32.4}vw` : undefined} className={`artist-art ${className}`} src={source} alt={alt}
    draggable="false" width={width} style={{ left: `${x / 32.4}%`, top: `${y / 14.4}%`, width: `${width / 32.4}%`, ...style }} />;
}

export function RevealGroup({ progress, children, start = 0, fromX = 0, fromY = 45, scaleFrom = 1, className = '' }) {
  const reduced = useReducedMotion();
  const x = useTransform(progress, [start, start + .16, .84, 1], [fromX, 0, 0, -fromX * .4]);
  const y = useTransform(progress, [start, start + .16, .84, 1], [fromY, 0, 0, -fromY * .5]);
  const scale = useTransform(progress, [start, start + .16, .84, 1], [scaleFrom, 1, 1, 1.025]);
  const opacity = useTransform(progress, [start, start + .12, .87, 1], [0, 1, 1, 0]);
  return <motion.div className={`artist-layer ${className}`}
    style={reduced ? undefined : { x, y, scale, opacity }}>{children}</motion.div>;
}

