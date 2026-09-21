import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import "./VideoTransition.css";

const FRAME_COUNT = 92;
const FRAME_PATH = "/assets/skate-frames/frame-";

// Build padded filenames once: frame-0001.webp … frame-0092.webp
const FRAME_SRCS = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const num = String(i + 1).padStart(4, "0");
  return `${FRAME_PATH}${num}.webp`;
});

/**
 * VideoTransition — scroll-scrubbed canvas image-sequence.
 *
 * All frames are preloaded into Image objects on mount, then the
 * correct frame is painted onto a <canvas> each animation frame.
 * This gives instant random-access with zero decode lag.
 */
export default function VideoTransition({ progress, start, end }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);

  // Preload all frames into Image objects
  useEffect(() => {
    const images = FRAME_SRCS.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imagesRef.current = images;
  }, []);

  // Paint loop: draws the current frame onto the canvas every rAF tick
  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const images = imagesRef.current;
      if (!canvas || !images.length) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Lerp towards target frame for smoothness
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;
      const next = Math.abs(diff) < 0.5 ? target : current + diff * 0.4;
      currentFrameRef.current = next;

      const frameIndex = Math.round(next);
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth) {
        const ctx = canvas.getContext("2d");
        // Match canvas internal size to its display size for sharpness
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = rect.width * dpr;
        const h = rect.height * dpr;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        // Draw with object-fit:cover behaviour
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = w / h;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgRatio > canvasRatio) {
          sw = img.naturalHeight * canvasRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / canvasRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Map scroll progress to target frame index
  useMotionValueEvent(progress, "change", (v) => {
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    targetFrameRef.current = t * (FRAME_COUNT - 1);
  });

  return (
    <div className="video-transition" aria-hidden="true">
      <canvas ref={canvasRef} className="video-transition__canvas" />
    </div>
  );
}
